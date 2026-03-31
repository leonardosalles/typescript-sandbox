const {
  fib,
  fib_fast,
  sieve,
  sieve_count,
  count_occurrences,
} = require("../pkg/poc_wasm.js");

function bench(label, fn, runs = 5) {
  fn();
  const times = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    fn();
    times.push(performance.now() - t0);
  }
  const avg = times.reduce((a, b) => a + b) / runs;
  const min = Math.min(...times);
  const max = Math.max(...times);
  return { label, avg, min, max };
}

function printResult(wasmR, jsR) {
  const ratio = jsR.avg / wasmR.avg;
  const faster = ratio >= 1 ? "WASM" : "JS";
  const speed = ratio >= 1 ? ratio : 1 / ratio;

  console.log(
    `  WASM: ${wasmR.avg.toFixed(2)}ms avg (min ${wasmR.min.toFixed(2)} / max ${wasmR.max.toFixed(2)})`,
  );
  console.log(
    `  JS  : ${jsR.avg.toFixed(2)}ms avg (min ${jsR.min.toFixed(2)} / max ${jsR.max.toFixed(2)})`,
  );
  console.log(`  → ${faster} é ${speed.toFixed(2)}x mais rápido\n`);
}

function fibJS(n) {
  if (n <= 1) return n;
  return fibJS(n - 1) + fibJS(n - 2);
}

function sieveJS(limit) {
  const is_prime = new Uint8Array(limit + 1).fill(1);
  is_prime[0] = is_prime[1] = 0;
  for (let i = 2; i * i <= limit; i++)
    if (is_prime[i]) for (let j = i * i; j <= limit; j += i) is_prime[j] = 0;
  const out = [];
  for (let i = 2; i <= limit; i++) if (is_prime[i]) out.push(i);
  return out;
}

function countJS(text, pattern) {
  let count = 0,
    start = 0;
  while ((start = text.indexOf(pattern, start)) !== -1) {
    count++;
    start += pattern.length;
  }
  return count;
}

console.log("=".repeat(60));
console.log("  WebAssembly (Rust) vs JavaScript — Benchmarks");
console.log("=".repeat(60));

// Benchmark 1: Fibonacci
for (const n of [35, 40]) {
  console.log(`\nFibonacci(${n}) — O(2^n) recursivo`);
  const wasmR = bench(`fib(${n}) WASM`, () => fib(n));
  const jsR = bench(`fib(${n}) JS  `, () => fibJS(n));
  printResult(wasmR, jsR);
}

// Benchmark 2: Crivo
for (const limit of [100_000, 1_000_000]) {
  console.log(`Crivo de Eratóstenes(${limit.toLocaleString()})`);
  const wasmR = bench(`sieve(${limit}) WASM`, () => sieve(limit));
  const jsR = bench(`sieve(${limit}) JS  `, () => sieveJS(limit));
  console.log(`  Primos encontrados: ${sieve_count(limit).toLocaleString()}`);
  printResult(wasmR, jsR);
}

// Benchmark 3: Strings
const sizes = [100, 500]; // KB
for (const sizeKB of sizes) {
  const text = "abcdefghijklmnopqrstuvwxyz"
    .repeat(Math.ceil((sizeKB * 1024) / 26))
    .slice(0, sizeKB * 1024);
  const pattern = "abc";
  console.log(`count_occurrences("${pattern}") em ${sizeKB}KB de texto`);
  const wasmR = bench(`count WASM`, () => count_occurrences(text, pattern));
  const jsR = bench(`count JS  `, () => countJS(text, pattern));
  printResult(wasmR, jsR);
}

console.log("=".repeat(60));
