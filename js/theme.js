// Opt-in themes for experimenting with the look. Add ?theme=webcore to the URL
// for the retro desktop theme, or ?theme=default to switch back. The choice is
// remembered on this device. Loaded in <head> so the page never flashes the
// wrong theme.
(function () {
  'use strict';

  const KEY = 'static-theme';
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

  if (theme === 'webcore') document.documentElement.dataset.theme = 'webcore';
})();
