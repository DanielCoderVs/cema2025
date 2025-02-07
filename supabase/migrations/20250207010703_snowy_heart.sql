-- Criar a tabela files
CREATE TABLE IF NOT EXISTS public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  size bigint NOT NULL,
  url text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ativar Row Level Security
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso

-- Permitir que usuários autenticados leiam seus próprios arquivos
CREATE POLICY "Users can read their own files"
  ON public.files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Permitir que usuários autenticados insiram seus próprios arquivos
CREATE POLICY "Users can insert their own files"
  ON public.files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados atualizem seus próprios arquivos
CREATE POLICY "Users can update their own files"
  ON public.files
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados deletem seus próprios arquivos
CREATE POLICY "Users can delete their own files"
  ON public.files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Criar um índice para melhorar o desempenho das consultas
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files(user_id);

-- Criar uma função para atualizar automaticamente a coluna updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY INVOKER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Criar um trigger para atualizar updated_at antes de cada atualização na tabela files
CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
