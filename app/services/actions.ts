"use server"

import { createServiceRequest, uploadServiceFiles } from "@/hooks/supabase/services.supabase"

export async function requestDesign(formData: FormData) {
  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const service = String(formData.get("service") ?? "")
  const message = String(formData.get("message") ?? "")
  const budgetValue = formData.get("budget")
  const budget = budgetValue ? Number(budgetValue) : undefined

  const files = formData
    .getAll("refs")
    .filter((f): f is File => f instanceof File && f.size > 0)
  let ref_urls: string[] = []
  if (files.length) {
    ref_urls = await uploadServiceFiles(files)
  }

  await createServiceRequest({
    name,
    email,
    service,
    budget,
    message,
    ref_urls,
  })

  return {
    ok: true,
    summary: `Solicitud recibida de ${name} (${email}) para ${service}. Presupuesto: ${budget ?? "N/A"}.`,
    message,
  }
}
