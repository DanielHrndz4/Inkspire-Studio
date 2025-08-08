"use client"

import { MessageCircle } from 'lucide-react'

export default function WhatsAppFab({
  phone = "+525512345678",
  text = "Hola, me interesa su colección de Inkspire Studio.",
}: { phone?: string; text?: string }) {
  const href = `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full shadow-md"
      style={{ backgroundColor: "#25D366", color: "#fff" }}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
