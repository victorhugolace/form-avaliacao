-- Migration for SIGEX MVP Evaluation Form

CREATE TABLE IF NOT EXISTS public.sigex_avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliador_nome text NOT NULL,
  data_avaliacao text NOT NULL,
  tarefas jsonb NOT NULL DEFAULT '{}'::jsonb,
  avaliacao_geral jsonb NOT NULL DEFAULT '{}'::jsonb,
  comentarios jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_step int NOT NULL DEFAULT 1,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.sigex_avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to sigex_avaliacoes"
  ON public.sigex_avaliacoes FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to sigex_avaliacoes"
  ON public.sigex_avaliacoes FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public select to sigex_avaliacoes"
  ON public.sigex_avaliacoes FOR SELECT TO anon, authenticated
  USING (true);

GRANT ALL ON public.sigex_avaliacoes TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.sigex_avaliacoes TO anon, authenticated;
