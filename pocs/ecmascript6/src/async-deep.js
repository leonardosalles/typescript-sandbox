export const microtaskChallenge = () => {
  console.log("Start sync");

  setTimeout(() => console.log("Timeout macrotask"), 0);

  Promise.resolve()
    .then(() => console.log("Promise 1 - microtask"))
    .then(() => console.log("Promise 2 - microtask"));

  console.log("End sync");
};
