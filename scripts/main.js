/**
 * Birthday I-Spy — Shared utilities
 * Cursor glow, floating emojis, confetti, page transitions
 */

(function () {
  "use strict";

  const CONFETTI_CDN =
    "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";

  /** Load canvas-confetti once */
  let confettiReady = typeof confetti !== "undefined";

  function loadConfetti() {
    if (confettiReady) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CONFETTI_CDN;
      script.async = true;
      script.onload = () => {
        confettiReady = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Warm celebration burst — works on desktop and mobile
   */
  function fireConfetti(options = {}) {
    if (!confettiReady || typeof confetti !== "function") return;
    const defaults = {
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffb347", "#ff6b6b", "#ffd700", "#4facfe", "#f093fb"],
    };
    confetti({ ...defaults, ...options });
    confetti({
      ...defaults,
      ...options,
      particleCount: 40,
      origin: { x: 0.2, y: 0.5 },
    });
    confetti({
      ...defaults,
      ...options,
      particleCount: 40,
      origin: { x: 0.8, y: 0.5 },
    });
  }

  /** Big finale burst when all items are found */
  function fireGrandConfetti() {
    if (!confettiReady) return;
    const duration = 2500;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ffb347", "#ff6b6b", "#00ff88"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#4facfe", "#ffd700", "#f093fb"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  /** Custom cursor glow following pointer (desktop only) */
  function initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    if (!glow) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      glow.remove();
      return;
    }

    let x = -9999;
    let y = -9999;
    let targetX = x;
    let targetY = y;

    document.addEventListener(
      "mousemove",
      (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
      },
      { passive: true }
    );

    function tick() {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      glow.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /** Scatter floating emoji decorations across the viewport */
  function initFloatingEmojis(containerSelector = ".emoji-float-layer") {
    const layer = document.querySelector(containerSelector);
    if (!layer) return;

    const emojis = ["🎈", "🎉", "🎁", "⭐", "🌈", "☀️"];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "float-emoji";
      el.setAttribute("aria-hidden", "true");
      el.textContent = emojis[i % emojis.length];
      el.style.left = `${(i * 8.3) % 92 + 2}%`;
      el.style.top = `${(i * 13) % 88 + 4}%`;
      el.style.animationDelay = `${-(i * 0.7)}s`;
      el.style.animationDuration = `${10 + (i % 5)}s`;
      layer.appendChild(el);
    }
  }

  /** Fade out body then navigate */
  function navigateWithFade(url) {
    document.body.classList.add("page-fade-out");
    setTimeout(() => {
      window.location.href = url;
    }, 550);
  }

  /** Shared DOM setup for intro/loading pages */
  function initSharedPage() {
    initCursorGlow();
    initFloatingEmojis();
    return loadConfetti();
  }

  window.BirthdayISpy = {
    loadConfetti,
    fireConfetti,
    fireGrandConfetti,
    initCursorGlow,
    initFloatingEmojis,
    navigateWithFade,
    initSharedPage,
  };
})();
