import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { createServerTransport } from "../src/lib/supabase/server-transport.ts";
import { SUPABASE_BUDGET_MS } from "../src/lib/supabase/operation-policy.ts";

const budgets = { publicRead: 120, auth: 180, adminRead: 240, write: 360, upload: 420, invitation: 480 };

function setup(fetchImpl: typeof fetch, budgetOverrides = {}) {
  const entries: unknown[] = [];
  const transport = createServerTransport({ fetchImpl, budgets: { ...budgets, ...budgetOverrides }, diagnostic: entry => entries.push(entry) });
  const raw = transport.construct(() => createClient("https://audit.invalid", "test-publishable-key", {
    db: { retry: false }, global: { fetch: transport.fetch },
    auth: { persistSession: false, autoRefreshToken: false, skipAutoInitialize: true },
  }));
  return { client: transport.bind(raw, "public"), admin: transport.bind(raw), transport, entries };
}

function neverRespond(onAbort: () => void): typeof fetch {
  return async (_input, init) => new Promise((_, reject) => {
    const signal = init?.signal;
    const cancel = () => { onAbort(); reject(signal?.reason); };
    if (signal?.aborted) cancel();
    else signal?.addEventListener("abort", cancel, { once: true });
  });
}

test("budgets give reads, authentication and writes distinct allowances", () => {
  assert.deepEqual(SUPABASE_BUDGET_MS, {
    publicRead: 3000, auth: 5000, adminRead: 8000, write: 15000, upload: 20000, invitation: 20000,
  });
});

test("network failure and retryable HTTP statuses make only one data attempt", async () => {
  for (const status of [0, 429, 500, 503, 520]) {
    let attempts = 0;
    const { client, entries } = setup(async () => {
      attempts++;
      if (!status) throw new TypeError("private network failure with credentials");
      return Response.json({ message: "private error", code: "upstream" }, { status, headers: { "retry-after": "60" } });
    });
    const result = await client.from("news").select("id");
    assert.ok(result.error);
    assert.equal(attempts, 1);
    assert.doesNotMatch(JSON.stringify(entries), /private|credentials|retry-after/);
  }
});

test("successful responses preserve data, counts and authorization headers", async () => {
  let authorization: string | null = null;
  const { client } = setup(async (_input, init) => {
    authorization = new Headers(init?.headers).get("Authorization");
    return Response.json([{ id: "published" }], { headers: { "content-range": "0-0/1" } });
  });
  const result = await client.from("news").select("id", { count: "exact" }).eq("status", "published");
  assert.equal(result.error, null);
  assert.equal(result.count, 1);
  assert.deepEqual(result.data, [{ id: "published" }]);
  assert.equal(authorization, "Bearer test-publishable-key");
});

test("an invalid upstream body is an error, never successful content", async () => {
  const { client } = setup(async () => new Response("invalid JSON", { status: 200 }));
  const result = await client.from("news").select("id");
  assert.ok(result.error);
  assert.equal(result.data, null);
});

test("public timeout aborts the request and preserves the SDK error result", async () => {
  let cancellations = 0;
  const { client, entries } = setup(neverRespond(() => cancellations++));
  const started = Date.now();
  const result = await client.from("news").select("id");
  assert.equal(result.error?.code, "APP_TIMEOUT");
  assert.equal(cancellations, 1);
  assert.ok(Date.now() - started < 1000);
  assert.match(JSON.stringify(entries), /"outcome":"timeout"/);
  assert.match(JSON.stringify(entries), /"attempts":1/);
});

test("throwOnError and explicit caller cancellation remain effective", async () => {
  const { client, entries } = setup(neverRespond(() => {}));
  await assert.rejects(Promise.resolve(client.from("news").select("id").throwOnError()), { name: "TimeoutError" });
  const controller = new AbortController();
  const pending = Promise.resolve(client.from("news").select("id").abortSignal(controller.signal));
  setTimeout(() => controller.abort(new DOMException("Caller cancelled", "AbortError")), 20);
  assert.ok((await pending).error);
  assert.match(JSON.stringify(entries), /"outcome":"cancelled"/);
});

test("concurrent operations have independent signals and read budgets", async () => {
  const { client, admin } = setup(async (input, init) => {
    if (String(input).includes("slow")) return neverRespond(() => {})(input, init);
    await new Promise(resolve => setTimeout(resolve, 150));
    return Response.json([{ id: "healthy" }]);
  });
  const [slow, healthy] = await Promise.all([
    client.from("slow").select("id"), admin.from("healthy").select("id"),
  ]);
  assert.equal(slow.error?.code, "APP_TIMEOUT");
  assert.equal(healthy.error, null);
  assert.deepEqual(healthy.data, [{ id: "healthy" }]);
});

test("writes and RPCs receive a longer budget and are never replayed", async () => {
  let attempts = 0;
  const { client, entries } = setup(async () => {
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 160));
    return Response.json([{ id: "saved" }]);
  });
  assert.equal((await client.from("news").insert({ title: "Test" }).select("id")).error, null);
  assert.equal((await client.rpc("save_plan_with_features", {})).error, null);
  assert.equal(attempts, 2);
  assert.doesNotMatch(JSON.stringify(entries), /"outcome":"(?:error|timeout|cancelled)"/);
});

test("write timeout logs an uncertain outcome without leaking payloads", async () => {
  const { client, entries } = setup(neverRespond(() => {}), { write: 80 });
  await assert.rejects(Promise.resolve(client.from("news").insert({ title: "SECRET-PAYLOAD" }).select("id")), { name: "SupabaseOperationError", uncertainWrite: true });
  assert.match(JSON.stringify(entries), /"uncertainWrite":true/);
  assert.doesNotMatch(JSON.stringify(entries), /SECRET-PAYLOAD/);
});

test("real HTTP cancellation closes slow connections and interrupted bodies", async () => {
  for (const headersFirst of [false, true]) {
    let closed = false;
    const server = createServer((_request, response) => {
      response.on("close", () => { closed = true; });
      if (headersFirst) {
        response.writeHead(200, { "content-type": "application/json" });
        response.write("[");
      }
    });
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
    try {
      const address = server.address();
      assert.ok(address && typeof address !== "string");
      const transport = createServerTransport({ budgets, diagnostic() {} });
      await assert.rejects(transport.run({ name: "test.slow", kind: "publicRead" },
        () => transport.fetch(`http://127.0.0.1:${address.port}/slow`)), { name: "TimeoutError" });
      await new Promise(resolve => setTimeout(resolve, 40));
      assert.equal(closed, true, "the underlying socket must close, not just the caller's promise");
    } finally {
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
  }
});

test("SDK Auth refresh retries share the query deadline and keep the stored session", async () => {
  let attempts = 0;
  let removals = 0;
  const session = JSON.stringify({
    access_token: "expired-fixture", refresh_token: "private-refresh-fixture", expires_at: 1,
    expires_in: 3600, token_type: "bearer", user: { id: "fixture-user" },
  });
  const entries: unknown[] = [];
  const transport = createServerTransport({ budgets, diagnostic: entry => entries.push(entry), fetchImpl: async () => {
    attempts++;
    throw new TypeError("simulated network failure");
  } });
  const raw = transport.construct(() => createClient("https://audit.invalid", "fixture-key", {
    db: { retry: false }, global: { fetch: transport.fetch },
    auth: { skipAutoInitialize: true, persistSession: true, autoRefreshToken: false,
      storage: { getItem: () => session, setItem() {}, removeItem() { removals++; } } },
  }));
  const client = transport.bind(raw, "public");
  const started = Date.now();
  assert.equal((await client.from("news").select("id")).error?.code, "APP_TIMEOUT");
  assert.ok(Date.now() - started < 700);
  const attemptsAtDeadline = attempts;
  await new Promise(resolve => setTimeout(resolve, 300));
  assert.equal(attempts, attemptsAtDeadline, "Auth must not send retries after the operation expires");
  assert.equal(removals, 0, "a transient timeout must not clear a valid refresh session");
  assert.doesNotMatch(JSON.stringify(entries), /private-refresh-fixture|fixture-key/);
});

test("Auth and Storage calls have their own budgets and preserve error handling", async () => {
  const { client, entries } = setup(neverRespond(() => {}), { auth: 80, upload: 120, invitation: 140 });
  const auth = await client.auth.getUser("fixture-jwt");
  assert.ok(auth.error);
  assert.equal(auth.data.user, null);
  assert.match(JSON.stringify(entries), /"operation":"auth.getUser"/);
  await assert.rejects(client.storage.from("news-images").upload("fixture.png", new Blob(["test"])), { name: "SupabaseOperationError", uncertainWrite: true });
  await assert.rejects(client.auth.admin.inviteUserByEmail("fixture@example.invalid"), { name: "SupabaseOperationError", uncertainWrite: true });
  assert.match(JSON.stringify(entries), /"kind":"invitation"/);
});

test("Auth denial remains a denial rather than a fabricated user or session", async () => {
  const { client } = setup(async () => Response.json({ message: "Invalid token", code: "bad_jwt" }, { status: 401 }));
  const result = await client.auth.getUser("invalid-fixture");
  assert.equal(result.data.user, null);
  assert.equal(result.error?.status, 401);
});

test("lost write replies, RPC failures and Storage failures are uncertain and never replayed", async () => {
  for (const mode of ["insert", "rpc", "upload", "remove"] as const) {
    let committed = 0;
    const { client, entries } = setup(async () => {
      committed++;
      throw new TypeError("lost response after simulated commit");
    });
    const operation = mode === "insert" ? client.from("news").insert({ title: "fixture" })
      : mode === "rpc" ? client.rpc("save_plan_with_features", {})
      : mode === "upload" ? client.storage.from("news-images").upload("fixture.png", new Blob(["fixture"]))
      : client.storage.from("news-images").remove(["fixture.png"]);
    await assert.rejects(Promise.resolve(operation), { name: "SupabaseOperationError", uncertainWrite: true });
    assert.equal(committed, 1);
    assert.match(JSON.stringify(entries), /"uncertainWrite":true/);
  }
});

test("confirmed constraint failures remain normal errors, without fabricated uncertainty", async () => {
  const { client, entries } = setup(async () => Response.json({ code: "23505", message: "duplicate" }, { status: 409 }));
  const result = await client.from("news").insert({ title: "duplicate" });
  assert.equal(result.error?.code, "23505");
  assert.match(JSON.stringify(entries), /"uncertainWrite":false/);
});

test("missing mutation confirmation cannot reach compensating cleanup", async () => {
  const { client, entries } = setup(async () => new Response(null, { status: 204 }));
  await assert.rejects(Promise.resolve(client.from("news").update({ title: "fixture" }).select("id").maybeSingle()),
    { code: "APP_WRITE_UNCERTAIN", uncertainWrite: true });
  assert.match(JSON.stringify(entries), /"uncertainWrite":true/);
});

test("server failures on mutations are uncertain and do not trigger SDK retries", async () => {
  for (const mode of ["insert", "rpc", "upload", "remove"] as const) {
    let attempts = 0;
    const { client } = setup(async () => {
      attempts++;
      return Response.json({ message: "upstream unavailable" }, { status: 503 });
    });
    const operation = mode === "insert" ? client.from("news").insert({ title: "fixture" })
      : mode === "rpc" ? client.rpc("save_plan_with_features", {})
      : mode === "upload" ? client.storage.from("news-images").upload("fixture.png", new Blob(["fixture"]))
      : client.storage.from("news-images").remove(["fixture.png"]);
    await assert.rejects(Promise.resolve(operation), { code: "APP_WRITE_UNCERTAIN", uncertainWrite: true });
    assert.equal(attempts, 1);
  }
});

function cookieFixture(expiresAt: number) {
  const jwt = (exp: number) => `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: "fixture-user", exp })).toString("base64url")}.fixture-signature`;
  const session = { access_token: jwt(expiresAt), refresh_token: "fixture-refresh", expires_at: expiresAt,
    expires_in: 3600, token_type: "bearer", user: { id: "fixture-user" } };
  const cookies = [{ name: "sb-audit-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}` }];
  const writes: string[] = [];
  return { jwt, cookies, writes, adapter: {
    getAll: () => cookies,
    setAll: (updates: { name: string; value: string }[]) => {
      for (const update of updates) {
        writes.push(update.name);
        const old = cookies.find(cookie => cookie.name === update.name);
        if (old) old.value = update.value;
        else cookies.push({ name: update.name, value: update.value });
      }
    },
  } };
}

test("valid SSR cookies keep their token, authenticate normally and are not rewritten", async () => {
  const cookie = cookieFixture(Math.floor(Date.now() / 1000) + 3600);
  let bearer: string | null = null;
  const transport = createServerTransport({ budgets, diagnostic() {}, fetchImpl: async (_url, init) => {
    bearer = new Headers(init?.headers).get("Authorization");
    return Response.json({ id: "fixture-user" });
  } });
  const raw = transport.construct(() => createServerClient("https://audit.invalid", "fixture-key", {
    cookies: cookie.adapter, db: { retry: false }, auth: { skipAutoInitialize: true }, global: { fetch: transport.fetch },
  }));
  const result = await transport.bind(raw).auth.getUser();
  assert.equal(result.error, null);
  assert.equal(result.data.user?.id, "fixture-user");
  assert.match(String(bearer), /^Bearer ey/);
  assert.equal(cookie.writes.length, 0);
});

test("one cancelled waiter does not abort shared SSR refresh or another operation", async () => {
  const cookie = cookieFixture(1);
  let refreshes = 0;
  const paths: string[] = [];
  const transport = createServerTransport({ budgets: { ...budgets, publicRead: 60, auth: 500, adminRead: 400 }, diagnostic() {},
    fetchImpl: async (input, init) => {
      const path = new URL(String(input)).pathname;
      paths.push(path);
      if (path.includes("/token")) {
        refreshes++;
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 130);
          init?.signal?.addEventListener("abort", () => { clearTimeout(timer); reject(init.signal?.reason); }, { once: true });
        });
        return Response.json({ access_token: cookie.jwt(Math.floor(Date.now() / 1000) + 3600), refresh_token: "rotated-fixture",
          expires_in: 3600, token_type: "bearer", user: { id: "fixture-user" } });
      }
      return Response.json([{ id: "healthy" }]);
    } });
  const raw = transport.construct(() => createServerClient("https://audit.invalid", "fixture-key", {
    cookies: cookie.adapter, db: { retry: false }, auth: { skipAutoInitialize: true }, global: { fetch: transport.fetch },
  }));
  const [short, healthy] = await Promise.all([
    transport.bind(raw, "public").from("cancelled").select("id"),
    transport.bind(raw).from("healthy").select("id"),
  ]);
  assert.equal(short.error?.code, "APP_TIMEOUT");
  assert.equal(healthy.error, null);
  assert.deepEqual(healthy.data, [{ id: "healthy" }]);
  assert.equal(refreshes, 1);
  assert.ok(cookie.writes.length > 0, "successful rotation must still persist SSR cookies");
  assert.ok(!paths.some(path => path.endsWith("/cancelled")), "expired waiter cannot send a late data request");
});
