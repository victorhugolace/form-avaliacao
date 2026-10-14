
DROP POLICY IF EXISTS "Anyone can insert responses" ON public.form_responses;
DROP POLICY IF EXISTS "Anyone can update responses" ON public.form_responses;
DROP POLICY IF EXISTS "Anyone can read responses" ON public.form_responses;
REVOKE INSERT, UPDATE, SELECT ON public.form_responses FROM anon;
