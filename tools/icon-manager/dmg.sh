#!/bin/sh
# Packs the app into tools/icon-manager/build/Skill-Icons-Manager.dmg: a window with the app,
# an arrow and a shortcut to Applications, so installing is a drag. Pass --open to open it.
set -eu

DIR=$(cd "$(dirname "$0")" && pwd)
NAME="Skill Icons Manager"
OUT="$DIR/build"
DMG="$OUT/Skill-Icons-Manager.dmg"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

sh "$DIR/build.sh"

STAGE="$TMP/stage"
mkdir -p "$STAGE/.background"
cp -R "$OUT/$NAME.app" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
bun "$DIR/render.ts" dmg-background "$STAGE/.background/background.png"
sips -s dpiWidth 144 -s dpiHeight 144 "$STAGE/.background/background.png" >/dev/null

# A previous copy left mounted would make Finder lay out the wrong window.
[ -d "/Volumes/$NAME" ] && hdiutil detach "/Volumes/$NAME" -force >/dev/null || true

RW="$TMP/rw.dmg"
hdiutil create -volname "$NAME" -srcfolder "$STAGE" -fs HFS+ -format UDRW -ov "$RW" >/dev/null
DEVICE=$(hdiutil attach -readwrite -noverify -noautoopen "$RW" | awk '/Apple_HFS/ { print $1 }')

# Window layout. Needs permission for the terminal to control Finder; without it the image
# still works, only with Finder's default layout.
osascript <<EOF || echo "warning: could not lay out the DMG window (Finder automation denied?)"
tell application "Finder"
  tell disk "$NAME"
    open
    set current view of container window to icon view
    set toolbar visible of container window to false
    set statusbar visible of container window to false
    set the bounds of container window to {200, 120, 840, 520}
    set opts to the icon view options of container window
    set arrangement of opts to not arranged
    set icon size of opts to 128
    set text size of opts to 13
    set background picture of opts to file ".background:background.png"
    set position of item "$NAME.app" of container window to {170, 180}
    set position of item "Applications" of container window to {470, 180}
    close
    open
    update without registering applications
    delay 1
    close
  end tell
end tell
EOF

rm -rf "/Volumes/$NAME/.fseventsd"
sync
hdiutil detach "$DEVICE" >/dev/null
rm -f "$DMG"
hdiutil convert "$RW" -format UDZO -imagekey zlib-level=9 -o "$DMG" >/dev/null
echo "Packed $DMG"

if [ "${1:-}" = --open ]; then
  open "$DMG"
fi
