import { PrismaClient } from '../lib/generated/prisma/client.js'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { MOCK_CADASTROS } from '../lib/mock-data.js'

const dbUrl = process.env.DATABASE_URL || 'file:prisma/dev.db'
const adapter = new PrismaBetterSqlite3({
  url: dbUrl,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Map mock data and wrap in transaction
  const mappedCadastros = MOCK_CADASTROS.map(c => ({
    id: c.id,
    nome: c.nome,
    cpfCnpj: c.cpfCnpj.replace(/\D/g, ''),
    tipo: c.tipo,
    email: c.email,
    telefone: c.telefone,
    cep: c.cep.replace(/\D/g, ''),
    logradouro: c.logradouro,
    numero: c.numero,
    complemento: c.complemento || null,
    bairro: c.bairro,
    cidade: c.cidade,
    uf: c.uf,
    observacoes: c.observacoes || null,
    status: c.status,
    criadoEm: new Date(c.criadoEm),
    atualizadoEm: new Date(c.atualizadoEm),
  }))

  await prisma.$transaction([
    prisma.cadastro.deleteMany(),
    prisma.cadastro.createMany({
      data: mappedCadastros,
    }),
  ])

  console.log(`✅ Seeded ${MOCK_CADASTROS.length} cadastros`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
