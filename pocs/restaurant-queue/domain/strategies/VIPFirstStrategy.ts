import { IPriorityStrategy } from './IPriorityStrategy'
import { Order } from '../entities/Order'
import { OrderPriority } from '../enums/OrderPriority'

export class VIPFirstStrategy implements IPriorityStrategy {
  readonly name = 'VIP First'
  readonly description = 'VIP customers served first, then FIFO within each priority group'

  sort(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => {
      const aIsVip = a.priority === OrderPriority.VIP
      const bIsVip = b.priority === OrderPriority.VIP

      if (aIsVip && !bIsVip) return -1
      if (!aIsVip && bIsVip) return 1

      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }
}
