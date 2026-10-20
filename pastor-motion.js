import { animateMini, inView, scroll } from 'framer-motion/dom';

// Progressive enhancement: the complete speaker section is visible without JS.
const section = document.querySelector('[data-pastor-feature]');
if (section && Element.prototype.animate) {
  const ease = [0.22, 1, 0.36, 1];
  const stage = section.querySelector('.pastor-stage');
  const float = section.querySelector('.pastor-portrait__float');
  const card = section.querySelector('.pastor-card');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let tiltAnimation;
  let pointerFrame = 0;
  let nextTilt = { x: 0, y: 0 };

  inView(section.querySelectorAll('[data-pastor-reveal]'), element => {
    animateMini(element, {
      opacity: [0, 1],
      transform: ['translateY(28px)', 'translateY(0)']
    }, { duration: 0.8, ease });
  }, { amount: 0.15 });

  // A small scroll-linked movement also gives touch screens the portrait effect.
  scroll(animateMini(float, {
    transform: [
      'translateY(14px) rotate(-1.6deg)',
      'translateY(-14px) rotate(1.2deg)'
    ]
  }, { duration: 1, ease: 'linear' }), {
    target: stage,
    offset: ['start end', 'end start']
  });

  function tilt(x, y) {
    tiltAnimation?.stop();
    tiltAnimation = animateMini(card, {
      transform: `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg)`
    }, { duration: 0.45, ease });
  }

  float.addEventListener('pointermove', event => {
    if (!pointer.matches || event.pointerType !== 'mouse') return;
    const rect = float.getBoundingClientRect();
    nextTilt = {
      x: Math.max(-3, Math.min(3, (0.5 - (event.clientY - rect.top) / rect.height) * 6)),
      y: Math.max(-3, Math.min(3, ((event.clientX - rect.left) / rect.width - 0.5) * 6))
    };
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      tilt(nextTilt.x, nextTilt.y);
    });
  });

  function resetTilt() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    tilt(0, 0);
  }
  float.addEventListener('pointerleave', resetTilt);
  float.addEventListener('pointercancel', resetTilt);
  pointer.addEventListener('change', resetTilt);
}
