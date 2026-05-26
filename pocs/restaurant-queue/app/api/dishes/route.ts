import { NextResponse } from 'next/server'
import { container } from '@/infrastructure/container'

export async function GET() {
  return NextResponse.json(container.menu.map(d => d.toJSON()))
}
