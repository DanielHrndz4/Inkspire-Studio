"use server"

export async function subscribeNewsletter(formData: FormData) {
  await new Promise((r) => setTimeout(r, 600))
  const email = String(formData.get("email") ?? "").trim()
  if (!email || !email.includes("@")) {
    return { ok: false, message: "Por favor, ingresa un email válido." }
  }
  // Simulación de registro ok
  return { ok: true, message: "¡Gracias! Te has suscrito a nuestras novedades." }
}
