-- Tables for product management

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  image text
);

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text,
  material text,
  price numeric(10,2) NOT NULL,
  discount_percentage numeric(5,2) DEFAULT 0,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Variants for colors, sizes, images and tags
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  color text,
  sizes text[],
  images text[],
  tags text[]
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Allow anon inserts (adjust policies as needed)
CREATE POLICY "Allow anon insert" ON public.categories FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert" ON public.products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert" ON public.product_variants FOR INSERT TO anon WITH CHECK (true);

-- Basic policies for other operations
CREATE POLICY "Allow anon select" ON public.categories FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update" ON public.categories FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.categories FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon select" ON public.products FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update" ON public.products FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.products FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon select" ON public.product_variants FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update" ON public.product_variants FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.product_variants FOR DELETE TO anon USING (true);
