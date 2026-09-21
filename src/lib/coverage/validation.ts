export const COVERAGE_ADDRESS_MIN_LENGTH = 5;
export const COVERAGE_ADDRESS_MAX_LENGTH = 160;

export type CoverageAddressValidation =
  | { valid: true; address: string }
  | { valid: false; message: string };

export function validateCoverageAddress(value: string): CoverageAddressValidation {
  const address = value.trim();

  if (!address) {
    return { valid: false, message: "Ingresá tu dirección para continuar." };
  }

  if (address.length < COVERAGE_ADDRESS_MIN_LENGTH) {
    return { valid: false, message: "Ingresá una dirección más completa." };
  }

  if (address.length > COVERAGE_ADDRESS_MAX_LENGTH) {
    return {
      valid: false,
      message: `La dirección no puede superar los ${COVERAGE_ADDRESS_MAX_LENGTH} caracteres.`,
    };
  }

  return { valid: true, address };
}
