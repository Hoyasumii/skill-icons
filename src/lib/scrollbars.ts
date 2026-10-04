// How long a scrollbar stays on screen after its element last scrolled.
const IDLE_MS = 3000;
const FADE_IN_MS = 150;
const FADE_OUT_MS = 400;

// Safari doesn't restyle ::-webkit-scrollbar-thumb when its element's style changes, so
// the bar would never fade. index.css nudges the bar's width by 0.01px off this attribute,
// which makes WebKit rebuild the scrollbar with the current styles. Chromium repaints on
// its own.
const needsRepaint =
  /AppleWebKit/.test(navigator.userAgent) && !/Chrom|Edg/.test(navigator.userAgent);

const repaintScrollbar = (el: HTMLElement) => el.toggleAttribute('data-scrollbar-repaint');

type Bar = { opacity: number; target: number; frame: number; timer: number };

function setOpacity(el: HTMLElement, bar: Bar, opacity: number) {
  bar.opacity = opacity;
  if (opacity === 0) el.style.removeProperty('--scrollbar-opacity');
  else el.style.setProperty('--scrollbar-opacity', String(opacity));
  if (needsRepaint) repaintScrollbar(el);
}

// Fades from wherever the bar is now, so a scroll mid-fade-out turns it back smoothly.
function fade(el: HTMLElement, bar: Bar, target: number) {
  bar.target = target;
  cancelAnimationFrame(bar.frame);

  const from = bar.opacity;
  const duration = (target > from ? FADE_IN_MS : FADE_OUT_MS) * Math.abs(target - from);
  if (duration === 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setOpacity(el, bar, target);
    return;
  }

  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    setOpacity(el, bar, from + (target - from) * t);
    if (t < 1) bar.frame = requestAnimationFrame(step);
  };
  bar.frame = requestAnimationFrame(step);
}

// Scrollbars only show while their element is scrolling: a scroll fades the element's bar
// in, and 3s without one fades it out. index.css draws the bar off --scrollbar-opacity.
export function installScrollbarAutoHide() {
  const bars = new WeakMap<HTMLElement, Bar>();

  document.addEventListener(
    'scroll',
    event => {
      const el = event.target instanceof HTMLElement ? event.target : document.documentElement;
      let bar = bars.get(el);
      if (!bar) bars.set(el, (bar = { opacity: 0, target: 0, frame: 0, timer: 0 }));

      if (bar.target !== 1) fade(el, bar, 1);
      window.clearTimeout(bar.timer);
      bar.timer = window.setTimeout(() => fade(el, bar, 0), IDLE_MS);
    },
    { capture: true, passive: true },
  );
}
