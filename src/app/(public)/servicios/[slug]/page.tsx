import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ServiceAreaIcon } from "@/components/public/service-area-icon";
import { ServiceProjectCard } from "@/components/public/service-project-card";
import { getPublicServiceProjectsByArea, serviceProjectImageUrl } from "@/lib/supabase/service-projects";
import { createClient } from "@/lib/supabase/server";
import { getPublicServiceAreaBySlug, getPublicServicesByArea } from "@/lib/supabase/services";
type Props = Readonly<{ params: Promise<{ slug: string }> }>;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const { data: area } = await getPublicServiceAreaBySlug(slug);
  if (!area) return { title: "Área no encontrada | Conectar Servicios" };
  return { title: `${area.name} | Conectar Servicios`, description: area.short_description ?? area.description ?? "Servicios de Conectar Servicios." };
}
export default async function ServiceAreaPage({ params }: Props) {
  const { slug } = await params; const { data: area } = await getPublicServiceAreaBySlug(slug);
  if (!area) notFound(); if (area.public_url) redirect(area.public_url);
  const [services, projects, supabase] = await Promise.all([getPublicServicesByArea(area.id), getPublicServiceProjectsByArea(area.id), createClient()]);
  return <main>
    <section className="bg-[#0b2440] py-20 text-white sm:py-28"><div className="public-container"><p className="text-sm font-bold tracking-[.22em] text-orange-400 uppercase">Servicios</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{area.name}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">{area.description ?? area.short_description}</p></div></section>
    <section className="public-container py-16 sm:py-24" aria-labelledby="area-services"><h2 className="text-3xl font-black text-slate-950 sm:text-4xl" id="area-services">Servicios del área</h2>{services.unavailable ? <p className="public-empty-state">Los servicios no están disponibles temporalmente.</p> : services.data.length === 0 ? <p className="public-empty-state">Estamos actualizando los servicios de esta área.</p> : <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{services.data.map((service) => <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm" key={service.id}><ServiceAreaIcon icon={service.icon}/><h3 className="mt-6 text-2xl font-black text-slate-950">{service.name}</h3>{service.short_description && <p className="mt-3 leading-7 text-slate-600">{service.short_description}</p>}{service.description && <p className="mt-3 text-sm leading-6 text-slate-500">{service.description}</p>}</article>)}</div>}</section>
    {!projects.unavailable && projects.data.length > 0 && <section className="border-y border-blue-100 bg-blue-50/70 py-16 sm:py-24" aria-labelledby="area-projects"><div className="public-container"><p className="text-sm font-black tracking-[.2em] text-orange-700 uppercase">Trabajo realizado</p><h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl" id="area-projects">Proyectos y soluciones</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Conocé algunas de las soluciones desarrolladas e implementadas por Conectar Servicios.</p><div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">{projects.data.map((project) => <ServiceProjectCard areaIcon={area.icon} imageUrl={serviceProjectImageUrl(supabase, project.image_path)} key={project.id} project={project}/>)}</div></div></section>}
    <section className="bg-blue-50 py-16"><div className="public-container text-center"><h2 className="text-3xl font-black text-slate-950">¿Necesitás más información?</h2><Link className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700" href="/#contacto">Contactanos</Link></div></section>
  </main>;
}
