#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
AUDIO_DIR="$PROJECT_DIR/assets/audio"

VOICE="${TIKTOK_VOICE:-en_us_001}"
API_URL="https://gesserit.co/api/tiktok-tts"

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <event> \"your text here\""
  echo ""
  echo "Events: all-correct, completion, completion-bad, correct, incorrect, menu, timeout"
  echo "Optional: export TIKTOK_VOICE=en_us_stitch (default: en_us_001)"
  echo "Voice codes: https://github.com/oscie57/tiktok-voice/wiki/Voice-Codes"
  exit 1
fi

EVENT="$1"
TEXT="$2"

BASENAME=$(echo "$TEXT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\{2,\}/-/g' | sed 's/^-//;s/-$//')
OUT_DIR="$AUDIO_DIR/$EVENT"
mkdir -p "$OUT_DIR"
FILEPATH="$OUT_DIR/${BASENAME}.mp3"

ESCAPED_TEXT=$(echo "$TEXT" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))")

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"text\":${ESCAPED_TEXT},\"voice\":\"${VOICE}\"}" \
  --connect-timeout 10 --max-time 30)

if [ -z "$RESPONSE" ]; then
  echo "Error: Empty response from API."
  exit 1
fi

echo "$RESPONSE" | python3 -c "
import sys, json, base64
data = json.load(sys.stdin)
url = data.get('audioUrl', '')
if not url:
    print('Error: No audioUrl in response')
    print('Response:', data)
    sys.exit(1)
prefix = 'data:audio/mp3;base64,'
if url.startswith(prefix):
    url = url[len(prefix):]
sys.stdout.buffer.write(base64.b64decode(url))
" > "$FILEPATH"

echo "Saved: $FILEPATH"
