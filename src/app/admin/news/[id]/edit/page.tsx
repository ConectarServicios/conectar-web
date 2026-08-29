import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NewsForm } from "@/components/admin/news/news-form";
import { createClient } from "@/lib/supabase/server";
import type { NewsItem } from "@/types/news";
export default async function EditNewsPage({ params }: Readonly<{ params: Promise<{ id:string }> }>) { const { id } = await params; const supabase = await createClient(); const { data,error } = await supabase.from("news").select("id,title,slug,excerpt,content,cover_image,category,status,featured,published_at,author_id,created_at").eq("id",id).maybeSingle(); if (error || !data) notFound(); const item=data as NewsItem; const { id:itemId,created_at:created,author_id:author,...values}=item; void created; void author; return <><AdminPageHeader description={`Actualizá “${item.title}”.`} title="Editar noticia / comunicado"/><NewsForm id={itemId} initialValues={values}/></>; }
