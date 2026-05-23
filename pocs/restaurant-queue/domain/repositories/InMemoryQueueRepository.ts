import { IQueueRepository } from './IQueueRepository'
import { Order } from '../entities/Order'
import { Queue } from '../entities/Queue'
import { IPriorityStrategy } from '../strategies/IPriorityStrategy'

export class InMemoryQueueRepository implements IQueueRepository {
  private readonly _queue: Queue

  constructor(initialStrategy: IPriorityStrategy) {
    this._queue = new Queue(initialStrategy)
  }

  getQueue(): Queue {
    return this._queue
  }

  findOrder(id: string): Order | undefined {
    return this._queue.getAll().find(o => o.id === id)
  }
}
