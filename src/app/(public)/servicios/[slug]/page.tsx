import { notFound, permanentRedirect } from "next/navigation";

import { getServiceGroupBySlug } from "@/data/services/queries";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

const legacyGroupTargets: Readonly<Record<string, string>> = {
  "conectar-play": "/conectar-play",
  "conectividad-empresas": "/servicios#conectividad",
  "data-center-servicios-digitales": "/servicios#infraestructura",
  "seguridad-monitoreo": "/servicios#seguridad-hogar",
  "software-tecnologia": "/servicios#seguridad-gestionada",
};

export default async function ServiceGroupCompatibilityPage({ params }: Props) {
  const { slug } = await params;
  const legacyTarget = legacyGroupTargets[slug];

  if (legacyTarget) permanentRedirect(legacyTarget);

  const group = getServiceGroupBySlug(slug);
  if (!group) notFound();

  permanentRedirect(`/servicios#${group.slug}`);
}
