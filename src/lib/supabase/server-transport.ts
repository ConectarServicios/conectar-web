import { AsyncLocalStorage } from "node:async_hooks";
import { AuthRetryableFetchError, type SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_BUDGET_MS, readKind, type SupabaseOperationKind, type SupabaseReadMode } from "./operation-policy.ts";
import { SupabaseOperationError } from "./operation-error.ts";

type Operation = { name: string; kind: SupabaseOperationKind; requiresRow?: boolean };
type Scope = {
  controller: AbortController;
  attempts: number;
  errorCode?: string;
};
type Diagnostic = {
  event: "supabase_operation";
  operation: string;
  kind: SupabaseOperationKind;
  budgetMs: number;
  durationMs: number;
  attempts: number;
  outcome: "ok" | "error" | "timeout" | "cancelled";
  status?: number;
  errorCode?: string;
  uncertainWrite: boolean;
};

class OperationTimeout extends Error {
  constructor() {
    super("Supabase operation exceeded its time budget");
    this.name = "TimeoutError";
  }
}

function isWrite(kind: SupabaseOperationKind) {
  return kind === "write" || kind === "upload" || kind === "invitation";
}

function safeErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const cause = "cause" in error ? error.cause : undefined;
  const code = "code" in error && error.code ? error.code
    : cause && typeof cause === "object" && "code" in cause ? cause.code : undefined;
  return typeof code === "string" && /^[A-Z0-9_]{1,64}$/.test(code) ? code : undefined;
}

function resultStatus(value: unknown): { error: boolean; status?: number } {
  if (!value || typeof value !== "object") return { error: false };
  const error = "error" in value ? value.error : undefined;
  const errorStatus = error && typeof error === "object"
    ? "status" in error ? error.status : "statusCode" in error ? error.statusCode : undefined
    : undefined;
  const status = "status" in value && typeof value.status === "number" ? value.status
    : errorStatus !== undefined && Number.isFinite(Number(errorStatus)) ? Number(errorStatus) : undefined;
  return { error: "error" in value && Boolean(value.error), status };
}

/** Server-only transport: async context keeps concurrent operations independent. */
export function createServerTransport(options: {
  fetchImpl?: typeof fetch;
  budgets?: Record<SupabaseOperationKind, number>;
  diagnostic?: (entry: Diagnostic) => void;
} = {}) {
  const context = new AsyncLocalStorage<Scope>();
  const budgets = options.budgets ?? SUPABASE_BUDGET_MS;
  const diagnostic = options.diagnostic ?? ((entry: Diagnostic) => {
    // No URL, headers, query values, request bodies, credentials or raw errors.
    console.warn(JSON.stringify(entry));
  });

  async function run<T>(operation: Operation, task: () => PromiseLike<T>): Promise<T> {
    const parent = context.getStore();
    const controller = new AbortController();
    const scope: Scope = { controller, attempts: 0 };
    const started = Date.now();
    const budgetMs = budgets[operation.kind];
    const abortFromParent = () => controller.abort(parent?.controller.signal.reason);
    if (parent?.controller.signal.aborted) abortFromParent();
    else parent?.controller.signal.addEventListener("abort", abortFromParent, { once: true });
    const timer = setTimeout(() => controller.abort(new OperationTimeout()), budgetMs);
    let outcome: Diagnostic["outcome"] = "ok";
    let status: number | undefined;
    let uncertainWrite = false;
    let onAbort: () => void = () => {};
    try {
      const aborted = new Promise<never>((_, reject) => {
        onAbort = () => reject(controller.signal.reason);
        if (controller.signal.aborted) onAbort();
        else controller.signal.addEventListener("abort", onAbort, { once: true });
      });
      const value = await Promise.race([
        aborted,
        context.run(scope, async () => {
          controller.signal.throwIfAborted();
          return await task();
        }),
      ]);
      const result = resultStatus(value);
      if (value && typeof value === "object" && "error" in value) scope.errorCode ??= safeErrorCode(value.error);
      status = result.status;
      if (result.error) outcome = "error";
      // A lost/malformed reply or server failure does not prove that a mutation
      // was rolled back. This applies equally to PostgREST, RPC, Auth and Storage.
      const missingConfirmation = operation.requiresRow && value && typeof value === "object" && "data" in value && value.data == null;
      if (isWrite(operation.kind) && ((result.error && (!status || status >= 500)) || (!result.error && missingConfirmation))) {
        uncertainWrite = true;
        throw new SupabaseOperationError("APP_WRITE_UNCERTAIN", true);
      }
      return value;
    } catch (error) {
      scope.errorCode ??= safeErrorCode(error);
      outcome = controller.signal.aborted
        ? controller.signal.reason instanceof OperationTimeout ? "timeout" : "cancelled"
        : "error";
      if (isWrite(operation.kind) && !(error instanceof SupabaseOperationError)) {
        throw new SupabaseOperationError(controller.signal.aborted ? "APP_TIMEOUT" : "APP_WRITE_UNCERTAIN", true);
      }
      throw error;
    } finally {
      clearTimeout(timer);
      controller.signal.removeEventListener("abort", onAbort);
      parent?.controller.signal.removeEventListener("abort", abortFromParent);
      // Prevent late SDK retries from opening new connections after this operation.
      controller.abort(new DOMException("Operation finished", "AbortError"));
      const durationMs = Date.now() - started;
      if (outcome !== "ok" || durationMs >= budgetMs * 0.8) {
        diagnostic({ event: "supabase_operation", operation: operation.name, kind: operation.kind,
          budgetMs, durationMs, attempts: scope.attempts, outcome, status,
          errorCode: outcome === "timeout" ? "APP_TIMEOUT" : outcome === "cancelled" ? "APP_CANCELLED" : scope.errorCode,
          uncertainWrite: uncertainWrite || (isWrite(operation.kind) && outcome !== "ok" && (!status || status >= 500)) });
      }
    }
  }

  function construct<T>(factory: () => T): T {
    // Auth subscriptions can start a session read during SDK construction, before
    // the first explicit operation. Capture that work in a bounded async context.
    const controller = new AbortController();
    // This shared SDK initialization owns its own deadline. A cancelled waiter
    // must not abort it while another independent operation still needs it.
    const timer = setTimeout(() => controller.abort(new OperationTimeout()), budgets.auth);
    timer.unref();
    return context.run({ controller, attempts: 0 }, factory);
  }

  const boundedFetch: typeof fetch = async (input, init) => {
    const scope = context.getStore();
    if (!scope) {
      // Storage operations and SDK-internal requests also get a bounded body read.
      const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
      const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
      const kind = url.pathname.startsWith("/auth/v1/") ? "auth"
        : method === "GET" || method === "HEAD" ? "adminRead" : "upload";
      return run({ name: "sdk.request", kind }, () => boundedFetch(input, init));
    }
    const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const cancel = () => scope.controller.abort(callerSignal?.reason);
    if (callerSignal?.aborted) cancel();
    else callerSignal?.addEventListener("abort", cancel, { once: true });
    const signal = callerSignal
      ? AbortSignal.any([scope.controller.signal, callerSignal])
      : scope.controller.signal;
    try {
      signal.throwIfAborted();
      scope.attempts += 1;
      const response = await (options.fetchImpl ?? fetch)(input, { ...init, signal });
      // Fetch resolves at headers. Keep cancellation active until the body finishes.
      const body = await response.arrayBuffer();
      signal.throwIfAborted();
      return new Response(response.status === 204 || response.status === 205 || response.status === 304 ? null : body, {
        status: response.status, statusText: response.statusText, headers: response.headers,
      });
    } catch (error) {
      scope.errorCode ??= safeErrorCode(error);
      throw error;
    } finally {
      callerSignal?.removeEventListener("abort", cancel);
    }
  };

  function query<T extends object>(builder: T, operation: Operation, throws = false): T {
    return new Proxy(builder, {
      get(target, property, receiver) {
        const value = Reflect.get(target, property, receiver);
        if (property === "then" && typeof value === "function") {
          return (fulfilled: (value: unknown) => unknown, rejected: (error: unknown) => unknown) =>
            run(operation, () => Promise.resolve(target)).catch((error: unknown) => {
              // A write may already have committed. Do not turn its timeout into
              // a normal failed result that callers might compensate or replay.
              if (throws || isWrite(operation.kind)) throw error;
              const cancelled = error instanceof DOMException && error.name === "AbortError";
              if (!(error instanceof OperationTimeout) && !cancelled) throw error;
              return { data: null, error: { code: cancelled ? "APP_CANCELLED" : "APP_TIMEOUT", message: error.message, details: "", hint: "" },
                count: null, status: 0, statusText: "" };
            }).then(fulfilled, rejected);
        }
        if (typeof value !== "function") return value;
        return (...args: unknown[]) => {
          const next = Reflect.apply(value, target, args);
          const kind = ["insert", "update", "upsert", "delete"].includes(String(property)) ? "write" : operation.kind;
          const requiresRow = operation.requiresRow || (isWrite(kind) && (property === "single" || property === "maybeSingle"));
          return query(next as object, { ...operation, kind, requiresRow }, throws || property === "throwOnError");
        };
      },
    });
  }

  function auth<T extends object>(target: T, admin = false): T {
    const methods = new Set(["getUser", "getClaims", "getSession", "initialize", "refreshSession",
      "signInWithPassword", "signOut", "updateUser", "listUsers", "inviteUserByEmail", "deleteUser"]);
    return new Proxy(target, {
      get(original, property, receiver) {
        const value = Reflect.get(original, property, receiver);
        if (property === "admin") return auth(value as object, true);
        if (typeof value !== "function") return value;
        if (!methods.has(String(property))) return value.bind(original);
        return (...args: unknown[]) => {
          const kind = property === "inviteUserByEmail" ? "invitation"
            : admin ? property === "listUsers" ? "adminRead" : "write"
            : property === "updateUser" ? "write" : "auth";
          return run({ name: `auth.${String(property)}`, kind }, () => Reflect.apply(value, original, args))
            .catch((error: unknown) => {
              if (!(error instanceof OperationTimeout)) throw error;
              // Keep failures retryable from Auth's perspective: do not revoke a valid session.
              return { data: { user: null, session: null, claims: null },
                error: new AuthRetryableFetchError(error.message, 0) };
            });
        };
      },
    });
  }

  function bind<T extends SupabaseClient>(client: T, mode: SupabaseReadMode = "admin"): T {
    return new Proxy(client, {
      get(target, property, receiver) {
        const value = Reflect.get(target, property, receiver);
        if (property === "auth") return auth(value as object);
        if (property === "storage") return new Proxy(value as object, {
          get(storage, key) {
            const method = Reflect.get(storage, key);
            if (key !== "from") return typeof method === "function" ? method.bind(storage) : method;
            return (...args: unknown[]) => {
              const bucket = Reflect.apply(method, storage, args);
              return new Proxy(bucket as object, {
                get(objects, action) {
                  const call = Reflect.get(objects, action);
                  if (action === "upload" || action === "remove") return (...params: unknown[]) =>
                    run({ name: `storage.${String(action)}`, kind: action === "upload" ? "upload" : "write" },
                      async () => await Reflect.apply(call, objects, params));
                  return typeof call === "function" ? call.bind(objects) : call;
                },
              });
            };
          },
        });
        if ((property === "from" || property === "rpc") && typeof value === "function") return (...args: unknown[]) => {
          const name = typeof args[0] === "string" && /^[a-z_]{1,64}$/.test(args[0]) ? args[0] : "operation";
          return query(Reflect.apply(value, target, args) as object, {
            name: `${String(property)}.${name}`, kind: property === "rpc" ? "write" : readKind(mode),
          });
        };
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  }

  return { fetch: boundedFetch, run, bind, construct };
}
