// Startup timing and dismissal live here; artwork is in previews.css.
// Run before the page is painted so the black intro never flashes over the hero.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = performance.getEntriesByType('navigation')[0];
  if (motion.matches || location.hash || navigation?.type === 'back_forward') return;

  const root = document.documentElement;
  const duration = 1950;
  let overlay;
  let finishTimer;
  let originalFocus;
  let blockedElements = [];
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(finishTimer);
    clearTimeout(failsafe);
    root.classList.remove('intro-pending', 'intro-running');
    document.body?.classList.remove('intro-active');
    window.projectPreviews?.sync();
    if (overlay) overlay.hidden = true;
    blockedElements.forEach((element) => {
      element.inert = false;
    });
    document.removeEventListener('keydown', handleKey, true);
    document.removeEventListener('visibilitychange', handleVisibility);
    motion.removeEventListener('change', handleMotion);
    window.removeEventListener('pagehide', finish);
    if (overlay?.contains(document.activeElement)) {
      document.activeElement.blur();
      if (originalFocus && originalFocus !== document.body) {
        originalFocus.focus({ preventScroll: true });
      }
    }
  }

  function handleKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      finish();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      overlay.querySelector('button').focus({ preventScroll: true });
    }
  }

  function handleVisibility() {
    if (document.hidden) finish();
  }

  function handleMotion() {
    if (motion.matches) finish();
  }

  // Even a later script failure or interrupted load must not trap a visitor.
  const failsafe = setTimeout(finish, 4000);
  root.classList.add('intro-pending');
  window.addEventListener('pagehide', finish);
  document.addEventListener('visibilitychange', handleVisibility);
  motion.addEventListener('change', handleMotion);

  document.addEventListener(
    'DOMContentLoaded',
    () => {
      if (finished) return;
      overlay = document.querySelector('#startup-intro');
      if (!overlay || document.hidden) {
        finish();
        return;
      }
      originalFocus = document.activeElement;
      blockedElements = Array.from(document.body.children).filter(
        (element) =>
          element !== overlay && !element.inert && element.tagName !== 'SCRIPT',
      );
      blockedElements.forEach((element) => {
        element.inert = true;
      });
      overlay.hidden = false;
      overlay.querySelector('button').addEventListener('click', finish);
      document.addEventListener('keydown', handleKey, true);
      document.body.classList.add('intro-active');
      window.projectPreviews?.sync();
      // Commit the initial black frame before playing the one-shot sequence.
      void overlay.offsetWidth;
      root.classList.add('intro-running');
      overlay.focus({ preventScroll: true });
      finishTimer = setTimeout(finish, duration);
    },
    { once: true },
  );
})();
