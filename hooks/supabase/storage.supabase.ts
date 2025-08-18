import { supabase } from "@/utils/supabase/server"

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "product-images"

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file)
  if (error) throw error
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
  return publicUrl
}
