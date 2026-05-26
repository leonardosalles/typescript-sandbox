import { NextRequest, NextResponse } from 'next/server'
import { container } from '@/infrastructure/container'
import { OrderPriority } from '@/domain/enums/OrderPriority'

export async function GET() {
  const snapshot = container.service.getSnapshot()
  return NextResponse.json(snapshot)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { dishId, customerName, priority } = body

  const dish = container.menu.find(d => d.id === dishId)
  if (!dish) {
    return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
  }

  if (!customerName?.trim()) {
    return NextResponse.json({ error: 'Customer name is required' }, { status: 400 })
  }

  const validPriority = priority === OrderPriority.VIP ? OrderPriority.VIP : OrderPriority.NORMAL
  const order = container.service.addOrder(dish, customerName.trim(), validPriority)

  return NextResponse.json(order.toJSON(), { status: 201 })
}
