export const FAQ_CATEGORIES = [
  "General",
  "Internet",
  "Wi-Fi",
  "Facturación y pagos",
  "Soporte técnico",
  "Instalación y cobertura",
  "Autogestión",
] as const;

export const FAQ_FILTER_ORDER = [
  "Internet",
  "Wi-Fi",
  "Facturación y pagos",
  "Soporte técnico",
  "Instalación y cobertura",
  "Autogestión",
  "General",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};
export type FaqFormValues = Pick<
  FaqItem,
  "question" | "answer" | "category" | "active" | "featured" | "display_order"
>;
export type FaqActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
