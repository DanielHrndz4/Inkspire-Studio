import { supabase } from "@/utils/supabase/server"

export async function fetchWishlist(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("wishlist")
    .select("slug")
    .eq("user_id", userId)

  if (error) throw error
  return data?.map((r: any) => r.slug) || []
}

export async function toggleWishlistItem(userId: string, slug: string) {
  const { data, error } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("slug", slug)

  if (error) throw error

  if (data && data.length > 0) {
    const { error: delError } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", data[0].id)
    if (delError) throw delError
  } else {
    const { error: insError } = await supabase
      .from("wishlist")
      .insert({ user_id: userId, slug })
    if (insError) throw insError
  }
}

export async function clearWishlist(userId: string) {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
  if (error) throw error
}
