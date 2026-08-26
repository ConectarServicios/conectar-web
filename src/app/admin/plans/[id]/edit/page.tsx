import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PlanForm } from "@/components/admin/plans/plan-form";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/plans";

export default async function EditPlanPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("plans")
    .select("id, name, slug, speed_mbps, description, regular_price, promotional_price, promotion_label, promotion_start, promotion_end, featured, active, display_order, plan_features(id, text, display_order)")
    .eq("id", id).order("display_order", { referencedTable: "plan_features", ascending: true }).maybeSingle();
  if (error) console.error("Unable to load plan for editing", error);
  if (!data || error) notFound();
  const plan = data as Plan;
  const { id: planId, ...initialValues } = plan;
  return <><AdminPageHeader description={`Actualizá los datos y características de ${plan.name}.`} title="Editar plan" /><PlanForm id={planId} initialValues={initialValues} /></>;
}
