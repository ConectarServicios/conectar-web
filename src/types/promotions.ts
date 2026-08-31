export const PROMOTION_PLACEMENTS = ["top_bar", "home", "plans", "conectar_play"] as const;
export type PromotionPlacement = (typeof PROMOTION_PLACEMENTS)[number];
export type PromotionStatus = "inactive" | "scheduled" | "current" | "expired";
export type Promotion = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  image_path: string | null;
  button_text: string | null;
  button_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  featured: boolean;
  placements: PromotionPlacement[];
  display_order: number;
  created_at: string;
  updated_at?: string;
};
export type PromotionFormValues = Omit<Promotion, "id" | "created_at" | "updated_at">;
export type PromotionActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
