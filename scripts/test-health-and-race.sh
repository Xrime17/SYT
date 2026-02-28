#!/usr/bin/env bash
# Test GET /health and parallel POST /recurring/generate-today (race-condition protection)
set -e
BASE="${BASE_URL:-http://localhost:3000}"

echo "=== 1. GET /health ==="
resp=$(curl -s -w "\n%{http_code}" "$BASE/health")
body=$(echo "$resp" | head -n -1)
code=$(echo "$resp" | tail -n 1)
echo "HTTP $code"
echo "$body" | head -c 200
echo ""
if [[ "$code" != "200" ]]; then echo "FAIL: expected 200"; exit 1; fi
if ! echo "$body" | grep -q '"status":"ok"'; then echo "FAIL: expected status ok"; exit 1; fi
if ! echo "$body" | grep -q '"timestamp"'; then echo "FAIL: expected timestamp"; exit 1; fi
echo "OK"
echo ""

echo "=== 2. Parallel POST /recurring/generate-today (5 requests) ==="
tmpdir=$(mktemp -d)
for i in 1 2 3 4 5; do
  curl -s -w "\n%{http_code}" -X POST "$BASE/recurring/generate-today" -o "$tmpdir/out$i" &
done
wait
all_200=true
for i in 1 2 3 4 5; do
  code=$(tail -n 1 "$tmpdir/out$i")
  body=$(head -n -1 "$tmpdir/out$i")
  echo "  Request $i: HTTP $code, body=$body"
  if [[ "$code" != "200" ]]; then all_200=false; fi
done
rm -rf "$tmpdir"
if [[ "$all_200" != "true" ]]; then echo "FAIL: all requests must return 200"; exit 1; fi
echo "OK: all 5 returned 200 (P2002 handled silently)"
echo ""

echo "=== 3. Duplicate check (DB) ==="
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfToday = new Date(startOfToday.getTime() + 24*60*60*1000);
  const tasks = await prisma.task.findMany({
    where: { generatedDate: { gte: startOfToday, lt: endOfToday }, recurringRuleId: { not: null } },
    select: { recurringRuleId: true }
  });
  const byRule = {};
  for (const t of tasks) {
    byRule[t.recurringRuleId] = (byRule[t.recurringRuleId] || 0) + 1;
  }
  const dupes = Object.entries(byRule).filter(([, c]) => c > 1);
  if (dupes.length) {
    console.error('FAIL: duplicate tasks per rule today:', dupes);
    process.exit(1);
  }
  console.log('OK: no duplicate (recurringRuleId, generatedDate) for today;', tasks.length, 'generated task(s)');
  await prisma.\$disconnect();
})();
"
echo ""
echo "All checks passed."
