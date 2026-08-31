import { parseArgentinaDateTimeLocal } from "@/lib/utils/news-dates";
import { EVENT_STATUSES, type EventFormValues } from "@/types/events";
export const EVENT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const EVENT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export function normalizeEventSlug(value:string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""); }
export function validateEventImage(file:File) { if (!file.size) return; if(!EVENT_IMAGE_TYPES.includes(file.type)) return "Usá una imagen JPG, PNG o WebP."; if(file.size>EVENT_IMAGE_MAX_BYTES)return "La imagen no puede superar los 5 MB."; }
export function parseEventForm(form:FormData): {data?:EventFormValues;errors:Record<string,string>} {
  const text=(key:string)=>String(form.get(key)??"").trim(); const title=text("title"), slug=normalizeEventSlug(text("slug")), summary=text("summary"), description=text("description");
  const startRaw=text("starts_at"), endRaw=text("ends_at"), starts=startRaw?parseArgentinaDateTimeLocal(startRaw):null, ends=endRaw?parseArgentinaDateTimeLocal(endRaw):null;
  const status=text("status")||"draft"; const errors:Record<string,string>={};
  if(!title)errors.title="Ingresá un título."; if(!slug)errors.slug="Ingresá un slug."; if(!summary)errors.summary="Ingresá un resumen."; if(!description)errors.description="Ingresá la descripción.";
  if(!starts)errors.starts_at="Ingresá una fecha y hora de inicio válida."; if(endRaw&&!ends)errors.ends_at="Ingresá una finalización válida."; if(starts&&ends&&ends<starts)errors.ends_at="La finalización no puede ser anterior al inicio.";
  if(!EVENT_STATUSES.includes(status as EventFormValues["status"]))errors.status="Elegí un estado válido.";
  if(Object.keys(errors).length)return {errors};
  return {errors,data:{title,slug,summary,description,image_path:null,location:text("location")||null,address:text("address")||null,starts_at:starts,ends_at:ends,status:status as EventFormValues["status"],featured:form.get("featured")==="on",button_text:text("button_text")||null,button_url:text("button_url")||null}};
}
