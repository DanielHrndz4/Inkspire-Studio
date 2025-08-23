"use server"

import { createServiceRequest } from "@/hooks/supabase/services.supabase"

export async function requestDesign(_prevState: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const service = String(formData.get("service") ?? "")
  const message = String(formData.get("message") ?? "")
  const budgetValue = formData.get("budget")
  const budget = budgetValue ? Number(budgetValue) : undefined

  await createServiceRequest({
    name,
    email,
    service,
    budget,
    message,
  })

  return {
    ok: true,
    summary: `Solicitud recibida de ${name} (${email}) para ${service}. Presupuesto: ${budget ?? "N/A"}.`,
    message,
  }
}
