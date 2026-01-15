import { createSmartUser } from './meta-programming.js';
import { microtaskChallenge } from './async-deep.js';

console.log("--- PROXY ---");
const user = createSmartUser();
user.name = "Leonardo";
user.age = 30; 

console.log("\n--- EVENT LOOP ---");
microtaskChallenge();
