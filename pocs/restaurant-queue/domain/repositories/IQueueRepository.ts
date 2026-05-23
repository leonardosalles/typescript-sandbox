import { Order } from '../entities/Order'
import { Queue } from '../entities/Queue'

export interface IQueueRepository {
  getQueue(): Queue
  findOrder(id: string): Order | undefined
}
