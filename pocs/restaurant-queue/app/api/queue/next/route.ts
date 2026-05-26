import { NextResponse } from 'next/server'
import { container } from '@/infrastructure/container'

export async function POST() {
  const order = container.service.startNext()

  if (!order) {
    return NextResponse.json({ error: 'No pending orders in queue' }, { status: 404 })
  }

  return NextResponse.json(order.toJSON())
}
