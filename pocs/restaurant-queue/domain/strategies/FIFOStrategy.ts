import { IPriorityStrategy } from './IPriorityStrategy'
import { Order } from '../entities/Order'

export class FIFOStrategy implements IPriorityStrategy {
  readonly name = 'FIFO'
  readonly description = 'First In, First Out — orders served in arrival order'

  sort(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }
}
