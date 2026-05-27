# Restaurant Queue

```
pnpm dev
```
### Patterns
S — cada classe tem uma única razão para mudar

O — new strategies: just add into StrategyRegistry, no existing code touched

L — any IPriorityStrategy is changeable in Queue

I — IQueueObserver separated from IPriorityStrategy separated from IQueueRepository

D — QueueService depends on IQueueRepository, not from InMemoryQueueRepository

| Pattern | Where | Why |
|---|---|---|
| Strategy | `IPriorityStrategy` → FIFO / SJF / VIP | Swap the queue algorithm at runtime without changing `Queue` |
| Observer | `IQueueObserver` → Log + WaitTime | React to events (add/start/complete) without coupling `Queue` to side-effects |
| Factory | `DishFactory` / `OrderFactory` | Centralize domain object creation |
| Repository | `IQueueRepository` | Decouple persistence from the domain (swappable) |
| Facade | `QueueService` | Expose a simple API for Next.js routes |
| Singleton | `container.ts` | Global server state for the POC |

### Screenshots
