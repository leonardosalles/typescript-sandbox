import { NextRequest, NextResponse } from 'next/server'
import { container } from '@/infrastructure/container'
import { STRATEGY_REGISTRY, StrategyKey } from '@/domain/strategies/StrategyRegistry'

export async function GET() {
  const strategies = Object.entries(STRATEGY_REGISTRY).map(([key, s]) => ({
    key,
    name: s.name,
    description: s.description,
  }))
  return NextResponse.json(strategies)
}

export async function PUT(req: NextRequest) {
  const { key } = await req.json()

  if (!key || !(key in STRATEGY_REGISTRY)) {
    return NextResponse.json({ error: 'Invalid strategy key' }, { status: 400 })
  }

  const strategy = container.service.changeStrategy(key as StrategyKey)
  return NextResponse.json({ name: strategy.name, description: strategy.description })
}
