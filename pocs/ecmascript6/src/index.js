import { createSmartUser } from './meta-programming.js';
import { microtaskChallenge } from './async-deep.js';
import { primeGenerator } from './iterators.js';
import { BankAccount } from './private-weakmap.js';

import './reflect.js';

console.log("--- PROXY ---");
const user = createSmartUser();
user.name = "Leonardo";
user.age = 30; 

console.log("\n--- GENERATORS ---");
const primes = primeGenerator[Symbol.iterator]();
console.log(primes.next().value);
console.log(primes.next().value);
console.log(primes.next().value);

console.log("\n--- EVENT LOOP ---");
microtaskChallenge();

const account = new BankAccount("Salles", 1000);
console.log(account.balance);

console.log("\n--- REFLECT API ---");


runStressTest('Map');
runStressTest('WeakMap');
