const FORBIDDEN_URL_CHARACTERS = /[\s\\\u0000-\u001f\u007f]/;

export function isSafeExternalHttpUrl(value: string): boolean {
  if (!value || FORBIDDEN_URL_CHARACTERS.test(value)) return false;

  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function isSafePublicNavigationUrl(value: string): boolean {
  if (!value || FORBIDDEN_URL_CHARACTERS.test(value)) return false;
  if (value.startsWith("/")) return value.length === 1 || (value[1] !== "/" && value[1] !== "\\");
  return isSafeExternalHttpUrl(value);
}
