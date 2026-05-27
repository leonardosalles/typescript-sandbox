'use client'

import { useState } from 'react'
import { DishCard } from './DishCard'
import { DishCategory } from '@/domain/enums/DishCategory'
import { OrderPriority } from '@/domain/enums/OrderPriority'

interface DishJSON {
  id: string
  name: string
  prepTimeMinutes: number
  category: DishCategory
  emoji: string
  description: string
}

interface AddOrderModalProps {
  dishes: DishJSON[]
  onAdd: (dishId: string, customerName: string, priority: OrderPriority) => Promise<void>
  onClose: () => void
}

const CATEGORIES = [DishCategory.STARTER, DishCategory.MAIN, DishCategory.DESSERT, DishCategory.DRINK]

export function AddOrderModal({ dishes, onAdd, onClose }: AddOrderModalProps) {
  const [selectedDish, setSelectedDish] = useState<DishJSON | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [priority, setPriority] = useState<OrderPriority>(OrderPriority.NORMAL)
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<DishCategory | 'ALL'>('ALL')

  const filteredDishes = activeCategory === 'ALL'
    ? dishes
    : dishes.filter(d => d.category === activeCategory)

  const handleSubmit = async () => {
    if (!selectedDish || !customerName.trim()) return
    setLoading(true)
    try {
      await onAdd(selectedDish.id, customerName, priority)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-100">New Order</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 text-2xl font-bold leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="w-full bg-zinc-800 border-2 border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {[OrderPriority.NORMAL, OrderPriority.VIP].map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all
                    ${priority === p
                      ? p === OrderPriority.VIP
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                        : 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500'
                    }`}
                >
                  {p === OrderPriority.VIP ? '👑 VIP' : '👤 Normal'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Choose a Dish</label>

            <div className="flex gap-1.5 mb-3 flex-wrap">
              {(['ALL', ...CATEGORIES] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                    ${activeCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {filteredDishes.map(dish => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onSelect={setSelectedDish}
                  selected={selectedDish?.id === dish.id}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-zinc-800 flex items-center justify-between gap-3">
          {selectedDish ? (
            <div className="text-sm text-zinc-300">
              <span className="font-medium">{selectedDish.emoji} {selectedDish.name}</span>
              <span className="text-zinc-500 ml-2">· {selectedDish.prepTimeMinutes} min</span>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Select a dish to continue</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedDish || !customerName.trim() || loading}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Adding…' : 'Add to Queue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
