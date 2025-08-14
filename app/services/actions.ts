"use server"

export async function requestDesign(formData: FormData) {
  // Simulación de procesamiento
  await new Promise((res) => setTimeout(res, 800))

  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const service = String(formData.get("service") ?? "")
  const message = String(formData.get("message") ?? "")
  const budget = String(formData.get("budget") ?? "")

  // Retornar confirmación (en producción, aquí enviarías email o guardarías en DB)
  return {
    ok: true,
    summary: `Solicitud recibida de ${name} (${email}) para ${service}. Presupuesto: ${budget}.`,
    message,
  }
}
