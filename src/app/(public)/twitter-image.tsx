import { createSocialImage } from "./social-image";

export const alt = "Conectar Servicios — soluciones de conectividad";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return createSocialImage(size);
}
