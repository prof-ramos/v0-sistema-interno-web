import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cadastroSchema } from '@/lib/validations'
import { z } from 'zod'

/**
 * GET /api/cadastros
 * Lista cadastros com paginação e busca.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '10')))

    const where = search
      ? {
          OR: [
            { nome: { contains: search } },
            { email: { contains: search } },
            { cpfCnpj: { contains: search } },
          ],
        }
      : {}

    const [total, cadastros] = await Promise.all([
      prisma.cadastro.count({ where }),
      prisma.cadastro.findMany({
        where,
        orderBy: { criadoEm: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ])

    return NextResponse.json({
      data: cadastros,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    })
  } catch (error) {
    console.error('[GET /api/cadastros] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar cadastros' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cadastros
 * Cria um novo cadastro com validação Zod e tratamento de conflitos.
 */
export async function POST(request: Request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
    }

    const validation = cadastroSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const { data } = validation

    const cadastro = await prisma.cadastro.create({
      data: {
        nome: data.nome,
        cpfCnpj: data.cpfCnpj.replace(/\D/g, ''),
        tipo: data.tipo,
        email: data.email,
        telefone: data.telefone.replace(/\D/g, ''),
        cep: data.cep.replace(/\D/g, ''),
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        observacoes: data.observacoes,
        status: data.status,
      },
    })

    return NextResponse.json(cadastro, { status: 201 })
  } catch (error: unknown) {
    // Handle Prisma specific errors
    const prismaError = error as { code?: string; meta?: { target?: string[] } }
    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target || []
      return NextResponse.json(
        { error: `Conflito: ${target.includes('cpfCnpj') ? 'CPF/CNPJ' : 'E-mail'} já cadastrado` },
        { status: 409 }
      )
    }

    console.error('[POST /api/cadastros] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Erro interno ao criar cadastro' },
      { status: 500 }
    )
  }
}
