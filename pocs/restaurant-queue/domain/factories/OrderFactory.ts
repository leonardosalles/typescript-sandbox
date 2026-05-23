import { Order } from '../entities/Order'
import { Dish } from '../entities/Dish'
import { OrderPriority } from '../enums/OrderPriority'
import { randomUUID } from 'crypto'

export class OrderFactory {
  static create(
    dish: Dish,
    customerName: string,
    priority: OrderPriority = OrderPriority.NORMAL,
  ): Order {
    return new Order(randomUUID(), dish, customerName, priority, new Date())
  }
}
