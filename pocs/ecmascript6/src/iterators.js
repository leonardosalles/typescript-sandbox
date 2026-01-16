export const primeGenerator = {
  [Symbol.iterator]: function* () {
    let n = 2;
    while (true) {
      if (isPrime(n)) yield n;
      n++;
    }
  }
};

function isPrime(num) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false;
  return num > 1;
}
