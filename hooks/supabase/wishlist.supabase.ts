'use client';

import { supabase } from "@/utils/supabase/server";

function assertUuid(id: string | undefined | null): asserts id is string {
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Missing or invalid userId");
  }
}

async function getUserIdOrThrow() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data.user?.id;
  assertUuid(userId);
  return userId;
}

export async function fetchWishlist(): Promise<string[]> {
  const userId = await getUserIdOrThrow();

  const { data, error } = await supabase
    .from("wishlist")
    .select("slug")
    .eq("user_id", userId);

  if (error) throw error;
  return data?.map(r => r.slug) ?? [];
}

export async function toggleWishlistItem(slug: string) {
  const userId = await getUserIdOrThrow();

  const { data, error } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("slug", slug);

  if (error) throw error;

  if (data && data.length > 0) {
    const { error: delError } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", data[0].id);
    if (delError) throw delError;
  } else {
    const { error: insError } = await supabase
      .from("wishlist")
      .insert({ user_id: userId, slug });
    if (insError) throw insError;
  }
}

export async function clearWishlist() {
  const userId = await getUserIdOrThrow();
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}
