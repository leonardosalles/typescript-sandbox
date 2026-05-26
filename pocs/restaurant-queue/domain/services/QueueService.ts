import { Dish } from '../entities/Dish'
import { Order } from '../entities/Order'
import { OrderFactory } from '../factories/OrderFactory'
import { IQueueRepository } from '../repositories/IQueueRepository'
import { IPriorityStrategy } from '../strategies/IPriorityStrategy'
import { STRATEGY_REGISTRY, StrategyKey } from '../strategies/StrategyRegistry'
import { OrderPriority } from '../enums/OrderPriority'

export interface QueueSnapshot {
  strategyName: string
  strategyDescription: string
  activeOrders: ReturnType<Order['toJSON']>[]
  completedOrders: ReturnType<Order['toJSON']>[]
  totalWaitMinutes: number
}

export class QueueService {
  constructor(private readonly repository: IQueueRepository) {}

  addOrder(dish: Dish, customerName: string, priority: OrderPriority): Order {
    const queue = this.repository.getQueue()
    const order = OrderFactory.create(dish, customerName, priority)
    queue.addOrder(order)
    return order
  }

  startNext(): Order | null {
    return this.repository.getQueue().startNext()
  }

  completeInProgress(): Order | null {
    return this.repository.getQueue().completeInProgress()
  }

  changeStrategy(key: StrategyKey): IPriorityStrategy {
    const strategy = STRATEGY_REGISTRY[key]
    if (!strategy) throw new Error(`Unknown strategy: ${key}`)
    this.repository.getQueue().setStrategy(strategy)
    return strategy
  }

  getSnapshot(): QueueSnapshot {
    const queue = this.repository.getQueue()
    const strategy = STRATEGY_REGISTRY[queue.strategyName as StrategyKey]
      ?? { name: queue.strategyName, description: '' }

    const activeOrders = queue.getOrdered()
    const totalWaitMinutes = activeOrders.reduce((acc, o) => acc + o.dish.prepTimeMinutes, 0)

    return {
      strategyName: strategy.name,
      strategyDescription: (strategy as IPriorityStrategy).description ?? '',
      activeOrders: activeOrders.map(o => o.toJSON()),
      completedOrders: queue.getDone().map(o => o.toJSON()),
      totalWaitMinutes,
    }
  }
}
