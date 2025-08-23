import { supabase } from "@/utils/supabase/server"

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET
if (!BUCKET) {
  throw new Error("NEXT_PUBLIC_SUPABASE_BUCKET environment variable is not set");
}

export interface ServiceRequestInput {
  name: string
  email: string
  service: string
  budget?: number
  message?: string
}

export interface ServiceRequest {
  id: string
  created_at: string
  name: string
  email: string
  service: string
  budget?: number | null
  message?: string | null
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
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listServiceRequests(): Promise<ServiceRequest[]> {
  const { data, error } = await supabase
    .from("service_requests")
    .select("id, created_at, name, email, service, budget, message")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data || []
}
