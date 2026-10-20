(() => {
  'use strict';
  const showcase = document.querySelector('[data-event-showcase]');
  if (!showcase) return;

  const days = [...showcase.querySelectorAll('[data-event-day]')];
  const links = [...showcase.querySelectorAll('[data-day-link]')];
  const visuals = [...showcase.querySelectorAll('[data-day-visual]')];
  const tracks = links.map(link => link.querySelector('.event-day-nav__track > span'));
  const preview = showcase.querySelector('.event-showcase__images');
  const navigation = showcase.querySelector('.event-showcase__preview');
  const mobile = window.matchMedia('(max-width: 900px)');
  let scheduled = false;
  let activeDay = -1;

  const middle = element => {
    const rect = element.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };
  const anchor = () => mobile.matches ? window.innerHeight * .5 : middle(preview);

  function update() {
    scheduled = false;
    const point = anchor();
    const centers = days.map(day => middle(mobile.matches ? day : day.querySelector('.event-day__copy')));
    const edges = [
      centers[0] - (centers[1] - centers[0]) / 2,
      (centers[0] + centers[1]) / 2,
      (centers[1] + centers[2]) / 2,
      centers[2] + (centers[2] - centers[1]) / 2
    ];
    const next = point < edges[1] ? 0 : point < edges[2] ? 1 : 2;
    if (next !== activeDay) {
      activeDay = next;
      days.forEach((day, i) => day.classList.toggle('is-active', i === next));
      visuals.forEach((visual, i) => visual.classList.toggle('is-active', i === next));
      links.forEach((link, i) => {
        if (i === next) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
    }
    tracks.forEach((track, i) => {
      const progress = Math.min(1, Math.max(0, (point - edges[i]) / (edges[i + 1] - edges[i])));
      track.style.transform = `scaleX(${progress.toFixed(4)})`;
    });
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  links.forEach((link, index) => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const day = days[index];
      // On desktop, align the reading block with the center of the sticky image.
      // On mobile, keep its photo and heading below the compact day navigation.
      const offset = mobile.matches
        ? day.getBoundingClientRect().top - navigation.offsetHeight - 12
        : middle(day.querySelector('.event-day__copy')) - anchor();
      window.scrollTo({ top: window.scrollY + offset, behavior: 'smooth' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
    link.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % links.length;
      if (event.key === 'ArrowLeft') next = (index + links.length - 1) % links.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = links.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      links[next].focus({ preventScroll: true });
      links[next].click();
    });
  });

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(showcase);
  document.fonts.ready.then(scheduleUpdate);
  update();
})();
