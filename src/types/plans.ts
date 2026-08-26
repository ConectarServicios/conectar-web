export type PlanFeature = {
  id?: string;
  text: string;
  display_order: number;
};

export type Plan = {
  id: string;
  name: string;
  slug: string;
  speed_mbps: number;
  description: string | null;
  regular_price: number;
  promotional_price: number | null;
  promotion_label: string | null;
  promotion_start: string | null;
  promotion_end: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
  plan_features: PlanFeature[];
};

export type PlanFormValues = Omit<Plan, "id">;

export type PlanActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
