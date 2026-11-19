(() => {
  'use strict';

  // Fictional demo names only; this page does not report real transactions.
  const names = [
    'Taylor S.', 'Jessica M.', 'Emily R.', 'Ashley T.', 'Michael B.',
    'Sarah J.', 'Madison K.', 'Olivia D.', 'Emma W.', 'Sophia L.',
    'Ava C.', 'Isabella H.', 'Mia P.', 'Charlotte N.', 'Amelia G.',
    'Harper F.', 'Evelyn A.', 'Abigail V.', 'Ella Z.', 'Elizabeth O.',
    'Sofia E.', 'Avery I.', 'Scarlett U.', 'Grace Y.', 'Chloe Q.',
    'Victoria R.', 'Riley B.', 'Aria M.', 'Lily S.', 'Zoey T.',
    'Hannah D.', 'Nora K.', 'Addison W.', 'Brooklyn C.', 'Leah H.',
    'Zoe P.', 'Natalie N.', 'Audrey G.', 'Savannah F.', 'Claire A.',
    'Skylar V.', 'Lucy J.', 'Paisley L.', 'James E.', 'Benjamin O.',
    'Lucas Z.', 'Henry I.', 'Alexander U.', 'William Y.'
  ];

  const notification = document.querySelector('.notification');
  const nameElement = document.querySelector('.notification-name');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let queue = [];
  let previousName;
  let timer;
  let frame;
  let stopped = false;

  function shuffle(values) {
    const shuffled = [...values];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function nextName() {
    if (queue.length === 0) {
      queue = shuffle(names);
      // Avoid an immediate duplicate where two full cycles meet.
      if (queue[queue.length - 1] === previousName) {
        [queue[0], queue[queue.length - 1]] = [queue[queue.length - 1], queue[0]];
      }
    }
    previousName = queue.pop();
    return previousName;
  }

  function showNotification() {
    if (stopped) return;
    nameElement.textContent = nextName();
    notification.hidden = false;
    // Two frames establish the hidden pose before the entrance transition.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        notification.classList.add('is-visible');
        timer = setTimeout(hideNotification, 2500);
      });
    });
  }

  function hideNotification() {
    notification.classList.remove('is-visible');
    const fadeTime = reducedMotion.matches ? 0 : 280;
    timer = setTimeout(() => {
      notification.hidden = true;
      const delay = 1000 + Math.floor(Math.random() * 501);
      timer = setTimeout(showNotification, delay);
    }, fadeTime);
  }

  function pause() {
    stopped = true;
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    notification.classList.remove('is-visible');
    notification.hidden = true;
  }

  function resume() {
    if (!stopped || document.hidden) return;
    stopped = false;
    showNotification();
  }

  const particles = document.querySelector('.particles');
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 38; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.cssText = `--x:${Math.random() * 100}%;--y:${Math.random() * 100}%;--size:${2 + Math.random() * 7}px;--opacity:${.15 + Math.random() * .35};--duration:${9 + Math.random() * 9}s;--delay:${-Math.random() * 18}s`;
    fragment.appendChild(particle);
  }
  particles.appendChild(fragment);

  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());
  window.addEventListener('pagehide', pause);
  window.addEventListener('pageshow', resume);
  if (document.hidden) stopped = true;
  else showNotification();
})();
