export type PublicResult<T> = Readonly<{
  data: T;
  unavailable: boolean;
}>;
