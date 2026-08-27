export type Service = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  category: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
};

export type ServiceFormValues = Omit<Service, "id">;

export type ServiceActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
