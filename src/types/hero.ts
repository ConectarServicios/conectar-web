export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string | null;
  image_path: string;
  button_text: string | null;
  button_url: string | null;
  active: boolean;
  featured: boolean;
  display_order: number;
};

export type HeroSlideFormValues = Omit<HeroSlide, "id">;

export type HeroActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
