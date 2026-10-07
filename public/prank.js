// The only JavaScript on this site, and it exists to make a point.
//
// Sit idle for a while and the page "gets defaced": it glitches, then a fake
// terminal announces the site has been owned and starts a wipe countdown. Any
// click or key reveals the joke. It fires at most once per browser session.
//
// Debug: add ?prank to the URL to fire after 3s, ignoring the session guard.
(function () {
  'use strict';

  var root = document.getElementById('pwned');
  if (!root || navigator.webdriver) return;

  var KEY = 'pwned-seen';
  var debug = /[?&]prank\b/.test(location.search);
  var delay = debug ? 3000 : 45000;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function seen() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* private mode */ }
  }

  if (seen() && !debug) return;

  var hex = function (n) {
    var s = '';
    while (n--) s += '0123456789abcdef'[Math.floor(Math.random() * 16)];
    return s;
  };

  var script = [
    '[!] connection from 185.' + (Math.random() * 255 | 0) + '.66.6:1337',
    '[*] uploading payload ........ ok',
    '[*] escalating privileges .... ok (uid=0)',
    '[*] dumping /etc/passwd',
    'root:x:0:0:root:/root:/bin/bash',
    'miguel:x:1000:1000::/home/miguel:/bin/zsh',
    'nobody:x:65534:65534:nobody:/:/usr/bin/nologin',
    '[*] exfiltrating ssh keys .... id_ed25519 (' + hex(16) + ')',
    '[*] browser history .......... 4,182 entries. yikes.',
    '',
    '  ######  PWNED BY 0xDEADBEEF  ######',
    '',
    '[!] wiping site in '
  ];

  var timer = 0;
  var fired = false;
  var revealed = false;
  var countdown = 0;
  var lastFocus = null;

  function arm() {
    if (fired) return;
    clearTimeout(timer);
    timer = setTimeout(fire, delay);
  }

  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) {
    addEventListener(ev, arm, { passive: true });
  });

  function fire() {
    if (document.hidden) { arm(); return; }
    fired = true;
    markSeen();
    lastFocus = document.activeElement;

    if (reduced) { open(); return; }
    document.documentElement.classList.add('is-glitching');
    setTimeout(function () {
      document.documentElement.classList.remove('is-glitching');
      open();
    }, 1200);
  }

  function open() {
    root.className = 'pwned';
    root.textContent = '';
    var term = document.createElement('pre');
    term.className = 'pwned__term';
    term.tabIndex = -1;
    root.appendChild(term);
    root.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    term.focus();

    root.addEventListener('click', reveal);
    addEventListener('keydown', onKey);

    type(term, 0);
  }

  // One line at a time, one character at a time; instant under reduced motion.
  function type(term, line) {
    if (revealed) return;
    if (line >= script.length) { tick(term, 10); return; }
    var text = script[line];
    if (reduced) {
      term.textContent += text + (line < script.length - 1 ? '\n' : '');
      type(term, line + 1);
      return;
    }
    var i = 0;
    (function next() {
      if (revealed) return;
      term.textContent += text.charAt(i++);
      if (i < text.length) { setTimeout(next, 12 + Math.random() * 25); return; }
      if (line < script.length - 1) term.textContent += '\n';
      setTimeout(function () { type(term, line + 1); }, 120);
    })();
  }

  function tick(term, n) {
    if (revealed) return;
    var base = term.textContent;
    (function step() {
      if (revealed) return;
      term.textContent = base + n + '...';
      if (n-- <= 0) { reveal(); return; }
      countdown = setTimeout(step, 1000);
    })();
  }

  function onKey(e) {
    if (revealed && e.key === 'Escape') { close(); return; }
    if (!revealed) { e.preventDefault(); reveal(); }
  }

  function reveal(e) {
    if (revealed) {
      // after the reveal, only the close button (or Esc) dismisses it
      if (e && e.target && e.target.closest && e.target.closest('.pwned__close')) close();
      return;
    }
    revealed = true;
    clearTimeout(countdown);
    root.className = 'pwned pwned--joke';
    root.setAttribute('aria-label', 'Just a prank');
    root.innerHTML =
      '<div class="pwned__card">' +
      '<p class="pwned__kicker">relax.</p>' +
      '<h2 class="pwned__title">nothing happened.</h2>' +
      '<p>No keys, no passwords, no history. This site has no server-side anything ' +
      'and nothing left your machine.</p>' +
      '<p>But a stranger’s website just ran code on your computer while you ' +
      'weren’t even looking at it. This one is under 200 lines of harmless ' +
      'JavaScript. The next one might not be.</p>' +
      '<p><strong>Disable JavaScript by default</strong> and allow it only on sites ' +
      'you trust. This one works fine without it.</p>' +
      '<p><a href="https://disable-javascript.org" target="_blank" rel="noopener">' +
      'disable-javascript.org →</a></p>' +
      '<button type="button" class="pwned__close">[ close ]</button>' +
      '</div>';
    root.querySelector('.pwned__close').focus();
  }

  function close() {
    root.hidden = true;
    root.textContent = '';
    removeEventListener('keydown', onKey);
    root.removeEventListener('click', reveal);
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  arm();
})();
