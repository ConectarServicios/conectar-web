"use client";

import { deleteHeroSlide } from "@/app/admin/hero/actions";

export function HeroDeleteButton({ id, title }: Readonly<{ id: string; title: string }>) {
  return <form action={deleteHeroSlide} onSubmit={(event) => { if (!window.confirm(`¿Eliminar “${title}” y su imagen? Esta acción no se puede deshacer.`)) event.preventDefault(); }}><input name="id" type="hidden" value={id} /><button className="font-bold text-red-700 hover:text-red-900" type="submit">Eliminar</button></form>;
}
