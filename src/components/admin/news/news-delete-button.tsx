"use client";
import { deleteNews } from "@/app/admin/news/actions";
export function NewsDeleteButton({ id, title }: Readonly<{ id: string; title: string }>) { return <form action={deleteNews} onSubmit={(e) => { if (!window.confirm(`¿Eliminar “${title}”?\nTambién se eliminará su imagen. Esta acción no se puede deshacer.`)) e.preventDefault(); }}><input name="id" type="hidden" value={id}/><button className="font-bold text-red-700 hover:text-red-900">Eliminar</button></form>; }
