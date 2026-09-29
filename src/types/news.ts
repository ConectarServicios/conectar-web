export const NEWS_ALERT_CATEGORY = "Aviso" as const;
export const NEWS_CATEGORIES = [
  "Novedad",
  "Comunicado",
  "Mantenimiento",
  "Institucional",
  "Servicios",
  NEWS_ALERT_CATEGORY,
] as const;
export const NEWS_STATUSES = ["draft", "published", "archived"] as const;
export const NEWS_CONTENT_MODULES = ["mesh_pricing"] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type NewsStatus = (typeof NEWS_STATUSES)[number];
export type NewsContentModule = (typeof NEWS_CONTENT_MODULES)[number];
export type NewsItem = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  cover_image: string | null; category: string | null; status: NewsStatus;
  featured: boolean; published_at: string | null; alert_ends_at: string | null;
  content_module: NewsContentModule | null;
  author_id: string | null;
  created_at: string; author?: { full_name: string | null } | null;
};
export type NewsFormValues = Omit<NewsItem, "id" | "created_at" | "author" | "author_id">;
export type NewsActionState = { message?: string; fieldErrors?: Record<string, string> };
