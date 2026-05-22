import { IPriorityStrategy } from './IPriorityStrategy'
import { Order } from '../entities/Order'

export class ShortestJobFirstStrategy implements IPriorityStrategy {
  readonly name = 'SJF'
  readonly description = 'Shortest Job First — quickest dishes processed first to maximize throughput'

  sort(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => {
      const timeDiff = a.dish.prepTimeMinutes - b.dish.prepTimeMinutes
      return timeDiff !== 0 ? timeDiff : a.createdAt.getTime() - b.createdAt.getTime()
    })
  }
}
