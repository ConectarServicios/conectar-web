export class SupabaseOperationError extends Error {
  readonly code: "APP_TIMEOUT" | "APP_CANCELLED" | "APP_WRITE_UNCERTAIN" | "APP_UNAVAILABLE";
  readonly uncertainWrite: boolean;
  constructor(
    code: SupabaseOperationError["code"],
    uncertainWrite = false,
  ) {
    super(code);
    this.name = "SupabaseOperationError";
    this.code = code;
    this.uncertainWrite = uncertainWrite;
  }
}

export async function administrativeRead<T extends { error?: unknown; status?: number }>(operation: PromiseLike<T>): Promise<T> {
  const result = await operation;
  const error = result.error;
  const status = result.status ?? (error && typeof error === "object" && "status" in error ? error.status : undefined);
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (error && (status === 0 || (typeof status === "number" && status >= 500) || code === "APP_TIMEOUT" || code === "APP_CANCELLED")) {
    throw new SupabaseOperationError("APP_UNAVAILABLE");
  }
  return result;
}

const uncertainMessage = "No pudimos confirmar el resultado. Es posible que los cambios se hayan guardado. Revisá el estado antes de volver a intentar; no se reintentó ni se revirtió automáticamente.";
const unavailableMessage = "El servicio no respondió correctamente. No pudimos completar la operación. Intentá nuevamente más tarde.";

export function operationErrorCode(error: unknown): "uncertain" | "unavailable" {
  // Redirects, notFound and programming errors must keep propagating.
  if (!(error instanceof SupabaseOperationError)) throw error;
  return error.uncertainWrite ? "uncertain" : "unavailable";
}

export function operationNoticeMessage(code?: string): string | null {
  return code === "uncertain" ? uncertainMessage : code === "unavailable" ? unavailableMessage : null;
}

export function operationErrorState(error: unknown): { message: string } {
  return { message: operationNoticeMessage(operationErrorCode(error))! };
}
