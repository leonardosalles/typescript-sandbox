import { NextResponse } from 'next/server'
import { container } from '@/infrastructure/container'

export async function POST() {
  const order = container.service.completeInProgress()

  if (!order) {
    return NextResponse.json({ error: 'No order currently in progress' }, { status: 404 })
  }

  return NextResponse.json(order.toJSON())
}
