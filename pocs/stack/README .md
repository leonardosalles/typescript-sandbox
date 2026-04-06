# Stack — Java & TypeScript

Generic Stack (Last-In, First-Out - LIFO) implemented with a singly linked list. Both languages, full test coverage.

## What it does

```
push(42)  -  top -> [42 | •] -> ["hello" | •] -> [true | null]
pop()     -  returns 42,  top moves to "hello"
peek()    -  returns "hello", nothing changes
```

Every node points to the next. No array, no resize — `push` and `pop` are always **O(1) real**, not amortized.

`contains` and `iterator` needs to run over the entire list, so they are **O(n)**.

---

## Complexity

| Operation  | Time | Space    |
| ---------- | ---- | -------- |
| `push`     | O(1) | O(1)     |
| `pop`      | O(1) | O(1)     |
| `peek`     | O(1) | O(1)     |
| `contains` | O(n) | O(1)     |
| `iterator` | O(n) | O(1)     |
| **Total**  |      | **O(n)** |

---

## Trade-offs: Java vs TypeScript

| Aspect      | Java 25                        | TypeScript                      |
| ----------- | ------------------------------ | ------------------------------- |
| Types       | Enforced at compile-time       | Enforced at compile-time        |
| Generics    | Type erasure (no runtime info) | Erased in compiled JS           |
| Null safety | Manual checks, verbose         | `null` and `undefined` distinct |
| Iteration   | `Iterable<T>` + inner class    | Native `Symbol.iterator`        |
| Errors      | Rich `Exception` hierarchy     | Extends `Error` directly        |
| Tests       | JUnit 5 + `@ParameterizedTest` | Vitest — ESM, fast, zero config |
| Runs on     | JVM                            | Node, browser, Deno, Bun        |

## Keynote

Array push is O(1) amortized due to occasional resizing, while a linked-list stack guarantees true O(1) operations with no hidden costs.
