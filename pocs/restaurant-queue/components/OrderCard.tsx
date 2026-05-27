'use client'

import { OrderStatus } from '@/domain/enums/OrderStatus'
import { OrderPriority } from '@/domain/enums/OrderPriority'

interface OrderJSON {
  id: string
  dish: { name: string; emoji: string; prepTimeMinutes: number }
  customerName: string
  priority: OrderPriority
  status: OrderStatus
  createdAt: string
  estimatedReadyAt?: string
}

interface OrderCardProps {
  order: OrderJSON
  position: number
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]:     'bg-zinc-800 border-zinc-600 text-zinc-300',
  [OrderStatus.IN_PROGRESS]: 'bg-amber-950 border-amber-500 text-amber-300',
  [OrderStatus.DONE]:        'bg-green-950 border-green-600 text-green-400',
}

const STATUS_ICON: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]:     '⏳',
  [OrderStatus.IN_PROGRESS]: '🍳',
  [OrderStatus.DONE]:        '✅',
}

function formatEta(dateStr?: string): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function OrderCard({ order, position }: OrderCardProps) {
  const isVip = order.priority === OrderPriority.VIP

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${STATUS_STYLES[order.status]}`}>
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-900 border-2 border-current flex items-center justify-center text-xs font-bold">
        {position}
      </div>

      <span className="text-xl">{order.dish.emoji}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm truncate text-zinc-100">{order.customerName}</span>
          {isVip && (
            <span className="text-[10px] font-bold bg-yellow-400 text-yellow-900 px-1 py-0.5 rounded">VIP</span>
          )}
        </div>
        <div className="text-xs text-zinc-500 truncate">{order.dish.name} · {order.dish.prepTimeMinutes}min</div>
      </div>

      <div className="flex flex-col items-end shrink-0 gap-1">
        <span className="text-lg">{STATUS_ICON[order.status]}</span>
        {order.estimatedReadyAt && order.status !== OrderStatus.DONE && (
          <span className="text-[10px] text-zinc-500">~{formatEta(order.estimatedReadyAt)}</span>
        )}
      </div>
    </div>
  )
}
