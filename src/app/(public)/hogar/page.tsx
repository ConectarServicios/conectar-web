import { permanentRedirect } from "next/navigation";

export default function LegacyHogarPage() {
  permanentRedirect("/");
}
