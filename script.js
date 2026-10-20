(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const indicator = document.querySelector('.nav__indicator');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const main = document.querySelector('main');
  const desktop = window.matchMedia('(min-width: 1081px)');

  function moveIndicator(link) {
    const navRect = nav.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.height = `${rect.height}px`;
    indicator.style.transform = `translateX(${rect.left - navRect.left}px)`;
    nav.classList.add('is-hovering');
  }
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
    link.addEventListener('focus', () => moveIndicator(link));
  });
  nav.addEventListener('mouseleave', () => nav.classList.remove('is-hovering'));
  nav.addEventListener('focusout', event => {
    if (!nav.contains(event.relatedTarget)) nav.classList.remove('is-hovering');
  });

  function setMenu(open, restoreFocus = false) {
    menuButton.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileMenu.setAttribute('aria-hidden', String(!open));
    mobileMenu.inert = !open;
    main.inert = open;
    if (restoreFocus) menuButton.focus();
  }
  setMenu(false);
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false, true)));
  desktop.addEventListener('change', event => { if (event.matches) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') setMenu(false, true);
    if (event.key === 'Tab') {
      const focusables = [...header.querySelectorAll('a,button')].filter(element => element.offsetParent !== null && !element.closest('[inert]'));
      const first = focusables[0];
      const last = focusables.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  const video = document.querySelector('.hero__bg');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncVideo() {
    if (reducedMotion.matches || document.hidden) video.pause();
    else video.play().catch(() => {});
  }
  video.muted = true;
  syncVideo();
  video.addEventListener('loadeddata', syncVideo);
  reducedMotion.addEventListener('change', syncVideo);
  document.addEventListener('visibilitychange', syncVideo);

  /* Inline RSVP: merge the actual hero actions, then expand their glass surface. */
  const hero = document.querySelector('.hero');
  const heroIntro = document.querySelector('.hero__intro');
  const heroActions = document.querySelector('.hero__actions');
  const actionButtons = [...heroActions.querySelectorAll('.wave-btn')];
  const rsvpPanel = document.querySelector('.rsvp-panel');
  const glassShell = document.querySelector('.glass-shell');
  const panelContent = document.querySelector('.rsvp-panel__content');
  const rsvpTriggers = [...document.querySelectorAll('[data-open-rsvp]')];
  const rsvpForm = document.querySelector('#rsvp-form');
  const editView = document.querySelector('.rsvp-edit');
  const reviewView = document.querySelector('.rsvp-review');
  let rsvpState = 'closed';
  let returnTo = null;
  let closeAfterOpening = false;
  let viewChanging = false;
  const motionOff = () => reducedMotion.matches || !Element.prototype.animate;
  const center = rect => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  const animate = (element, frames, options) => {
    const animation = element.animate(frames, { fill: 'both', easing: 'cubic-bezier(.22,1,.36,1)', ...options });
    return animation;
  };
  const finish = animations => Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  const clearAnimations = animations => animations.forEach(animation => animation.cancel());
  function setRsvpLayout(open) {
    hero.classList.toggle('is-registering', open);
    heroIntro.hidden = open;
    heroActions.hidden = open;
    rsvpPanel.hidden = !open;
    rsvpTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', String(open)));
  }
  function focusForm() {
    const target = reviewView.hidden ? document.querySelector('#rsvp-title') : document.querySelector('#review-title');
    const rect = rsvpPanel.getBoundingClientRect();
    if (rect.top < 12 || rect.top > window.innerHeight / 2) rsvpPanel.scrollIntoView({ block: 'start', behavior: 'instant' });
    target.focus({ preventScroll: true });
  }

  async function openRsvp(trigger) {
    if (rsvpState !== 'closed') {
      if (rsvpState === 'open') focusForm();
      return;
    }
    rsvpState = 'opening';
    returnTo = trigger;
    closeAfterOpening = false;
    if (menuButton.getAttribute('aria-expanded') === 'true') setMenu(false);
    const actionsRect = heroActions.getBoundingClientRect();
    if (actionsRect.top < 0 || actionsRect.bottom > window.innerHeight) heroActions.scrollIntoView({ block: 'center', behavior: 'instant' });
    hero.classList.add('has-rsvp-interaction');
    heroActions.inert = true;
    rsvpTriggers.forEach(button => button.setAttribute('aria-expanded', 'true'));

    if (!motionOff()) {
      const rects = actionButtons.map(button => button.getBoundingClientRect());
      const target = center(heroActions.getBoundingClientRect());
      const fusion = document.createElement('div');
      fusion.className = 'liquid-fusion-layer';
      fusion.setAttribute('aria-hidden', 'true');
      const bounds = {
        left: Math.min(...rects.map(rect => rect.left)) - 24,
        top: Math.min(...rects.map(rect => rect.top)) - 24,
        right: Math.max(...rects.map(rect => rect.right)) + 24,
        bottom: Math.max(...rects.map(rect => rect.bottom)) + 24
      };
      Object.assign(fusion.style, { inset: 'auto', left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.right - bounds.left}px`, height: `${bounds.bottom - bounds.top}px` });
      document.body.append(fusion);
      const introExit = animate(heroIntro, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 140 });
      const outgoing = [
        introExit,
        animate(heroActions, [{ opacity: 1 }, { opacity: 0 }], { duration: 110 })
      ];
      rects.forEach(rect => {
        const blob = document.createElement('div');
        blob.className = 'liquid-blob';
        Object.assign(blob.style, { left: `${rect.left - bounds.left}px`, top: `${rect.top - bounds.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
        fusion.append(blob);
        const origin = center(rect);
        outgoing.push(animate(blob, [
          { transform: 'translate(0,0) scale(1)', opacity: 0 },
          { transform: 'translate(0,0) scale(1)', opacity: .9, offset: .12 },
          { transform: `translate(${target.x - origin.x}px,${target.y - origin.y}px) scale(.96,1.05)`, opacity: .9 }
        ], { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)' }));
      });
      // Grow the glass while the buttons are still merging, on one overlapping timeline.
      await finish([introExit]);
      setRsvpLayout(true);
      const panelRect = rsvpPanel.getBoundingClientRect();
      const destination = center(panelRect);
      const originTransform = `translate(${target.x - destination.x}px,${target.y - destination.y}px) scale(${Math.min(245, panelRect.width * .8) / panelRect.width},${58 / panelRect.height})`;
      const incoming = [
        animate(glassShell, [{ transform: originTransform, borderRadius: '180px', opacity: .3 }, { transform: 'translate(0,0) scale(1)', borderRadius: window.innerWidth <= 700 ? '24px' : '30px', opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.22,.8,.24,1)' }),
        animate(panelContent, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, delay: 150 }),
        animate(fusion, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 })
      ];
      await finish(incoming);
      fusion.remove();
      clearAnimations(outgoing);
      clearAnimations(incoming);
    } else {
      setRsvpLayout(true);
    }
    heroActions.inert = false;
    rsvpState = 'open';
    if (closeAfterOpening) closeRsvp();
    else focusForm();
  }

  async function closeRsvp() {
    if (rsvpState === 'opening') { closeAfterOpening = true; return; }
    if (rsvpState !== 'open') return;
    rsvpState = 'closing';
    const panelRect = rsvpPanel.getBoundingClientRect();
    const origin = center(panelRect);
    const clone = motionOff() ? null : glassShell.cloneNode(true);
    if (clone) {
      clone.classList.add('glass-return');
      Object.assign(clone.style, { left: `${panelRect.left}px`, top: `${panelRect.top}px`, width: `${panelRect.width}px`, height: `${panelRect.height}px` });
      const fade = animate(panelContent, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(4px)' }], { duration: 80 });
      await finish([fade]);
      clearAnimations([fade]);
      document.body.append(clone);
    }
    setRsvpLayout(false);
    if (clone) {
      const target = center(heroActions.getBoundingClientRect());
      const returning = [
        animate(clone, [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${target.x - origin.x}px,${target.y - origin.y}px) scale(${245 / panelRect.width},${56 / panelRect.height})`, opacity: 0, borderRadius: '180px' }
        ], { duration: 340 }),
        animate(heroIntro, [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, delay: 80 }),
        animate(heroActions, [{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 200 })
      ];
      actionButtons.forEach(button => {
        const destination = center(button.getBoundingClientRect());
        returning.push(animate(button, [{ transform: `translate(${target.x - destination.x}px,${target.y - destination.y}px) scale(.96)`, opacity: 0 }, { transform: 'translate(0,0) scale(1)', opacity: 1 }], { duration: 220, delay: 200 }));
      });
      await finish(returning);
      clone.remove();
      clearAnimations(returning);
    }
    rsvpState = 'closed';
    if (returnTo && returnTo.offsetParent !== null && !returnTo.closest('[inert]')) returnTo.focus({ preventScroll: true });
    else heroActions.querySelector('[data-open-rsvp]').focus({ preventScroll: true });
  }

  rsvpTriggers.forEach(trigger => trigger.addEventListener('click', () => openRsvp(trigger)));
  document.querySelectorAll('[data-close-rsvp]').forEach(button => button.addEventListener('click', closeRsvp));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && (rsvpState === 'open' || rsvpState === 'opening')) { event.preventDefault(); closeRsvp(); }
  });

  const companions = document.querySelector('.companion-details');
  const countInput = document.querySelector('#rsvp-count');
  const minusButton = document.querySelector('[data-count-step="-1"]');
  const accompanied = () => rsvpForm.elements.accompanied.value === 'yes';
  function updateParty() {
    const yes = accompanied();
    companions.classList.toggle('is-expanded', yes);
    companions.setAttribute('aria-hidden', String(!yes));
    companions.inert = !yes;
    companions.querySelectorAll('input,button').forEach(element => { element.disabled = !yes; });
    countInput.required = yes;
    minusButton.disabled = !yes || Number(countInput.value) <= 1;
    if (!yes) { countInput.removeAttribute('aria-invalid'); document.querySelector('#count-error').hidden = true; }
  }
  rsvpForm.querySelectorAll('[name="accompanied"]').forEach(input => input.addEventListener('change', updateParty));
  document.querySelectorAll('[data-count-step]').forEach(button => button.addEventListener('click', () => {
    const current = Number(countInput.value);
    countInput.value = Math.max(1, (Number.isSafeInteger(current) ? current : 1) + Number(button.dataset.countStep));
    validateField(countInput);
    updateParty();
  }));
  countInput.addEventListener('input', () => { minusButton.disabled = !accompanied() || Number(countInput.value) <= 1; });

  const fields = ['name', 'email', 'phone', 'count'].map(key => document.querySelector(`#rsvp-${key}`));
  function validateField(field) {
    if (field.disabled) return true;
    let error = '';
    const value = field.value.trim();
    if (field.id === 'rsvp-name' && value.length < 2) error = 'Escribe tu nombre completo.';
    if (field.id === 'rsvp-email' && (!value || field.validity.typeMismatch)) error = 'Escribe un correo electrónico válido.';
    if (field.id === 'rsvp-phone' && (!/^[\d\s().-]+$/.test(value) || !/^(?:09\d{8}|0[2-7]\d{7})$/.test(value.replace(/\D/g, '')))) error = 'Escribe un número local válido, como 099 123 4567.';
    if (field.id === 'rsvp-count' && (!Number.isSafeInteger(Number(value)) || Number(value) < 1)) error = 'Indica al menos un acompañante.';
    const message = document.getElementById(field.getAttribute('aria-describedby'));
    message.textContent = error;
    message.hidden = !error;
    if (error) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return !error;
  }
  fields.forEach(field => {
    field.addEventListener('blur', () => { if (field.value || field.getAttribute('aria-invalid')) validateField(field); });
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid')) validateField(field); });
  });

  async function switchRsvpView(review) {
    if (viewChanging || rsvpState !== 'open') return;
    viewChanging = true;
    const from = review ? editView : reviewView;
    const to = review ? reviewView : editView;
    if (!motionOff()) {
      const out = animate(from, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 100 });
      await finish([out]);
      clearAnimations([out]);
    }
    from.hidden = true;
    to.hidden = false;
    rsvpPanel.setAttribute('aria-labelledby', review ? 'review-title' : 'rsvp-title');
    if (!motionOff()) {
      const incoming = animate(to, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220 });
      await finish([incoming]);
      clearAnimations([incoming]);
    }
    viewChanging = false;
    if (rsvpState === 'open') (review ? document.querySelector('#review-title') : document.querySelector('#rsvp-name')).focus({ preventScroll: true });
  }
  rsvpForm.addEventListener('submit', event => {
    event.preventDefault();
    if (rsvpState !== 'open') return;
    fields.forEach(field => { if (field.type !== 'number') field.value = field.value.trim(); });
    const invalidFields = fields.filter(field => !validateField(field));
    if (invalidFields.length) { invalidFields[0].focus(); return; }
    const data = {
      name: rsvpForm.elements.name.value,
      email: rsvpForm.elements.email.value,
      phone: rsvpForm.elements.phone.value,
      party: accompanied() ? `Tú + ${countInput.value} ${Number(countInput.value) === 1 ? 'acompañante' : 'acompañantes'}` : 'Solo tú'
    };
    Object.entries(data).forEach(([key, value]) => { document.querySelector(`[data-review="${key}"]`).textContent = value; });
    // Preview only: no endpoint, network request, persistent storage, or confirmation claim.
    switchRsvpView(true);
  });
  document.querySelector('[data-edit-rsvp]').addEventListener('click', () => switchRsvpView(false));
  rsvpForm.querySelector('[type="submit"]').disabled = false;
  updateParty();
})();
