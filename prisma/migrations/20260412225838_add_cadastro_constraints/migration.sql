-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cadastros" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'FISICA',
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk__uf_valid CHECK (uf IN ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')),
    CONSTRAINT chk__status_valid CHECK (status IN ('ATIVO', 'INATIVO', 'PENDENTE')),
    CONSTRAINT chk__tipo_valid CHECK (tipo IN ('FISICA', 'JURIDICA')),
    CONSTRAINT chk__cpf_cnpj_valid CHECK (LENGTH(cpf_cnpj) IN (11, 14) AND cpf_cnpj NOT GLOB '*[^0-9]*')
);
INSERT INTO "new_cadastros" ("atualizado_em", "bairro", "cep", "cidade", "complemento", "cpf_cnpj", "criado_em", "email", "id", "logradouro", "nome", "numero", "observacoes", "status", "telefone", "tipo", "uf") 
SELECT 
    "atualizado_em", 
    "bairro", 
    "cep", 
    "cidade", 
    "complemento", 
    "cpf_cnpj", 
    "criado_em", 
    "email", 
    "id", 
    "logradouro", 
    "nome", 
    "numero", 
    "observacoes", 
    CASE 
        WHEN "status" = 'ativo' THEN 'ATIVO'
        WHEN "status" = 'inativo' THEN 'INATIVO'
        WHEN "status" = 'pendente' THEN 'PENDENTE'
        ELSE UPPER("status")
    END, 
    "telefone", 
    CASE 
        WHEN "tipo" = 'pessoa_fisica' THEN 'FISICA'
        WHEN "tipo" = 'pessoa_juridica' THEN 'JURIDICA'
        ELSE UPPER("tipo")
    END, 
    "uf" 
FROM "cadastros";
DROP TABLE "cadastros";
ALTER TABLE "new_cadastros" RENAME TO "cadastros";
CREATE UNIQUE INDEX "cadastros_cpf_cnpj_key" ON "cadastros"("cpf_cnpj");
CREATE INDEX "cadastros_status_idx" ON "cadastros"("status");
CREATE INDEX "cadastros_email_idx" ON "cadastros"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTrigger
CREATE TRIGGER update_cadastros_atualizado_em
AFTER UPDATE ON cadastros
FOR EACH ROW
WHEN (OLD.atualizado_em IS NEW.atualizado_em)
BEGIN
    UPDATE cadastros SET atualizado_em = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

