import { isSocialPlatform, type SocialLinkFormValues } from "@/types/social-links";

type ParsedSocialLinkForm = {
  data?: SocialLinkFormValues;
  errors: Record<string, string>;
};

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export function parseSocialLinkForm(formData: FormData): ParsedSocialLinkForm {
  const errors: Record<string, string> = {};
  const platform = text(formData, "platform");
  const url = text(formData, "url");
  const displayOrderRaw = text(formData, "display_order");
  const displayOrder = Number(displayOrderRaw);

  if (!isSocialPlatform(platform)) errors.platform = "Seleccioná una plataforma válida.";
  if (!url) {
    errors.url = "Ingresá la URL del perfil.";
  } else {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new Error("Invalid protocol");
    } catch {
      errors.url = "Ingresá una URL válida que comience con http:// o https://.";
    }
  }
  if (!displayOrderRaw || !Number.isInteger(displayOrder) || displayOrder < 0) {
    errors.display_order = "Ingresá un entero mayor o igual a cero.";
  }

  if (Object.keys(errors).length || !isSocialPlatform(platform)) return { errors };
  return { errors, data: { platform, url, active: formData.get("active") === "on", display_order: displayOrder } };
}
