import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name:     z.string().min(2).max(50),
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
  email:    z.string().email(),
  password: z.string().min(6).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { name, username, email, password } = parsed.data

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })
    if (existing) {
      return NextResponse.json(
        { error: existing.email === email ? 'Email already in use' : 'Username already taken' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name, username, email, passwordHash,
        mascot: { create: { mascotType: 'fox', name: 'Lumie', mood: 'happy' } },
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('[register]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
