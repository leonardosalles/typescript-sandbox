import { Dish } from './Dish'
import { OrderPriority } from '../enums/OrderPriority'
import { OrderStatus } from '../enums/OrderStatus'

export class Order {
  private _status: OrderStatus
  private _startedAt?: Date
  private _completedAt?: Date
  private _estimatedReadyAt?: Date

  constructor(
    public readonly id: string,
    public readonly dish: Dish,
    public readonly customerName: string,
    public readonly priority: OrderPriority,
    public readonly createdAt: Date,
  ) {
    this._status = OrderStatus.PENDING
  }

  get status(): OrderStatus { return this._status }
  get startedAt(): Date | undefined { return this._startedAt }
  get completedAt(): Date | undefined { return this._completedAt }
  get estimatedReadyAt(): Date | undefined { return this._estimatedReadyAt }

  startPreparing(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error(`Cannot start order in status ${this._status}`)
    }
    this._status = OrderStatus.IN_PROGRESS
    this._startedAt = new Date()
  }

  complete(): void {
    if (this._status !== OrderStatus.IN_PROGRESS) {
      throw new Error(`Cannot complete order in status ${this._status}`)
    }
    this._status = OrderStatus.DONE
    this._completedAt = new Date()
  }

  setEstimatedReadyAt(date: Date): void {
    this._estimatedReadyAt = date
  }

  isPending(): boolean { return this._status === OrderStatus.PENDING }
  isInProgress(): boolean { return this._status === OrderStatus.IN_PROGRESS }
  isDone(): boolean { return this._status === OrderStatus.DONE }

  toJSON() {
    return {
      id: this.id,
      dish: this.dish.toJSON(),
      customerName: this.customerName,
      priority: this.priority,
      status: this._status,
      createdAt: this.createdAt,
      startedAt: this._startedAt,
      completedAt: this._completedAt,
      estimatedReadyAt: this._estimatedReadyAt,
    }
  }
}
