const SIX_SEVEN_URL = '/six-seven.webp';

// Typing `six` and then `seven` in the browser console opens the six-seven picture.
// Both are getters on window, so a bare identifier in the console runs them.
export function installSixSeven() {
  let armed = false;

  Object.defineProperty(window, 'six', {
    configurable: true,
    get() {
      armed = true;
      return '…';
    },
  });

  Object.defineProperty(window, 'seven', {
    configurable: true,
    get() {
      if (!armed) return undefined;
      window.location.assign(SIX_SEVEN_URL);
      return '🤷';
    },
  });
}
