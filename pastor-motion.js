import { animateMini, inView, scroll } from 'framer-motion/dom';

// Progressive enhancement: the original photograph remains visible without JS.
const section = document.querySelector('[data-pastor-feature]');
if (section && Element.prototype.animate) {
  const ease = [0.22, 1, 0.36, 1];
  const stage = section.querySelector('.pastor-stage');
  const portrait = section.querySelector('.pastor-portrait');
  const float = section.querySelector('.pastor-portrait__float');
  const card = section.querySelector('.pastor-card');
  const photo = section.querySelector('.pastor-card__image');
  const caption = card.querySelector('figcaption');
  const reflection = section.querySelector('.pastor-card__reflection');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  inView(section.querySelectorAll('[data-pastor-reveal]'), element => {
    animateMini(element, {
      opacity: [0, 1],
      transform: ['translateY(28px)', 'translateY(0)']
    }, { duration: 0.8, ease });
  }, { amount: 0.15 });

  // Scroll supplies depth on phones without device-motion permission or scroll capture.
  scroll(animateMini(float, {
    transform: [
      'perspective(1100px) translateY(12px) rotateX(5deg) rotateY(-3deg) scale(.98)',
      'perspective(1100px) translateY(0px) rotateX(0deg) rotateY(0deg) scale(1.025)',
      'perspective(1100px) translateY(-12px) rotateX(-5deg) rotateY(3deg) scale(.99)'
    ]
  }, { duration: 1, ease: 'linear' }), {
    target: stage,
    offset: ['start end', 'end start']
  });

  let frame = 0;
  let previousTime = 0;
  let visible = false;
  const current = { x: 0, y: 0, lift: 0 };
  const target = { x: 0, y: 0, lift: 0 };

  function paint() {
    const { x, y, lift } = current;
    // Frame, image, caption and reflection move at different depths.
    card.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 7}deg) scale(${1 + lift * .035})`;
    photo.style.transform = `translate3d(${-x * 8}px,${-y * 7}px,0) scale(${1.025 + lift * .035})`;
    caption.style.transform = `translate3d(${x * 4}px,${y * 3}px,18px)`;
    reflection.style.transform = `translate3d(${x * 16}%,${y * 12}%,0)`;
    reflection.style.opacity = String(.1 + lift * .28);
  }

  function tick(time) {
    const elapsed = previousTime ? Math.min(time - previousTime, 48) : 16;
    previousTime = time;
    const blend = 1 - Math.exp(-elapsed / 95);
    let unsettled = false;
    for (const key of Object.keys(current)) {
      current[key] += (target[key] - current[key]) * blend;
      if (Math.abs(target[key] - current[key]) > .001) unsettled = true;
      else current[key] = target[key];
    }
    paint();
    if (unsettled && visible && !document.hidden) frame = requestAnimationFrame(tick);
    else { frame = 0; previousTime = 0; }
  }

  function move(x, y, lift) {
    Object.assign(target, { x, y, lift });
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function reset() { move(0, 0, 0); }
  function aim(event) {
    const rect = portrait.getBoundingClientRect();
    const clamp = value => Math.max(-1, Math.min(1, value));
    move(clamp(((event.clientX - rect.left) / rect.width - .5) * 2),
      clamp(((event.clientY - rect.top) / rect.height - .5) * 2), 1);
  }

  inView(stage, () => {
    visible = true;
    return () => {
      visible = false;
      cancelAnimationFrame(frame);
      frame = previousTime = 0;
      Object.assign(current, { x: 0, y: 0, lift: 0 });
      Object.assign(target, current);
      paint();
    };
  });
  card.addEventListener('pointermove', event => {
    if (finePointer.matches && event.pointerType === 'mouse') aim(event);
  });
  card.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') aim(event);
  }, { passive: true });
  card.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') reset(); });
  card.addEventListener('pointerleave', reset);
  card.addEventListener('pointercancel', reset);
  card.addEventListener('focus', () => move(.25, -.2, 1));
  card.addEventListener('blur', reset);
  finePointer.addEventListener('change', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = previousTime = 0;
      Object.assign(current, { x: 0, y: 0, lift: 0 });
      Object.assign(target, current);
      paint();
    }
  });
}
