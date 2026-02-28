#!/bin/bash
# Quick check: Telegram bot token and getMe (run from project root)
set -e
cd "$(dirname "$0")/.."
if [ ! -f .env ]; then
  echo "No .env file"
  exit 1
fi
source .env
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "TELEGRAM_BOT_TOKEN is not set in .env"
  exit 1
fi
echo "Checking bot via getMe..."
resp=$(curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe")
if echo "$resp" | grep -q '"ok":true'; then
  name=$(echo "$resp" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
  echo "OK Bot: @${name}"
else
  echo "FAIL getMe: $resp"
  exit 1
fi
