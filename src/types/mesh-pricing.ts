export const MESH_PRICING_MODES = ["rental", "purchase"] as const;

export type MeshPricingMode = (typeof MESH_PRICING_MODES)[number];

export type MeshPricing = {
  id: string;
  mode: MeshPricingMode;
  equipment_count: number;
  price: number;
  price_label: string | null;
  active: boolean;
  display_order: number;
  updated_at: string;
};

export type MeshPricingActionState = {
  message?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};
