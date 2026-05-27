# Restaurant Queue

```
pnpm dev
```
### Patterns
S — each class has a reason to change

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
<img width="1912" height="993" alt="main" src="https://github.com/user-attachments/assets/a205187d-b6be-477b-93cc-8c453ab030b8" />
<img width="1915" height="991" alt="add" src="https://github.com/user-attachments/assets/14a588aa-12e2-4b46-945f-9d67b54dad4d" />
