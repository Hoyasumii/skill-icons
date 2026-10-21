import type { Theme } from '../../shared/icons';
import { tintIconSvg, type Tint } from '../../shared/tint';
import { iconSrc } from '@/lib/icons';

const svgText = new Map<string, Promise<string>>();
const tinted = new Map<string, string>();
const listeners = new Set<() => void>();
const pending = new Set<Promise<void>>();
let version = 0;
let notifyQueued = false;

function toDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Tells the subscribers once per frame, however many icons finished in it. */
function notify() {
  if (notifyQueued) return;
  notifyQueued = true;
  requestAnimationFrame(() => {
    notifyQueued = false;
    version++;
    for (const listener of listeners) listener();
  });
}

export function subscribeTinted(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function tintedVersion(): number {
  return version;
}

const nextFrame = () => new Promise(requestAnimationFrame);

/**
 * Resolves once the tinted copies asked for so far have loaded and the page has re-rendered
 * with them, or after `timeout`, whichever comes first.
 */
export function tintedSettled(timeout = 600): Promise<unknown> {
  // The subscribers hear on the next frame; React commits the frame after.
  const settled = Promise.all(pending).then(nextFrame).then(nextFrame);
  return Promise.race([settled, new Promise(resolve => setTimeout(resolve, timeout))]);
}

/**
 * The icon redrawn in `tint`, from the same static thumbnail the grid shows (its dark variant,
 * like the API). Until it has loaded, an empty tile in the tint stands in for it.
 */
export function tintedIconSrc(name: string, theme: Theme, tint: Tint): string {
  const key = `${name}|${theme}|${tint}`;
  const done = tinted.get(key);
  if (done) return done;

  const url = iconSrc(name, 'dark');
  let text = svgText.get(url);
  if (!text) {
    text = fetch(url).then(res => (res.ok ? res.text() : Promise.reject(new Error(url))));
    // A failed fetch may succeed later (offline, then online).
    text.catch(() => svgText.delete(url));
    svgText.set(url, text);
  }
  const job = text
    .then(svg => {
      if (tinted.has(key)) return;
      tinted.set(key, toDataUrl(tintIconSvg(svg, tint, theme)));
      notify();
    })
    .catch(() => {})
    .finally(() => pending.delete(job));
  pending.add(job);

  const tileKey = `|${theme}|${tint}`;
  let tile = tinted.get(tileKey);
  if (!tile) {
    tile = toDataUrl(tintIconSvg('', tint, theme));
    tinted.set(tileKey, tile);
  }
  return tile;
}
