-- Service requests table
CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  budget numeric(10,2),
  message text,
  ref_urls text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anon insert" ON public.service_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);
