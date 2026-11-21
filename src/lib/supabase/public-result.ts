export type PublicResult<T> = Readonly<{
  data: T;
  unavailable: boolean;
  /** Failure classification only; never stored as a successful snapshot. */
  allowStale?: boolean;
}>;

export function publicFailure<T>(data: T, status?: number): PublicResult<T> {
  return { data, unavailable: true, allowStale: status === 0 || status === 429 || typeof status === "number" && status >= 500 };
}
