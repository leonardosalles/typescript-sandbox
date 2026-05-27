'use client'

import { useEffect, useState, useCallback } from 'react'
import { OrderCard } from '@/components/OrderCard'
import { StrategySelector } from '@/components/StrategySelector'
import { AddOrderModal } from '@/components/AddOrderModal'
import { DishCategory } from '@/domain/enums/DishCategory'
import { OrderPriority } from '@/domain/enums/OrderPriority'
import { OrderStatus } from '@/domain/enums/OrderStatus'

interface DishJSON {
  id: string
  name: string
  prepTimeMinutes: number
  category: DishCategory
  emoji: string
  description: string
}

interface OrderJSON {
  id: string
  dish: DishJSON
  customerName: string
  priority: OrderPriority
  status: OrderStatus
  createdAt: string
  estimatedReadyAt?: string
}

interface Strategy {
  key: string
  name: string
  description: string
}

interface QueueSnapshot {
  strategyName: string
  strategyDescription: string
  activeOrders: OrderJSON[]
  completedOrders: OrderJSON[]
  totalWaitMinutes: number
}

export default function HomePage() {
  const [dishes, setDishes] = useState<DishJSON[]>([])
  const [snapshot, setSnapshot] = useState<QueueSnapshot | null>(null)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchQueue = useCallback(async () => {
    const res = await fetch('/api/queue')
    const data = await res.json()
    setSnapshot(data)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('/api/dishes').then(r => r.json()),
      fetch('/api/queue').then(r => r.json()),
      fetch('/api/queue/strategy').then(r => r.json()),
    ]).then(([d, q, s]) => {
      setDishes(d)
      setSnapshot(q)
      setStrategies(s)
    })
  }, [])

  const handleAddOrder = async (dishId: string, customerName: string, priority: OrderPriority) => {
    await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishId, customerName, priority }),
    })
    await fetchQueue()
  }

  const handleStartNext = async () => {
    setActionLoading(true)
    try {
      await fetch('/api/queue/next', { method: 'POST' })
      await fetchQueue()
    } finally {
      setActionLoading(false)
    }
  }

  const handleComplete = async () => {
    setActionLoading(true)
    try {
      await fetch('/api/queue/complete', { method: 'POST' })
      await fetchQueue()
    } finally {
      setActionLoading(false)
    }
  }

  const handleStrategyChange = async (key: string) => {
    await fetch('/api/queue/strategy', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    })
    await fetchQueue()
  }

  const hasInProgress = snapshot?.activeOrders.some(o => o.status === OrderStatus.IN_PROGRESS)
  const hasPending = snapshot?.activeOrders.some(o => o.status === OrderStatus.PENDING)
  const currentStrategyKey = strategies.find(s => s.name === snapshot?.strategyName)?.key ?? ''

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Restaurant Queue</h1>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <span>+</span> New Order
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="In Queue"   value={snapshot?.activeOrders.length ?? 0}      icon="📋" color="text-indigo-400" />
            <StatCard label="Total Wait" value={`${snapshot?.totalWaitMinutes ?? 0}min`} icon="⏱️" color="text-amber-400" />
            <StatCard label="Completed"  value={snapshot?.completedOrders.length ?? 0}   icon="✅" color="text-green-400" />
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-zinc-100">Active Queue</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleStartNext}
                  disabled={!hasPending || !!hasInProgress || actionLoading}
                  className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  🍳 Start Next
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!hasInProgress || actionLoading}
                  className="px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ✅ Mark Done
                </button>
              </div>
            </div>

            {snapshot?.activeOrders.length === 0 ? (
              <div className="text-center py-12 text-zinc-600">
                <div className="text-4xl mb-2">🍽️</div>
                <p className="text-sm">Queue is empty. Add an order to get started.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {snapshot?.activeOrders.map((order, i) => (
                  <OrderCard key={order.id} order={order} position={i + 1} />
                ))}
              </div>
            )}
          </div>

          {(snapshot?.completedOrders.length ?? 0) > 0 && (
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
              <h2 className="font-bold text-zinc-100 mb-3">Completed Orders</h2>
              <div className="flex flex-col gap-2">
                {snapshot?.completedOrders.map((order, i) => (
                  <OrderCard key={order.id} order={order} position={i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
            <h2 className="font-bold text-zinc-100 mb-1">Queue Strategy</h2>
            <p className="text-xs text-zinc-500 mb-3">
              {snapshot?.strategyDescription ?? 'Loading…'}
            </p>
            <StrategySelector
              strategies={strategies}
              current={currentStrategyKey}
              onSelect={handleStrategyChange}
            />
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
            <h2 className="font-bold text-zinc-100 mb-3">Menu</h2>
            <div className="flex flex-col gap-1.5">
              {dishes.map(d => (
                <div key={d.id} className="flex items-center justify-between text-sm py-1">
                  <span className="flex items-center gap-2">
                    <span>{d.emoji}</span>
                    <span className="text-zinc-300">{d.name}</span>
                  </span>
                  <span className="text-zinc-500 text-xs font-medium">{d.prepTimeMinutes}min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddOrderModal
          dishes={dishes}
          onAdd={handleAddOrder}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-zinc-500">{label}</div>
      </div>
    </div>
  )
}
