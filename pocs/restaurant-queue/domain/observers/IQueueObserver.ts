import { Order } from '../entities/Order'

export interface IQueueObserver {
  onOrderAdded(order: Order, queue: Order[]): void
  onOrderStarted(order: Order, queue: Order[]): void
  onOrderCompleted(order: Order, queue: Order[]): void
  onStrategyChanged(strategyName: string): void
}
