'use client'

import { DishCategory } from '@/domain/enums/DishCategory'

interface DishJSON {
  id: string
  name: string
  prepTimeMinutes: number
  category: DishCategory
  emoji: string
  description: string
}

interface DishCardProps {
  dish: DishJSON
  onSelect: (dish: DishJSON) => void
  selected: boolean
}

const CATEGORY_COLORS: Record<DishCategory, string> = {
  [DishCategory.STARTER]: 'bg-amber-900/40 text-amber-400 border-amber-700',
  [DishCategory.MAIN]:    'bg-red-900/40 text-red-400 border-red-700',
  [DishCategory.DESSERT]: 'bg-pink-900/40 text-pink-400 border-pink-700',
  [DishCategory.DRINK]:   'bg-blue-900/40 text-blue-400 border-blue-700',
}

const PREP_TIME_COLOR = (minutes: number) => {
  if (minutes <= 5) return 'text-green-400'
  if (minutes <= 15) return 'text-yellow-400'
  return 'text-red-400'
}

export function DishCard({ dish, onSelect, selected }: DishCardProps) {
  return (
    <button
      onClick={() => onSelect(dish)}
      className={`
        w-full text-left p-3 rounded-xl border-2 transition-all duration-150 cursor-pointer
        ${selected
          ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-900/30'
          : 'border-zinc-700 bg-zinc-800 hover:border-indigo-500/50'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{dish.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-zinc-100 text-sm truncate">{dish.name}</span>
            <span className={`text-xs font-bold shrink-0 ${PREP_TIME_COLOR(dish.prepTimeMinutes)}`}>
              {dish.prepTimeMinutes}min
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{dish.description}</p>
          <span className={`mt-1.5 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[dish.category]}`}>
            {dish.category}
          </span>
        </div>
      </div>
    </button>
  )
}
