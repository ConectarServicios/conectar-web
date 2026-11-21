import { operationNoticeMessage } from "@/lib/supabase/operation-error";

export function AdminOperationNotice({ code }: Readonly<{ code?: string }>) {
  const message = operationNoticeMessage(code);
  return message ? <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{message}</p> : null;
}

export function AdminReadError() {
  return <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800" role="alert">No pudimos cargar los datos. El formulario no está disponible para evitar guardar información incompleta. Intentá nuevamente más tarde.</p>;
}
