import { Order } from '../entities/Order'

export interface IPriorityStrategy {
  readonly name: string
  readonly description: string
  sort(orders: Order[]): Order[]
}
