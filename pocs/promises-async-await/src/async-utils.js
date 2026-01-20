const sleep = (ms) => new Promise(res => setTimeout(res, ms));

export const runTickProof = async () => {
  console.log("\n--- CASE 1: ASYNC TICK PROOF ---");
  
  const asyncTask = async () => {
    console.log("[Async]: 2: Initiating task");
    await Promise.resolve();
    console.log("[Async]: 4: Finishing task - microtask");
  };

  console.log("1: Before calling asyncTask");
  asyncTask();
  console.log("3: After calling asyncTask - sync");
};

export const runBenchmark = async () => {
  console.log("\n--- CASE 2: BENCHMARK (SERIAL VS PARALLEL) ---");
  
  const task = () => sleep(100);

  console.time("Sequencial");
  await task();
  await task();
  console.timeEnd("Sequencial");

  console.time("Paralel");
  await Promise.all([task(), task()]);
  console.timeEnd("Paralel");
};

export const runErrorTrap = async () => {
  console.log("\n--- CASE 3: THE FLOATING PROMISE TRAP ---");
  
  const riskyTask = async () => {
    throw new Error("Critical failure!");
  };

  try {
    console.log("[Attempt]: Calling task without await...");
    riskyTask();
    console.log("[Success?]: Log executed even with error in task!");
  } catch (e) {
    console.log("[Catch]: This will NEVER be printed.");
  }
};

export const runRaceCondition = async () => {
  console.log("\n--- CASE 4: PROMISE.RACE ---");
  
  const slowAction = sleep(200).then(() => "Success!");
  const timeout = sleep(100).then(() => { throw new Error("Timeout reached!"); });

  try {
    const result = await Promise.race([slowAction, timeout]);
    console.log("Result:", result);
  } catch (e) {
    console.log("Caught:", e.message);
  }
};
