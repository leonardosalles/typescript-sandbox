export const runMemoryTest = () => {
  let bigData = { id: 1, info: "tons of data here" };
  
  const map = new Map();
  const weakMap = new WeakMap();

  map.set(bigData, "Strong reference");
  weakMap.set(bigData, "Weak reference");

  bigData = null; 

  console.log("Map keeps the object: ", map.size);
  console.log("WeakMap keeps the object: ", weakMap.size);
};
