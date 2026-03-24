#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LIBRARY_DIR="$PROJECT_DIR/assets/images/library"
IMAGES_DIR="$PROJECT_DIR/assets/images"

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <category> <image-name>"
  echo ""
  echo "Symlinks an image from the library into a category folder."
  echo ""
  echo "Categories: characters, celebration"
  echo ""
  echo "Examples:"
  echo "  $0 characters panda"
  echo "  $0 celebration fireworks-and-confetti"
  echo "  $0 characters princess-girl-pink-dress-tiara"
  echo ""
  echo "Available images in library:"
  if [ -d "$LIBRARY_DIR" ]; then
    ls "$LIBRARY_DIR" 2>/dev/null | sed 's/\.png$//' | sed 's/^/  /'
  else
    echo "  (none — run 'npm run gen:image' first)"
  fi
  exit 1
fi

CATEGORY="$1"
NAME="$2"

SOURCE="$LIBRARY_DIR/${NAME}.png"
TARGET_DIR="$IMAGES_DIR/$CATEGORY"
TARGET="$TARGET_DIR/${NAME}.png"

if [ ! -f "$SOURCE" ]; then
  echo "Error: $SOURCE not found"
  echo ""
  echo "Available images:"
  ls "$LIBRARY_DIR" 2>/dev/null | sed 's/\.png$//' | sed 's/^/  /'
  exit 1
fi

mkdir -p "$TARGET_DIR"

if [ -e "$TARGET" ]; then
  echo "Already exists: $TARGET"
  exit 0
fi

ln -s "../library/${NAME}.png" "$TARGET"
echo "Linked: $TARGET -> library/${NAME}.png"
echo ""
echo "Remember to add it to src/assets.ts"
