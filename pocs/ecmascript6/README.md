# What I learned?

- Microtask Priority (Event Loop)
- Metaprogramming with Proxy & Reflect
- Memory Management: Map vs. WeakMap
- Stateful Iteration with Generators

## Tech Details

- ESBuild as bundler
- Node.js as runtime

## Key Modules:

<b>meta-programming.js</b>: Proxy traps for runtime type validation.

<b>async-deep.js</b>: Comparison between Microtasks and Macrotasks.

<b>stress-test.js</b>: Heap memory analysis comparing Map and WeakMap.

<b>iterators.js</b>: Stateful iteration with Generators.

## Execution

```bash
pnpm start

> esbuild src/index.js --bundle --platform=node --outfile=dist/bundle.js && node dist/bundle.js --expose-gc


dist/bundle.js  3.5kb

⚡ Done in 1ms
Year defined successfully!
Leo
--- PROXY ---
Setting "name" as Leonardo
Setting "age" as 30

--- GENERATORS ---
2
3
5

--- EVENT LOOP ---
Start sync
End sync

--- WEAKMAP AND MEMORY ---
Map keeps the object:  1
WeakMap keeps the object:  undefined
undefined

--- REFLECT API ---

Starting Map stress test
Heap memory usage: 78.64 MB
End of Map stress test

Starting WeakMap stress test
Heap memory usage: 118.30 MB
End of WeakMap stress test
Promise 1 - microtask
Promise 2 - microtask
Timeout macrotask
```

## Final Thoughts

Doing this POC reinforced that knowing javascript is different from understading engine and things behind the hood. Moving from simple functions, vars, constants, classes, etc. usage to deep understanding of the Event Loop and Memory Allocation allows you to write better code that avoids common errors or issues like memory leaks and UI freezing.
