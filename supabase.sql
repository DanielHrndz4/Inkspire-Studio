CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  tel TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.users
ADD COLUMN role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user';

-- Permisos para el rol anónimo
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user access" ON public.users FOR ALL USING (auth.uid() = id);

-- Asegúrate de que RLS esté habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Crear política de INSERT para rol anon
CREATE POLICY "Allow anon insert" 
ON public.users
FOR INSERT
TO anon
WITH CHECK (true);  -- true significa que cualquier fila puede ser insertada


-- Tabla principal de pedidos
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- enlaza al usuario
    full_name text NOT NULL,      -- nombre completo
    email text NOT NULL,          -- email del usuario
    phone text,                   -- teléfono
    address text,                 -- dirección
    city text,                    -- ciudad
    created_at timestamp with time zone DEFAULT now(),
    status text NOT NULL DEFAULT 'pendiente'
);


CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    title text NOT NULL,
    color text,
    size text,
    qty int NOT NULL,
    price numeric(10,2) NOT NULL -- precio por unidad
);
