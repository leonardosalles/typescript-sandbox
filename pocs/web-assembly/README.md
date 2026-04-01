# POC — WebAssembly + Rust

Deep POC seguindo a metodologia: não só chamar métodos, mas entender como funciona por dentro.

---

## Setup

### 1. Pré-requisitos

```bash
# Rust (via rustup)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# wasm-pack
cargo install wasm-pack

# Node.js 18+ (opcional, para benchmark no terminal)
```

### 2. Compilar o módulo WASM

```bash
cd poc-wasm

# Target para o browser (gera ES modules)
wasm-pack build --target web --out-dir www/pkg

# OU target para Node.js
wasm-pack build --target nodejs --out-dir pkg
```

### 3. Servir no browser

```bash
# Python (qualquer diretório)
cd www && python3 -m http.server 8080

# Node.js
cd www && npx serve .

# Abrir: http://localhost:8080
```

### 4. Benchmark no terminal (Node.js)

```bash
# Primeiro compile para Node:
wasm-pack build --target nodejs --out-dir pkg

cd www
node benchmark.js
```

---

## O que está implementado

### src/lib.rs

| Função | Nível | Ponto de aprendizado |
|--------|-------|----------------------|
| `fib(n)` | Básico | Benchmark puro, custo computacional |
| `fib_fast(n)` | Básico | Compare O(2^n) vs O(n) dentro do WASM |
| `sieve(limit)` | Médio | Vec<u32> → Uint32Array, transferência de dados |
| `sieve_count(limit)` | Médio | Retorno simples vs retorno de array |
| `alloc(size)` | Avançado | `mem::forget`, ponteiros, heap WASM |
| `dealloc(ptr, size)` | Avançado | Vec::from_raw_parts, gestão de memória |
| `fill_buffer(ptr, len, val)` | Avançado | `from_raw_parts_mut`, escrita sem cópia |
| `sum_buffer(ptr, len)` | Avançado | Leitura direta, zero-copy |
| `for_each_prime(limit, cb)` | Avançado | Rust chamando closures JS |
| `reduce_primes(limit, fn, init)` | Avançado | JsValue, js_sys::Function |
| `count_occurrences(text, pat)` | Médio | Custo UTF-8 na boundary |
| `reverse_string(s)` | Médio | chars() vs bytes(), Unicode correto |

---

## Experimentos para aprofundar (Deep POC)

### 1. Leia o WAT (WebAssembly Text Format)

```bash
# Instalar wabt (WebAssembly Binary Toolkit)
# macOS: brew install wabt
# Linux: apt install wabt

wasm-opt -O3 www/pkg/poc_wasm_bg.wasm -o optimized.wasm
wasm2wat optimized.wasm -o output.wat

# Agora leia output.wat — é o "assembly" do WASM
# Procure pelas funções fib, sieve, alloc
```

O que observar no WAT:
- Como loops são representados (`block`, `loop`, `br_if`)
- Como o compilador vetorizou operações
- Instruções de memória: `i32.load`, `i32.store`, `memory.size`

### 2. Inspecione no Chrome DevTools

1. Abra `http://localhost:8080`
2. F12 → Sources → `poc_wasm_bg.wasm`
3. Coloque breakpoints no código Rust compilado
4. Execute fib(10) e observe o call stack

### 3. Meça o overhead de boundary

```javascript
// Teste: muitas chamadas pequenas vs uma chamada grande
// Resultado esperado: muitas chamadas pequenas são MUITO mais lentas

const N = 100_000;

// Ruim: N chamadas WASM
let t0 = performance.now();
for (let i = 0; i < N; i++) fib(1);
console.log('N chamadas:', performance.now() - t0, 'ms');

// Bom: 1 chamada WASM que processa N itens
t0 = performance.now();
sieve_count(N);
console.log('1 chamada  :', performance.now() - t0, 'ms');
```

### 4. Acesso zero-copy à memória

```javascript
// Após alloc() + fill_buffer(), leia sem nenhuma cópia:
const ptr = alloc(1024);
fill_buffer(ptr, 1024, 0xFF);

// Acesso direto ao ArrayBuffer do WASM — zero cópias!
const view = new Uint8Array(wasmMemory.buffer, ptr, 1024);
console.log(view[0]); // 255

// IMPORTANTE: view é uma referência viva.
// Se o WASM crescer a memória, o buffer é realocado e view fica inválido!
// Sempre re-crie o Uint8Array após operações que possam crescer a memória.
```

### 5. Strings são caras — entenda por quê

Quando você chama `count_occurrences(text, pattern)`:

1. wasm-bindgen verifica o encoding da string JS (UTF-16 internamente)
2. Converte para UTF-8
3. Copia para o heap WASM via `malloc`
4. Rust executa
5. Rust copia o resultado de volta
6. JS recebe o valor

Compare com buffers numéricos: `Uint8Array` é passado por referência ao `ArrayBuffer` do WASM — sem cópia.

**Regra prática:** Para dados grandes, prefira buffers. Use strings apenas quando necessário.

### 6. SharedArrayBuffer (bônus avançado)

Para paralelismo real com Web Workers:

```javascript
// main.js
// Requer headers HTTP:
//   Cross-Origin-Opener-Policy: same-origin
//   Cross-Origin-Embedder-Policy: require-corp

const sab = new SharedArrayBuffer(4 * 1024 * 1024); // 4MB compartilhado
const worker = new Worker('worker.js');
worker.postMessage({ sab, offset: 0, length: 1024 * 1024 });
```

```javascript
// worker.js
self.onmessage = async ({ data: { sab, offset, length } }) => {
  const { default: init, fill_buffer } = await import('./pkg/poc_wasm.js');
  await init();
  const view = new Uint8Array(sab, offset, length);
  // Worker e main thread compartilham a mesma memória — sem cópia!
  view.fill(42);
  self.postMessage('done');
};
```

---

## Perguntas para reflexão (não pule isso)

1. Por que `fib(40)` WASM é mais rápido que JS, mas `count_occurrences` às vezes não é?
2. O que acontece se você não chamar `dealloc`? Escreva um teste que prove o vazamento.
3. Por que `sieve()` retorna `Uint32Array` e não `Vec<u32>` diretamente?
4. O que é `mem::forget` e por que precisamos dele em `alloc()`?
5. Por que o WAT gerado para `fib()` é muito maior que o código Rust original?
6. Quando WASM é uma **péssima** escolha? (Pesquise: DOM manipulation, startup cost, JS engine JIT)

---

## Leituras recomendadas (evite tutoriais, prefira fontes primárias)

- [The WebAssembly Specification](https://webassembly.github.io/spec/core/) — especificação oficial
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/introduction.html) — docs oficiais
- [Rust and WebAssembly Book](https://rustwasm.github.io/docs/book/) — game of life em WASM
- Código fonte do wasm-bindgen: `github.com/rustwasm/wasm-bindgen/tree/main/src`
- [Lin Clark's illustrated guide to WASM](https://hacks.mozilla.org/2017/02/a-cartoon-intro-to-webassembly/) — como funciona por dentro

---

## Estrutura do projeto

```
poc-wasm/
├── Cargo.toml          # Configuração Rust
├── src/
│   └── lib.rs          # Todo o código Rust
├── www/
│   ├── index.html      # UI de benchmark interativa
│   ├── benchmark.js    # Benchmark para Node.js
│   └── pkg/            # Gerado pelo wasm-pack (não commitar)
│       ├── poc_wasm.js
│       ├── poc_wasm_bg.wasm
│       └── poc_wasm.d.ts
└── README.md
```

---

*Tempo estimado para uma POC profunda: 2-5 dias. Não tente fazer tudo de uma vez.*
