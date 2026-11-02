/* GazeVeil site behaviour: reveal on scroll, the hero eye, the sample-report zoom.
   No network, no storage, no cookies. Everything still works without it. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal sections as they scroll into view. */
  var revealing = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealing.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealing.forEach(function (el) { io.observe(el); });
  }

  /* The hero eye follows the pointer and blinks now and then. */
  var eye = document.querySelector('[data-eye]');
  if (eye && !reduce) {
    var pupil = eye.querySelector('[data-pupil]');
    var frame = 0;
    var lastPointer = 0;

    var lookAt = function (x, y) {
      var box = eye.getBoundingClientRect();
      var dx = x - (box.left + box.width / 2);
      var dy = y - (box.top + box.height / 2);
      var dist = Math.hypot(dx, dy) || 1;
      var pull = Math.min(1, dist / (box.width * 1.2));
      var tx = (dx / dist) * 6.5 * pull;
      var ty = (dy / dist) * 3.4 * pull;
      if (frame) return;
      frame = requestAnimationFrame(function () {
        pupil.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px)';
        frame = 0;
      });
    };

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      lastPointer = Date.now();
      lookAt(e.clientX, e.clientY);
    }, { passive: true });

    /* With no mouse (a phone), the eye glances around on its own. */
    setInterval(function () {
      if (document.hidden || Date.now() - lastPointer < 4000) return;
      var box = eye.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      lookAt(box.left + box.width / 2 + (Math.random() - 0.5) * box.width * 3,
             box.top + box.height / 2 + (Math.random() - 0.5) * box.height * 1.6);
    }, 2400);

    var blink = function () {
      if (!document.hidden) {
        eye.classList.add('blink');
        setTimeout(function () { eye.classList.remove('blink'); }, 140);
      }
      setTimeout(blink, 2600 + Math.random() * 4400);
    };
    setTimeout(blink, 1800);
  }

  /* Sample report: hover to zoom with a mouse; tap, Enter or Space to toggle. */
  var zoom = document.querySelector('[data-zoom]');
  if (zoom) {
    var sheet = zoom.querySelector('.sheet');
    var lastType = 'mouse';

    var aim = function (x, y) {
      var box = zoom.getBoundingClientRect();
      var px = Math.max(0, Math.min(100, ((x - box.left) / box.width) * 100));
      var py = Math.max(0, Math.min(100, ((y - box.top) / box.height) * 100));
      sheet.style.transformOrigin = px.toFixed(1) + '% ' + py.toFixed(1) + '%';
    };
    var set = function (on) {
      zoom.classList.toggle('zoomed', on);
      zoom.setAttribute('aria-pressed', on ? 'true' : 'false');
    };

    zoom.addEventListener('pointerdown', function (e) { lastType = e.pointerType; });
    zoom.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') { aim(e.clientX, e.clientY); set(true); }
    });
    zoom.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse') aim(e.clientX, e.clientY);
    });
    zoom.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') set(false);
    });
    zoom.addEventListener('click', function (e) {
      if (lastType === 'mouse') return;
      aim(e.clientX, e.clientY);
      set(!zoom.classList.contains('zoomed'));
    });
    zoom.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sheet.style.transformOrigin = '50% 30%';
        set(!zoom.classList.contains('zoomed'));
      } else if (e.key === 'Escape') {
        set(false);
      }
    });
  }
})();
