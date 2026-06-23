#!/usr/bin/env bash
set -euo pipefail

# Builds a small, chronological Git history for the non-UI part of this POC.
# Intentionally excluded for tomorrow: src/ui/, index.html and vite.config.ts.

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
workspace_dir="$(cd "$project_dir/.." && pwd)"
git -C "$workspace_dir" rev-parse --show-toplevel >/dev/null
cd "$workspace_dir"

if ! git diff --cached --quiet; then
  echo "Abort: the index already has staged changes. Commit or unstage them first." >&2
  exit 1
fi

commit_files() {
  local date="$1"
  local message="$2"
  shift 2

  git add -- "$@"
  GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" \
    git commit -m "$message" -- "$@"
}

commit_files \
  "2026-06-18T10:15:00-03:00" \
  "feat(fileshare): define domain model and application ports" \
  encrypted-fileshare/.gitignore \
  encrypted-fileshare/package.json \
  encrypted-fileshare/pnpm-lock.yaml \
  encrypted-fileshare/tsconfig.json \
  encrypted-fileshare/src/domain/StoredFile.ts \
  encrypted-fileshare/src/application/ports/BlobStorage.ts \
  encrypted-fileshare/src/application/ports/CryptoService.ts \
  encrypted-fileshare/src/application/ports/FileRepository.ts \
  encrypted-fileshare/src/application/ports/SystemServices.ts

commit_files \
  "2026-06-19T14:20:00-03:00" \
  "feat(fileshare): implement encrypted file lifecycle and trash" \
  encrypted-fileshare/src/application/FileShareService.ts

commit_files \
  "2026-06-22T11:05:00-03:00" \
  "feat(fileshare): add AES-GCM and in-memory adapters" \
  encrypted-fileshare/src/infrastructure/InMemoryBlobStorage.ts \
  encrypted-fileshare/src/infrastructure/InMemoryFileRepository.ts \
  encrypted-fileshare/src/infrastructure/WebCryptoAesGcmService.ts \
  encrypted-fileshare/src/infrastructure/compositionRoot.ts

commit_files \
  "2026-06-23T01:20:00-03:00" \
  "test(fileshare): cover encryption and trash lifecycle" \
  encrypted-fileshare/src/tests/FileShareService.test.ts \
  encrypted-fileshare/README.md \
  encrypted-fileshare/commits.sh

echo
echo "History created. UI files remain untracked for tomorrow:"
git status --short -- encrypted-fileshare/src/ui encrypted-fileshare/index.html encrypted-fileshare/vite.config.ts
