export const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "YouTube", "LinkedIn"] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
  active: boolean;
  display_order: number;
};

export type SocialLinkFormValues = Omit<SocialLink, "id">;

export type SocialLinkActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return typeof value === "string" && SOCIAL_PLATFORMS.some((platform) => platform === value);
}
