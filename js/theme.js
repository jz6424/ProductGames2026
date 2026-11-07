// Theme switch. The retro "webcore" look is the default and is set on <html>
// in index.html. Add ?theme=dark to the URL for the dark radio-booth look, or
// ?theme=webcore to switch back. The choice is remembered on this device.
// Loaded in <head> so the page never flashes the wrong theme.
(function () {
  'use strict';

  // A new key, so choices saved while webcore was opt-in don't carry over.
  const KEY = 'static-theme-v2';
  let theme = null;

  try {
    theme = new URLSearchParams(window.location.search).get('theme');
  } catch (err) {
    theme = null;
  }

  try {
    if (theme) window.localStorage.setItem(KEY, theme);
    else theme = window.localStorage.getItem(KEY);
  } catch (err) {
    // Storage can be blocked; the URL parameter still works for this visit.
  }

  if (theme === 'dark') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = 'webcore';
})();
