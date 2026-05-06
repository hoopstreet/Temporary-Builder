#!/bin/sh

echo "🚀 PUSH START"

git add .

if git diff --cached --quiet; then
  echo "✅ No changes"
  exit 0
fi

git commit -m "🧠 V5 SWARM BUILD"

git pull --no-rebase origin main || true

git push origin main || true

echo "✅ DONE"
