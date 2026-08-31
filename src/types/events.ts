export const EVENT_STATUSES = ["draft", "published", "archived"] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];
export type EventTemporalStatus =
  | "upcoming"
  | "ongoing"
  | "finished"
  | "unscheduled";

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  image_path: string | null;
  location: string | null;
  address: string | null;
  starts_at: string | null;
  ends_at: string | null;
  status: EventStatus;
  featured: boolean;
  button_text: string | null;
  button_url: string | null;
  created_at: string;
  updated_at?: string;
};

export type EventFormValues = Omit<EventItem, "id" | "created_at" | "updated_at">;
export type EventActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
