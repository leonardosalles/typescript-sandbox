import { IQueueObserver } from './IQueueObserver'
import { Order } from '../entities/Order'

export class ConsoleLogObserver implements IQueueObserver {
  private label: string

  constructor(label = 'QueueLog') {
    this.label = label
  }

  onOrderAdded(order: Order, queue: Order[]): void {
    console.log(`[${this.label}] ➕ Order added: ${order.customerName} → ${order.dish.name} (${order.dish.prepTimeMinutes}min) | Queue size: ${queue.length}`)
  }

  onOrderStarted(order: Order, queue: Order[]): void {
    console.log(`[${this.label}] 🍳 Started: ${order.customerName} → ${order.dish.name} | Remaining: ${queue.length}`)
  }

  onOrderCompleted(order: Order, queue: Order[]): void {
    console.log(`[${this.label}] ✅ Completed: ${order.customerName} → ${order.dish.name} | Queue size: ${queue.length}`)
  }

  onStrategyChanged(strategyName: string): void {
    console.log(`[${this.label}] 🔀 Strategy changed to: ${strategyName}`)
  }
}
