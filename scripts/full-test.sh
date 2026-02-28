#!/bin/bash
# Full project test suite (EXTENDED_TEST_REPORT scenarios)
set -e
BASE="${BASE_URL:-http://localhost:3000}"
FAIL=0

assert_code() { local expected=$1; local got=$2; local name=$3
  if [[ "$got" != "$expected" ]]; then echo "FAIL $name: expected HTTP $expected, got $got"; FAIL=1; else echo "OK $name"; fi
}

echo "=== 1. Health ==="
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/health")
assert_code 200 "$code" "GET /health"
body=$(curl -s "$BASE/health")
echo "$body" | grep -q '"status":"ok"' && echo "OK body status" || { echo "FAIL body"; FAIL=1; }
echo ""

echo "=== 2. Users ==="
TG_ID="${TG_ID:-$(( 100000000 + RANDOM * 1000 + RANDOM ))}"
# create user
u1=$(curl -s -X POST "$BASE/users" -H "Content-Type: application/json" -d "{\"telegramId\":$TG_ID,\"firstName\":\"Test\",\"lastName\":\"User\"}" -w "\n%{http_code}")
code=$(echo "$u1" | tail -n1); assert_code 201 "$code" "POST /users"
userId=$(echo "$u1" | head -n -1 | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
# duplicate telegramId -> 409
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/users" -H "Content-Type: application/json" -d "{\"telegramId\":$TG_ID,\"firstName\":\"Other\",\"lastName\":\"Name\"}")
assert_code 409 "$code" "POST /users duplicate telegramId 409"
# validation: telegramId string -> 400
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/users" -H "Content-Type: application/json" -d '{"telegramId":"not-a-number","firstName":"A","lastName":"B"}')
assert_code 400 "$code" "POST /users invalid telegramId 400"
echo ""

echo "=== 3. Tasks ==="
# create task
t1=$(curl -s -X POST "$BASE/tasks" -H "Content-Type: application/json" -d "{\"userId\":\"$userId\",\"title\":\"Test task\",\"description\":\"Desc\"}" -w "\n%{http_code}")
code=$(echo "$t1" | tail -n1); assert_code 201 "$code" "POST /tasks"
taskId=$(echo "$t1" | head -n -1 | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
# get task
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/tasks/task/$taskId"); assert_code 200 "$code" "GET /tasks/task/:id"
# create with non-existent userId -> 404
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/tasks" -H "Content-Type: application/json" -d '{"userId":"00000000-0000-0000-0000-000000000000","title":"X","description":"Y"}')
assert_code 404 "$code" "POST /tasks bad userId 404"
echo ""

echo "=== 4. Reminders ==="
r1=$(curl -s -X POST "$BASE/reminders" -H "Content-Type: application/json" -d "{\"taskId\":\"$taskId\",\"remindAt\":\"2026-12-31T12:00:00.000Z\"}" -w "\n%{http_code}")
code=$(echo "$r1" | tail -n1); assert_code 201 "$code" "POST /reminders"
# get by user
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/reminders/user/$userId"); assert_code 200 "$code" "GET /reminders/user/:userId"
echo ""

echo "=== 5. Recurring ==="
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/recurring/generate-today")
[[ "$code" == "200" || "$code" == "201" ]] && echo "OK POST /recurring/generate-today" || { echo "FAIL: expected 200/201, got $code"; FAIL=1; }
echo ""

echo "=== 6. Validation (extra fields) ==="
TG2=$(( 200000000 + RANDOM * 1000 + RANDOM ))
u2=$(curl -s -X POST "$BASE/users" -H "Content-Type: application/json" -d "{\"telegramId\":$TG2,\"firstName\":\"NoHack\",\"lastName\":\"User\",\"hack\":\"dropped\"}" -w "\n%{http_code}")
code=$(echo "$u2" | tail -n1); assert_code 201 "$code" "POST /users with extra field"
echo "$u2" | head -n -1 | grep -q '"hack"' && { echo "FAIL: extra field hack should be stripped"; FAIL=1; } || echo "OK extra field stripped"
echo ""

echo "=== 7. Delete task with reminders ==="
code=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/tasks/$taskId"); assert_code 200 "$code" "DELETE /tasks/:id (with reminders)"
echo ""

if [[ $FAIL -eq 0 ]]; then echo "All tests passed."; exit 0; else echo "Some tests failed."; exit 1; fi
