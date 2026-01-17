const formatMemory = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

export const runStressTest = (type) => {
  console.log(`\nStarting ${type} stress test`);
  
  let collection = type === 'Map' ? new Map() : new WeakMap();
  let objects = [];

  // Creating 1 million objects
  for (let i = 0; i < 1_000_000; i++) {
    let obj = { index: i };
    collection.set(obj, "some data");
    
    // If it's Map, we need to keep the reference in an array to simulate real usage
    // If it's WeakMap, we'll "lose" the reference purposefully to see the GC act
    if (type === 'Map') objects.push(obj); 
    obj = null; // Remove local reference
  }

  const memory = process.memoryUsage();
  console.log(`Heap memory usage: ${formatMemory(memory.heapUsed)}`);
  
  // Clear references for GC (Attempt)
  objects = [];
  collection = null;
  
  console.log(`End of ${type} stress test`);
};
