import init, {
  fib,
  fib_fast,
  sieve,
  sieve_count,
  alloc,
  dealloc,
  fill_buffer,
  sum_buffer,
  for_each_prime,
  reduce_primes,
  count_occurrences,
  reverse_string,
  version,
  build_info,
} from "./pkg/poc_wasm.js";

window._wasm = null;

function log(msg, type = "info") {
  const el = document.getElementById("log-output");
  const ts = new Date().toISOString().slice(11, 23);
  const div = document.createElement("div");
  div.className = `entry ${type}`;
  div.innerHTML = `<span class="ts">${ts}</span><span class="msg">${msg}</span>`;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}
window.clearLog = () => {
  document.getElementById("log-output").innerHTML = "";
};

window.showTab = (name) => {
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document.getElementById(`tab-${name}`).classList.add("active");
  event.target.classList.add("active");
};

async function measure(label, fn, runs = 3) {
  const times = [];
  fn();
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    fn();
    times.push(performance.now() - t0);
  }
  const avg = times.reduce((a, b) => a + b) / runs;
  log(
    `${label}: ${avg.toFixed(2)}ms (${runs} runs)`,
    label.includes("WASM") ? "wasm" : "js",
  );
  return avg;
}

function renderResults(containerId, wasmTime, jsTime, extra = "") {
  const ratio = jsTime / wasmTime;
  const faster = ratio >= 1;
  document.getElementById(containerId).innerHTML = `
      <div class="result-box wasm-box">
        <div class="label">WASM (Rust)</div>
        <div class="value">${wasmTime.toFixed(1)}ms</div>
        <div class="sub">média 3 execuções</div>
      </div>
      <div class="result-box js-box">
        <div class="label">JavaScript puro</div>
        <div class="value">${jsTime.toFixed(1)}ms</div>
        <div class="sub">mesmo algoritmo</div>
      </div>
      <div class="result-box ratio-box ${faster ? "" : "slower"}">
        <div class="label">${faster ? "WASM mais rápido" : "JS mais rápido"}</div>
        <div class="value">${faster ? ratio.toFixed(2) : (1 / ratio).toFixed(2)}x</div>
        <div class="sub">${extra}</div>
      </div>
    `;
}

window.runFibBench = async () => {
  const n = parseInt(document.getElementById("fib-n").value);
  const btn = document.getElementById("btn-fib");
  btn.disabled = true;
  log(`Iniciando benchmark fib(${n})`);

  function fibJS(x) {
    return x <= 1 ? x : fibJS(x - 1) + fibJS(x - 2);
  }

  const wasmTime = await measure(`fib(${n}) WASM`, () => fib(n));
  const jsTime = await measure(`fib(${n}) JS  `, () => fibJS(n));

  renderResults("fib-results", wasmTime, jsTime, `n=${n}`);
  log(`Resultado fib(${n}) = ${fib(n)}`, "ok");
  btn.disabled = false;
};

window.runSieveBench = async () => {
  const limit = parseInt(document.getElementById("sieve-n").value);
  const btn = document.getElementById("btn-sieve");
  btn.disabled = true;
  log(`Iniciando benchmark sieve(${limit.toLocaleString()})`);

  function sieveJS(lim) {
    const is_prime = new Uint8Array(lim + 1).fill(1);
    is_prime[0] = is_prime[1] = 0;
    for (let i = 2; i * i <= lim; i++)
      if (is_prime[i]) for (let j = i * i; j <= lim; j += i) is_prime[j] = 0;
    const out = [];
    for (let i = 2; i <= lim; i++) if (is_prime[i]) out.push(i);
    return out;
  }

  const wasmTime = await measure(`sieve(${limit.toLocaleString()}) WASM`, () =>
    sieve(limit),
  );
  const jsTime = await measure(`sieve(${limit.toLocaleString()}) JS  `, () =>
    sieveJS(limit),
  );

  const count = sieve_count(limit);
  renderResults(
    "sieve-results",
    wasmTime,
    jsTime,
    `${count.toLocaleString()} primos`,
  );
  log(`Primos até ${limit.toLocaleString()}: ${count.toLocaleString()}`, "ok");
  btn.disabled = false;
};

let currentPtr = null;
let currentSize = 0;

window.runMemoryDemo = () => {
  if (currentPtr !== null) {
    dealloc(currentPtr, currentSize);
    log(
      `Memória anterior (ptr=${currentPtr}, ${currentSize}B) liberada`,
      "warn",
    );
  }

  currentSize = parseInt(document.getElementById("mem-size").value);
  const value = parseInt(document.getElementById("mem-val").value);

  currentPtr = alloc(currentSize);
  fill_buffer(currentPtr, currentSize, value);
  log(`alloc(${currentSize}) → ptr=${currentPtr}`, "wasm");
  log(`fill_buffer(ptr, ${currentSize}, ${value})`, "wasm");

  const mem = new Uint8Array(
    window._wasm.memory.buffer,
    currentPtr,
    Math.min(currentSize, 128),
  );

  document.getElementById("mem-info").textContent =
    `ptr=${currentPtr}  |  size=${currentSize}B  |  valor=${value}  |  total memory=${(window._wasm.memory.buffer.byteLength / 1024).toFixed(0)}KB`;

  const view = document.getElementById("mem-view");
  const show = Math.min(currentSize, 128);
  view.innerHTML =
    Array.from(mem.slice(0, show))
      .map(
        (b) =>
          `<span class="mem-byte ${b !== 0 ? "filled" : "empty"}">${b.toString(16).padStart(2, "0")}</span>`,
      )
      .join("") +
    (currentSize > 128
      ? `<span style="color:var(--muted)"> ... +${currentSize - 128} bytes</span>`
      : "");
};

window.freeMemory = () => {
  if (currentPtr === null) {
    log("Nenhum buffer alocado", "warn");
    return;
  }
  dealloc(currentPtr, currentSize);
  log(`dealloc(ptr=${currentPtr}, ${currentSize}B) — memória liberada`, "ok");
  currentPtr = null;
  currentSize = 0;
  document.getElementById("mem-info").textContent = "";
  document.getElementById("mem-view").innerHTML = "";
  document.getElementById("sum-result").textContent = "";
};

window.runSumBuffer = () => {
  if (currentPtr === null) {
    log("Aloque um buffer primeiro", "warn");
    return;
  }
  const result = sum_buffer(currentPtr, currentSize);
  const el = document.getElementById("sum-result");
  el.textContent = `sum_buffer(ptr=${currentPtr}, len=${currentSize}) = ${result.toLocaleString()}`;
  log(`sum_buffer → ${result}`, "wasm");
};

window.runCallback = () => {
  const limit = parseInt(document.getElementById("cb-limit").value);
  let count = 0;
  const t0 = performance.now();
  for_each_prime(limit, (p) => {
    count++;
  });
  const elapsed = (performance.now() - t0).toFixed(2);
  document.getElementById("cb-result").innerHTML =
    `<span style="color:var(--green)">Rust chamou a callback JS ${count.toLocaleString()} vezes em ${elapsed}ms</span><br>
       <span style="color:var(--muted); font-size:11px;">Cada chamada WASM→JS tem overhead. Compare com sieve_count() que não faz callbacks.</span>`;
  log(`for_each_prime(${limit}) → ${count} callbacks em ${elapsed}ms`, "wasm");
};

window.runReduceSum = () => {
  const limit = parseInt(document.getElementById("reduce-limit").value);
  const result = reduce_primes(limit, (acc, p) => acc + p, 0);
  document.getElementById("reduce-result").innerHTML =
    `<span style="color:var(--green)">Soma de todos os primos até ${limit}: <strong>${result.toLocaleString()}</strong></span>`;
  log(`reduce_primes soma → ${result}`, "wasm");
};

window.runReduceMax = () => {
  const limit = parseInt(document.getElementById("reduce-limit").value);
  const result = reduce_primes(limit, (acc, p) => (p > acc ? p : acc), 0);
  document.getElementById("reduce-result").innerHTML =
    `<span style="color:var(--green)">Maior primo até ${limit}: <strong>${result.toLocaleString()}</strong></span>`;
  log(`reduce_primes max → ${result}`, "wasm");
};

window.runReduceProduct = () => {
  const limit = parseInt(document.getElementById("reduce-limit").value);
  const result = reduce_primes(limit, (acc, p) => (acc * p) % 1_000_000_007, 1);
  document.getElementById("reduce-result").innerHTML =
    `<span style="color:var(--green)">Produto dos primos até ${limit} (mod 10⁹+7): <strong>${result.toLocaleString()}</strong></span>`;
  log(`reduce_primes product → ${result}`, "wasm");
};

window.runStringBench = async () => {
  const sizeKB = parseInt(document.getElementById("str-size").value);
  const pattern = document.getElementById("str-pattern").value || "abc";
  const text = "abcdefghijklmnopqrstuvwxyz"
    .repeat(Math.ceil((sizeKB * 1024) / 26))
    .slice(0, sizeKB * 1024);

  log(`String benchmark: ${sizeKB}KB, padrão="${pattern}"`);
  log(
    "AVISO: strings passam por alocação UTF-8 na boundary. Custo extra em relação a buffers.",
    "warn",
  );

  function countJS(t, p) {
    let count = 0,
      start = 0;
    while ((start = t.indexOf(p, start)) !== -1) {
      count++;
      start += p.length;
    }
    return count;
  }

  const wasmTime = await measure(`count_occurrences WASM`, () =>
    count_occurrences(text, pattern),
  );
  const jsTime = await measure(`count JS indexOf      `, () =>
    countJS(text, pattern),
  );
  const expected = count_occurrences(text, pattern);

  renderResults(
    "str-results",
    wasmTime,
    jsTime,
    `${expected.toLocaleString()} ocorrências`,
  );
  log(
    `Resultado: ${expected.toLocaleString()} ocorrências em ${sizeKB}KB`,
    "ok",
  );
};

window.runReverseString = () => {
  const s = document.getElementById("str-input").value;
  const result = reverse_string(s);
  document.getElementById("reverse-result").textContent = result;
  log(`reverse_string("${s}") → "${result}"`, "wasm");
};

async function main() {
  try {
    const wasmModule = await init();

    window._wasm = wasmModule;

    document.getElementById("status-dot").className = "dot ok";
    document.getElementById("status-text").textContent =
      `WASM carregado — ${version()}`;

    log("Módulo WASM inicializado com sucesso", "ok");
    log(build_info(), "wasm");
    log(`fib(10) = ${fib(10)}, fib_fast(10) = ${fib_fast(10)}`, "ok");
    log(`sieve_count(100) = ${sieve_count(100)} primos`, "ok");
    log("Pronto. Abra as abas acima para explorar.", "info");
  } catch (err) {
    document.getElementById("status-dot").className = "dot err";
    document.getElementById("status-text").textContent =
      `Erro ao carregar WASM: ${err.message}`;
    log(`ERRO: ${err.message}`, "err");
    log("Certifique-se de servir os arquivos via HTTP (não file://).", "warn");
  }
}

main();
