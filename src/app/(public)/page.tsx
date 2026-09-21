import { permanentRedirect } from "next/navigation";

export default function PublicRootPage() {
  permanentRedirect("/hogar");
}
