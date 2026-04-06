#!/bin/bash
 
set -e
 
# 1 — setup inicial
git add Cargo.toml .gitignore
GIT_AUTHOR_DATE="2026-03-30T09:14:00" \
GIT_COMMITTER_DATE="2026-03-30T09:14:00" \
git commit -m "chore: init wasm lib project with wasm-bindgen"
 
# 2 — código Rust completo
git add src/lib.rs
GIT_AUTHOR_DATE="2026-03-31T10:30:00" \
GIT_COMMITTER_DATE="2026-03-31T10:30:00" \
git commit -m "feat: add fib, sieve, raw memory alloc and js callbacks"
 
# 3 — frontend e benchmark
git add www/index.html www/benchmark.js
GIT_AUTHOR_DATE="2026-03-31T17:45:00" \
GIT_COMMITTER_DATE="2026-03-31T17:45:00" \
git commit -m "feat: add benchmark ui and node.js runner"
 
# 4 — documentação
git add README.md
GIT_AUTHOR_DATE="2026-04-01T15:50:00" \
GIT_COMMITTER_DATE="2026-04-01T15:50:00" \
git commit -m "docs: README with setup, deep experiments and reflection questions"
 
echo ""
git log --oneline
