import { IQueueObserver } from './IQueueObserver'
import { Order } from '../entities/Order'

export class WaitTimeObserver implements IQueueObserver {
  onOrderAdded(_order: Order, queue: Order[]): void {
    this.recalculate(queue)
  }

  onOrderStarted(_order: Order, queue: Order[]): void {
    this.recalculate(queue)
  }

  onOrderCompleted(_order: Order, queue: Order[]): void {
    this.recalculate(queue)
  }

  onStrategyChanged(_strategyName: string): void {}

  private recalculate(queue: Order[]): void {
    const now = new Date()
    let accumulatedMinutes = 0

    for (const order of queue) {
      if (order.isDone()) continue

      accumulatedMinutes += order.dish.prepTimeMinutes
      const readyAt = new Date(now.getTime() + accumulatedMinutes * 60_000)
      order.setEstimatedReadyAt(readyAt)
    }
  }
}
