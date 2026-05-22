import { IPriorityStrategy } from './IPriorityStrategy'
import { FIFOStrategy } from './FIFOStrategy'
import { ShortestJobFirstStrategy } from './ShortestJobFirstStrategy'
import { VIPFirstStrategy } from './VIPFirstStrategy'

export const STRATEGY_REGISTRY: Record<string, IPriorityStrategy> = {
  FIFO: new FIFOStrategy(),
  SJF: new ShortestJobFirstStrategy(),
  VIP: new VIPFirstStrategy(),
}

export type StrategyKey = keyof typeof STRATEGY_REGISTRY
