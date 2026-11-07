// Shows the "How to play" pop-up each time the site opens.
(function () {
  'use strict';

  const intro = document.getElementById('intro');
  if (!intro) return;

  if (typeof intro.showModal === 'function') {
    intro.showModal();
  } else {
    // Older browsers without <dialog>: show it inline and close it by hand.
    intro.setAttribute('open', '');
    intro.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      intro.removeAttribute('open');
    });
  }
})();
