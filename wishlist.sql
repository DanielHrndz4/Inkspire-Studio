-- Wishlist table
CREATE TABLE public.wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlist" ON public.wishlist
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
