import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cadastroSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/cadastros/[id]
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const cadastro = await prisma.cadastro.findUnique({
      where: { id },
    })

    if (!cadastro) {
      return NextResponse.json({ error: 'Cadastro não encontrado' }, { status: 404 })
    }

    return NextResponse.json(cadastro)
  } catch (error) {
    console.error('[GET /api/cadastros/[id]] Unexpected error:', error)
    return NextResponse.json({ error: 'Erro ao buscar cadastro' }, { status: 500 })
  }
}

/**
 * PUT /api/cadastros/[id]
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
    }

    const validation = cadastroSchema.partial().safeParse(body)
    if (!validation.success || Object.keys(validation.data).length === 0) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data } = validation

    const cadastro = await prisma.cadastro.update({
      where: { id },
      data: {
        ...data,
        ...(data.cpfCnpj && { cpfCnpj: data.cpfCnpj.replace(/\D/g, '') }),
        ...(data.telefone && { telefone: data.telefone.replace(/\D/g, '') }),
        ...(data.cep && { cep: data.cep.replace(/\D/g, '') }),
      },
    })

    return NextResponse.json(cadastro)
  } catch (error: unknown) {
    const prismaError = error as { code?: string; meta?: { target?: string[] } }
    // P2025: Record to update not found
    if (prismaError.code === 'P2025') {
      return NextResponse.json({ error: 'Cadastro não encontrado' }, { status: 404 })
    }

    // P2002: Unique constraint violation
    if (prismaError.code === 'P2002') {
      return NextResponse.json({ error: 'CPF/CNPJ ou E-mail já cadastrado' }, { status: 409 })
    }

    console.error('[PUT /api/cadastros/[id]] Unexpected error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar cadastro' }, { status: 500 })
  }
}

/**
 * DELETE /api/cadastros/[id]
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    await prisma.cadastro.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const prismaError = error as { code?: string }
    // P2025: Record to delete not found
    if (prismaError.code === 'P2025') {
      return NextResponse.json({ error: 'Cadastro não encontrado' }, { status: 404 })
    }

    console.error('[DELETE /api/cadastros/[id]] Unexpected error:', error)
    return NextResponse.json({ error: 'Erro ao excluir cadastro' }, { status: 500 })
  }
}
