#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LIBRARY_DIR="$PROJECT_DIR/assets/images/library"

GCP_PROJECT="${GCP_PROJECT:-droid-api-491000}"
GCP_REGION="${GCP_REGION:-us-central1}"
MODEL="imagen-3.0-generate-002"
STYLE_PREFIX="${STYLE_PREFIX-cute chibi}"
STYLE_SUFFIX="${STYLE_SUFFIX-flat colors, thick black outlines, funny proportions, big head, cartoon, white background, no text, no face, no eyes, no mouth}"

if [ -z "$1" ]; then
  echo "Usage: $0 \"subject description\""
  echo ""
  echo "Examples:"
  echo "  $0 panda"
  echo "  $0 \"princess girl, pink dress, tiara\""
  echo "  $0 \"fireworks and confetti\""
  echo ""
  echo "Images are saved to assets/images/library/"
  echo "Use 'npm run use:image' to symlink them into characters/ or celebration/"
  echo ""
  echo "Style: $STYLE_PREFIX [SUBJECT], $STYLE_SUFFIX"
  echo "Override style with STYLE_PREFIX and STYLE_SUFFIX env vars."
  echo "Requires: gcloud auth application-default login"
  exit 1
fi

SUBJECT="$1"

PROMPT="$STYLE_PREFIX $SUBJECT, $STYLE_SUFFIX"

BASENAME=$(echo "$SUBJECT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\{2,\}/-/g' | sed 's/^-//;s/-$//')
mkdir -p "$LIBRARY_DIR"
FILEPATH="$LIBRARY_DIR/${BASENAME}.png"

echo "Prompt  : $PROMPT"
echo "Output  : $FILEPATH"

ACCESS_TOKEN=$(gcloud auth application-default print-access-token 2>/dev/null)
if [ -z "$ACCESS_TOKEN" ]; then
  echo "Error: Not authenticated. Run: gcloud auth application-default login"
  exit 1
fi

ESCAPED_PROMPT=$(echo "$PROMPT" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))")

RESPONSE=$(curl -s -X POST \
  "https://${GCP_REGION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT}/locations/${GCP_REGION}/publishers/google/models/${MODEL}:predict" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"instances\": [{\"prompt\": ${ESCAPED_PROMPT}}], \"parameters\": {\"sampleCount\": 1, \"aspectRatio\": \"1:1\", \"personGeneration\": \"allow_all\"}}")

echo "$RESPONSE" | python3 -c "
import sys, json, base64
data = json.load(sys.stdin)
if 'predictions' in data:
    img = base64.b64decode(data['predictions'][0]['bytesBase64Encoded'])
    with open('$FILEPATH', 'wb') as f:
        f.write(img)
    print(f'Saved: $FILEPATH ({len(img)} bytes)')
else:
    err = data.get('error', {})
    print(f'Error: {err.get(\"message\", json.dumps(data)[:300])}')
    sys.exit(1)
"

echo "Removing white background..."
python3 "$SCRIPT_DIR/remove-bg.py" "$FILEPATH"
