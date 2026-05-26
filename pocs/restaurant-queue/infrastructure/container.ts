import { InMemoryQueueRepository } from '../domain/repositories/InMemoryQueueRepository'
import { QueueService } from '../domain/services/QueueService'
import { FIFOStrategy } from '../domain/strategies/FIFOStrategy'
import { ConsoleLogObserver } from '../domain/observers/ConsoleLogObserver'
import { WaitTimeObserver } from '../domain/observers/WaitTimeObserver'
import { DishFactory } from '../domain/factories/DishFactory'

const createContainer = () => {
  const repository = new InMemoryQueueRepository(new FIFOStrategy())
  const queue = repository.getQueue()

  queue.addObserver(new ConsoleLogObserver('Restaurant'))
  queue.addObserver(new WaitTimeObserver())

  const service = new QueueService(repository)
  const menu = DishFactory.createMenu()

  return { service, menu }
}

declare global {
  // eslint-disable-next-line no-var
  var __restaurantContainer: ReturnType<typeof createContainer> | undefined
}

export const container = globalThis.__restaurantContainer ?? createContainer()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__restaurantContainer = container
}
