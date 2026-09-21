import { checkCoverage } from "./service.ts";
import { validateCoverageAddress } from "./validation.ts";
import type { CoverageProvider } from "../../types/coverage.ts";

export function createCoveragePostHandler(provider: CoverageProvider) {
  return async function POST(request: Request) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Solicitud inválida." }, { status: 400 });
    }

    const address = body && typeof body === "object" && "address" in body
      ? (body as { address?: unknown }).address
      : undefined;
    if (typeof address !== "string") {
      return Response.json({ error: "Ingresá una dirección válida." }, { status: 400 });
    }

    const validation = validateCoverageAddress(address);
    if (!validation.valid) {
      return Response.json({ error: validation.message }, { status: 400 });
    }

    try {
      return Response.json(await checkCoverage(validation.address, provider));
    } catch {
      return Response.json({ address: validation.address, status: "review", reason: "geocoding-error" });
    }
  };
}
