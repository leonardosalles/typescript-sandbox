use wasm_bindgen::prelude::*;

// ============================================================
// NÍVEL 1 — Fibonacci O(2^n) intencional para benchmark
// ============================================================

/// Fibonacci recursivo naive — O(2^n)
/// Usado para stressar e medir WASM vs JS puro.
#[wasm_bindgen]
pub fn fib(n: u32) -> u64 {
    if n <= 1 {
        return n as u64;
    }
    fib(n - 1) + fib(n - 2)
}

/// Fibonacci iterativo — O(n), para comparar abordagens dentro do WASM
#[wasm_bindgen]
pub fn fib_fast(n: u32) -> u64 {
    if n <= 1 {
        return n as u64;
    }
    let (mut a, mut b) = (0u64, 1u64);
    for _ in 2..=n {
        let c = a + b;
        a = b;
        b = c;
    }
    b
}

// ============================================================
// NÍVEL 2 — Crivo de Eratóstenes retornando Uint32Array
// Demonstra transferência de Vec<u32> → JS sem cópia extra
// ============================================================

/// Retorna todos os primos até `limit` como Uint32Array (zero-copy para JS).
/// Experimento: observe no DevTools que o buffer é transferido, não copiado.
#[wasm_bindgen]
pub fn sieve(limit: usize) -> js_sys::Uint32Array {
    if limit < 2 {
        return js_sys::Uint32Array::new_with_length(0);
    }

    let mut is_prime = vec![true; limit + 1];
    is_prime[0] = false;
    is_prime[1] = false;

    let mut i = 2;
    while i * i <= limit {
        if is_prime[i] {
            let mut j = i * i;
            while j <= limit {
                is_prime[j] = false;
                j += i;
            }
        }
        i += 1;
    }

    let primes: Vec<u32> = (2..=limit as u32)
        .filter(|&x| is_prime[x as usize])
        .collect();

    js_sys::Uint32Array::from(primes.as_slice())
}

/// Versão que retorna apenas a contagem — mede overhead de retorno de dados
#[wasm_bindgen]
pub fn sieve_count(limit: usize) -> u32 {
    if limit < 2 {
        return 0;
    }
    let mut is_prime = vec![true; limit + 1];
    is_prime[0] = false;
    is_prime[1] = false;
    let mut i = 2;
    while i * i <= limit {
        if is_prime[i] {
            let mut j = i * i;
            while j <= limit {
                is_prime[j] = false;
                j += i;
            }
        }
        i += 1;
    }
    (2..=limit).filter(|&x| is_prime[x]).count() as u32
}

// ============================================================
// NÍVEL 3 — Acesso direto à memória WASM (unsafe + zero-copy)
// Este é o nível profundo: controle manual de heap
// ============================================================

/// Aloca `size` bytes no heap Rust e retorna o ponteiro.
/// IMPORTANTE: você é responsável por chamar `dealloc` depois!
/// Experimento: observe o ponteiro no campo `memory.buffer` do WASM.
#[wasm_bindgen]
pub fn alloc(size: usize) -> *mut u8 {
    let mut buf: Vec<u8> = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    // mem::forget previne o destructor — a memória persiste
    std::mem::forget(buf);
    ptr
}

/// Libera memória alocada com `alloc`.
/// Se você esquecer de chamar isso: memory leak no WASM heap.
#[wasm_bindgen]
pub fn dealloc(ptr: *mut u8, size: usize) {
    unsafe {
        let _ = Vec::from_raw_parts(ptr, 0, size);
        // Vec sai de escopo aqui e libera a memória
    }
}

/// Preenche `len` bytes a partir de `ptr` com `value`.
/// Demonstra escrita direta no buffer WASM sem passar pelo JS.
#[wasm_bindgen]
pub fn fill_buffer(ptr: *mut u8, len: usize, value: u8) {
    let slice = unsafe { std::slice::from_raw_parts_mut(ptr, len) };
    slice.fill(value);
}

/// Soma todos os bytes em um buffer — leitura direta da memória WASM.
/// Use do lado JS: passe um ptr e leia o resultado sem copiar nada.
#[wasm_bindgen]
pub fn sum_buffer(ptr: *const u8, len: usize) -> u64 {
    let slice = unsafe { std::slice::from_raw_parts(ptr, len) };
    slice.iter().map(|&b| b as u64).sum()
}

// ============================================================
// NÍVEL 4 — Callbacks: Rust recebe closures do JS
// Demonstra wasm_bindgen com Function e JsValue
// ============================================================

/// Recebe uma callback JS e a chama com cada número primo até `limit`.
/// Experimento: observe como o Rust converte JsValue → u32 e vice-versa.
#[wasm_bindgen]
pub fn for_each_prime(limit: usize, callback: &js_sys::Function) {
    let this = JsValue::null();
    let primes = sieve(limit);
    for i in 0..primes.length() {
        let val = JsValue::from(primes.get_index(i));
        // Ignora erro de JS deliberadamente — veja o que acontece se callback lançar
        let _ = callback.call1(&this, &val);
    }
}

/// Versão com reduce: aplica uma função JS acumuladora em todos os primos.
/// Retorna o valor final acumulado como f64.
#[wasm_bindgen]
pub fn reduce_primes(limit: usize, reducer: &js_sys::Function, initial: f64) -> f64 {
    let this = JsValue::null();
    let primes = sieve(limit);
    let mut acc = JsValue::from_f64(initial);
    for i in 0..primes.length() {
        let val = JsValue::from(primes.get_index(i));
        match reducer.call2(&this, &acc, &val) {
            Ok(result) => acc = result,
            Err(e) => {
                web_sys_log(&format!("reducer error at index {}: {:?}", i, e));
                break;
            }
        }
    }
    acc.as_f64().unwrap_or(0.0)
}

// Helper para logar no console do browser (sem depender de web-sys completo)
fn web_sys_log(_msg: &str) {
    // Em uma POC real: use web_sys::console::log_1
    // Omitido aqui para não adicionar dependência de web-sys
}

// ============================================================
// NÍVEL 5 — Operações em strings (observe o custo de UTF-8)
// Strings cruzam a boundary com cópia — diferente dos buffers!
// ============================================================

/// Conta ocorrências de `pattern` em `text`.
/// Experimento: meça o tempo. Strings passam por alocação UTF-8.
#[wasm_bindgen]
pub fn count_occurrences(text: &str, pattern: &str) -> u32 {
    if pattern.is_empty() {
        return 0;
    }
    let mut count = 0u32;
    let mut start = 0;
    while let Some(pos) = text[start..].find(pattern) {
        count += 1;
        start += pos + pattern.len();
        if start >= text.len() {
            break;
        }
    }
    count
}

/// Inverte uma string UTF-8 corretamente (por caracteres, não bytes).
/// Experimento: compare com o split('').reverse().join('') do JS.
#[wasm_bindgen]
pub fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}

// ============================================================
// Utilitários de diagnóstico
// ============================================================

/// Retorna a versão da POC — útil para confirmar que o WASM carregou.
#[wasm_bindgen]
pub fn version() -> String {
    "poc-wasm 0.1.0 — Rust + WebAssembly Deep POC".to_string()
}

/// Retorna informações sobre o ambiente de compilação.
#[wasm_bindgen]
pub fn build_info() -> String {
    format!(
        "target=wasm32, pointer_size={} bytes, usize={} bytes",
        std::mem::size_of::<*const u8>(),
        std::mem::size_of::<usize>()
    )
}
