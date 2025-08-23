import { supabase } from "@/utils/supabase/server"

const BUCKET = "isbucket"

export interface ServiceRequestInput {
  name: string
  email: string
  service: string
  budget?: number
  message?: string
  ref_urls?: string[]
}

export async function uploadServiceFiles(files: File[]): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file)
    if (error) throw error
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
    urls.push(publicUrl)
  }
  return urls
}

export async function createServiceRequest(input: ServiceRequestInput) {
  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      name: input.name,
      email: input.email,
      service: input.service,
      budget: input.budget,
      message: input.message,
      ref_urls: input.ref_urls,
    })
    .select()
    .single()
  if (error) throw error
  return data
}
