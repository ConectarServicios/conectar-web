"use client";

import { deleteSocialLink } from "@/app/admin/social/actions";

export function SocialLinkDeleteButton({ id, platform }: Readonly<{ id: string; platform: string }>) {
  return (
    <form action={deleteSocialLink} onSubmit={(event) => { if (!window.confirm(`¿Eliminar el enlace de ${platform}?\nEsta acción no se puede deshacer.`)) event.preventDefault(); }}>
      <input name="id" type="hidden" value={id} />
      <button className="font-bold text-red-700 hover:text-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" type="submit">Eliminar</button>
    </form>
  );
}
