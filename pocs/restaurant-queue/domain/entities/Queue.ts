import { Order } from './Order'
import { IPriorityStrategy } from '../strategies/IPriorityStrategy'
import { IQueueObserver } from '../observers/IQueueObserver'
import { OrderStatus } from '../enums/OrderStatus'

export class Queue {
  private _orders: Order[] = []
  private _observers: IQueueObserver[] = []
  private _strategy: IPriorityStrategy

  constructor(strategy: IPriorityStrategy) {
    this._strategy = strategy
  }

  get strategyName(): string {
    return this._strategy.name
  }

  addObserver(observer: IQueueObserver): void {
    this._observers.push(observer)
  }

  removeObserver(observer: IQueueObserver): void {
    this._observers = this._observers.filter(o => o !== observer)
  }

  setStrategy(strategy: IPriorityStrategy): void {
    this._strategy = strategy
    this._notify(o => o.onStrategyChanged(strategy.name))
  }

  addOrder(order: Order): void {
    this._orders.push(order)
    this._notify(o => o.onOrderAdded(order, this.getActive()))
  }

  startNext(): Order | null {
    const pending = this._strategy
      .sort(this._orders)
      .find(o => o.isPending())

    if (!pending) return null

    pending.startPreparing()
    this._notify(o => o.onOrderStarted(pending, this.getActive()))
    return pending
  }

  completeInProgress(): Order | null {
    const inProgress = this._orders.find(o => o.isInProgress())
    if (!inProgress) return null

    inProgress.complete()
    this._notify(o => o.onOrderCompleted(inProgress, this.getActive()))
    return inProgress
  }

  getOrdered(): Order[] {
    const active = this._orders.filter(o => !o.isDone())
    return this._strategy.sort(active)
  }

  getActive(): Order[] {
    return this._orders.filter(o => !o.isDone())
  }

  getAll(): Order[] {
    return [...this._orders]
  }

  getDone(): Order[] {
    return this._orders.filter(o => o.isDone())
  }

  size(): number {
    return this._orders.filter(o => o.status !== OrderStatus.DONE).length
  }

  private _notify(action: (observer: IQueueObserver) => void): void {
    this._observers.forEach(action)
  }
}
