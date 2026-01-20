# What I learned?

- Await Tick
- Promise Race
- Error Handling
- Parallel Execution
- Sequential Execution

## Tech Details

- ESBuild as bundler
- Node.js as runtime

## Execution

```bash
pnpm start

> esbuild src/index.js --bundle --platform=node --outfile=dist/bundle.js && node dist/bundle.js --expose-gc


  dist/bundle.js  1.9kb

⚡ Done in 1ms
Initializing: ASYNC AND PROMISES

--- CASE 1: ASYNC TICK PROOF ---
1: Before calling asyncTask
[Async]: 2: Initiating task
3: After calling asyncTask - sync
[Async]: 4: Finishing task - microtask

--- CASE 2: BENCHMARK (SERIAL VS PARALLEL) ---
Sequencial: 200.695ms
Paralel: 100.845ms

--- CASE 3: THE FLOATING PROMISE TRAP ---
[Attempt]: Calling task without await...
[Success?]: Log executed even with error in task!
/Users/leonardosalles/Workspace/Personal/typescript-sandbox/pocs/promises-async-await/dist/bundle.js:28
    throw new Error("Critical failure!");
          ^

Error: Critical failure!
    at riskyTask (/Users/leonardosalles/Workspace/Personal/typescript-sandbox/pocs/promises-async-await/dist/bundle.js:28:11)
    at runErrorTrap (/Users/leonardosalles/Workspace/Personal/typescript-sandbox/pocs/promises-async-await/dist/bundle.js:32:5)
    at main (/Users/leonardosalles/Workspace/Personal/typescript-sandbox/pocs/promises-async-await/dist/bundle.js:58:9)

Node.js v22.17.1
 ELIFECYCLE  Command failed with exit code 1.
```

## Final Thoughts

With this POC I learned a better way to handle async/await and promises in JavaScript, all of that using pure and simple javascript.
