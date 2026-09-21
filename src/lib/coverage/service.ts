import { notConfiguredCoverageProvider } from "./not-configured-provider.ts";
import { validateCoverageAddress } from "./validation.ts";
import { isAllowedContactNumber } from "../validations/contact-information.ts";
import type { CoverageProvider, CoverageResult } from "../../types/coverage.ts";

export async function checkCoverage(
  rawAddress: string,
  provider: CoverageProvider = notConfiguredCoverageProvider,
): Promise<CoverageResult> {
  const validation = validateCoverageAddress(rawAddress);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  return provider.checkCoverage({ address: validation.address });
}

export function buildCoverageWhatsAppUrl(phone: string | null, address: string) {
  if (!phone || !isAllowedContactNumber(phone)) return null;

  const digits = phone.replace(/\D/g, "");
  const message = `Hola, quiero consultar cobertura de Internet para: ${address.trim()}`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
