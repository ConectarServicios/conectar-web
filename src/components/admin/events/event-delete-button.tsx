"use client";
import { deleteEvent } from "@/app/admin/events/actions";
export function EventDeleteButton({id,title}:Readonly<{id:string;title:string}>){return <form action={deleteEvent} onSubmit={e=>{if(!confirm(`¿Eliminar “${title}”? Esta acción no se puede deshacer.`))e.preventDefault();}}><input name="id" type="hidden" value={id}/><button className="font-bold text-red-700">Eliminar</button></form>}
