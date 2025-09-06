-- Adicionar campos para armazenar arquivos diretamente na tabela expenses
-- Executar no Supabase SQL Editor

-- Adicionar colunas para armazenar dados do arquivo
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS receipt_filename TEXT,
ADD COLUMN IF NOT EXISTS receipt_content_type TEXT,
ADD COLUMN IF NOT EXISTS receipt_size INTEGER,
ADD COLUMN IF NOT EXISTS receipt_data TEXT; -- Base64 do arquivo

-- Comentários para documentação
COMMENT ON COLUMN expenses.receipt_filename IS 'Nome original do arquivo de comprovante';
COMMENT ON COLUMN expenses.receipt_content_type IS 'Tipo MIME do arquivo (image/jpeg, image/png, application/pdf)';
COMMENT ON COLUMN expenses.receipt_size IS 'Tamanho do arquivo em bytes';
COMMENT ON COLUMN expenses.receipt_data IS 'Dados do arquivo codificados em base64';

-- Opcional: Remover coluna receipt_url se não estiver sendo usada
-- ALTER TABLE expenses DROP COLUMN IF EXISTS receipt_url;

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'expenses' 
ORDER BY ordinal_position;
