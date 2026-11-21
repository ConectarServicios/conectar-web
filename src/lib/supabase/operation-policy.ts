// Budgets apply to one SDK operation, not to an entire page or Server Action.
export const SUPABASE_BUDGET_MS = {
  publicRead: 3_000,
  auth: 5_000,
  adminRead: 8_000,
  write: 15_000,
  upload: 20_000,
  invitation: 20_000,
} as const;

export type SupabaseOperationKind = keyof typeof SUPABASE_BUDGET_MS;
export type SupabaseReadMode = "public" | "admin";

export function readKind(mode: SupabaseReadMode): SupabaseOperationKind {
  return mode === "public" ? "publicRead" : "adminRead";
}
