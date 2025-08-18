import { supabase } from "@/utils/supabase/server"

export interface CategoryRecord {
  id: string
  name: string
  image?: string | null
}

export const listCategories = async (): Promise<CategoryRecord[]> => {
  const { data, error } = await supabase.from("categories").select("id, name, image")
  if (error) throw error
  return data || []
}

export const createCategory = async (input: { name: string; image?: string }) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name: input.name, image: input.image }])
    .select()
    .single()
  if (error) throw error
  return data as CategoryRecord
}
