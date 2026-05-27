'use client'

interface Strategy {
  key: string
  name: string
  description: string
}

interface StrategySelectorProps {
  strategies: Strategy[]
  current: string
  onSelect: (key: string) => void
  disabled?: boolean
}

const STRATEGY_ICONS: Record<string, string> = {
  FIFO: '🕐',
  SJF: '⚡',
  VIP: '👑',
}

export function StrategySelector({ strategies, current, onSelect, disabled }: StrategySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {strategies.map(s => (
        <button
          key={s.key}
          onClick={() => onSelect(s.key)}
          disabled={disabled}
          className={`
            w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm
            ${current === s.key
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-zinc-700 bg-zinc-800 hover:border-indigo-500/50'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <div className="flex items-center gap-2">
            <span>{STRATEGY_ICONS[s.key] ?? '📋'}</span>
            <div>
              <div className="font-semibold text-zinc-100">{s.name}</div>
              <div className="text-xs text-zinc-500">{s.description}</div>
            </div>
            {current === s.key && (
              <span className="ml-auto text-indigo-400 font-bold">✓</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
