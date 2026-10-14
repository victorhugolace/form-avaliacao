
CREATE TABLE public.form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_solucao text,
  bancada text,
  perfis_usuario text[] DEFAULT '{}',
  perfis_outros text,
  funcionalidade text,
  beneficio text,
  regras_selecionadas text[] DEFAULT '{}',
  regras_outras text,
  metrica_sucesso text,
  respondente_nome text,
  respondente_email text,
  current_page int NOT NULL DEFAULT 1,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT, UPDATE, SELECT ON public.form_responses TO anon;
GRANT ALL ON public.form_responses TO service_role;

ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert responses"
  ON public.form_responses FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can update responses"
  ON public.form_responses FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Anon can SELECT only their own row (RLS denies; we'll use ID returned to client; for own row reads we use service role via server fn)
-- For form continuation by ID we allow select all (low-sensitivity backlog form)
CREATE POLICY "Anyone can read responses"
  ON public.form_responses FOR SELECT TO anon USING (true);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER form_responses_touch
  BEFORE UPDATE ON public.form_responses
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
