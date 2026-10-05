#!/bin/sh
# Builds tools/icon-manager/build/Skill Icons Manager.app (universal: Apple silicon + Intel).
#   RELEASE=1  leaves the repo path out, so the app asks for the skill-icons folder on first launch.
#   VERSION=x  sets the app version (default 1.0).
set -eu

DIR=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$DIR/../.." && pwd)
NAME="Skill Icons Manager"
OUT="$DIR/build"
APP="$OUT/$NAME.app"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

REPO_PATH=$REPO
[ "${RELEASE:-}" = 1 ] && REPO_PATH=""

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/fonts"

for arch in arm64 x86_64; do
  swiftc -O -swift-version 5 -target "$arch-apple-macos13.0" -framework AppKit -framework WebKit \
    "$DIR/main.swift" -o "$TMP/SkillIconsManager-$arch"
done
lipo -create "$TMP"/SkillIconsManager-* -output "$APP/Contents/MacOS/SkillIconsManager"

sed -e "s|__REPO_PATH__|$REPO_PATH|" -e "s|__VERSION__|${VERSION:-1.0}|" \
  "$DIR/Info.plist" >"$APP/Contents/Info.plist"
cp "$DIR/index.html" "$APP/Contents/Resources/"
cp "$REPO/node_modules/@fontsource-variable/familjen-grotesk/files/familjen-grotesk-latin-wght-normal.woff2" \
  "$REPO/node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2" \
  "$REPO/node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2" \
  "$APP/Contents/Resources/fonts/"

# App icon from the site favicon.
ICONSET="$TMP/AppIcon.iconset"
mkdir "$ICONSET"
bun "$DIR/render.ts" icon "$TMP/icon.png"
for s in 16 32 128 256 512; do
  sips -z $s $s "$TMP/icon.png" --out "$ICONSET/icon_${s}x${s}.png" >/dev/null
  sips -z $((s * 2)) $((s * 2)) "$TMP/icon.png" --out "$ICONSET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$ICONSET" -o "$APP/Contents/Resources/AppIcon.icns"

# Ad-hoc signature: enough to run locally; downloaded copies still need "Open Anyway" once.
codesign --force --sign - "$APP"
echo "Built $APP"
