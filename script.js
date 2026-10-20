/* ============================================================
   SER Y HACER IGLESIA — Interacciones
   ============================================================ */

(() => {
  "use strict";

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const indicator = nav?.querySelector(".nav__indicator");
  const links = nav ? [...nav.querySelectorAll(".nav__link")] : [];
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = mobileMenu ? [...mobileMenu.querySelectorAll("a")] : [];

  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

  /* ---------- 1. Header con estado al hacer scroll ---------- */
  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Indicador de nav que se desliza (estilo Framer) ---------- */
  const moveIndicator = (link) => {
    if (!indicator || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.height = `${rect.height}px`;
    indicator.style.transform = `translateX(${rect.left - navRect.left}px)`;
  };

  const activateLink = (link) => {
    if (!nav) return;
    nav.classList.add("is-hovering");
    links.forEach((l) => l.classList.remove("is-active"));
    link.classList.add("is-active");
    moveIndicator(link);
  };

  const resetIndicator = () => {
    if (!nav) return;
    nav.classList.remove("is-hovering");
    // Mantener activo el enlace de la sección visible
    const active = links.find((l) => l.classList.contains("is-current")) || null;
    links.forEach((l) => l.classList.toggle("is-active", l === active));
    if (active) moveIndicator(active);
    else if (indicator) indicator.style.opacity = "0";
  };

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => activateLink(link));
  });

  nav?.addEventListener("mouseleave", resetIndicator);

  window.addEventListener("resize", () => {
    const current = links.find((l) => l.classList.contains("is-active"));
    if (current) moveIndicator(current);
  });

  /* ---------- 3. Resaltar sección visible en el scroll ---------- */
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = links.find(
            (l) => l.getAttribute("href") === `#${entry.target.id}`
          );
          if (!link) return;
          links.forEach((l) => {
            l.classList.remove("is-current");
            l.classList.remove("is-active");
          });
          link.classList.add("is-current");
          if (!nav.classList.contains("is-hovering")) {
            link.classList.add("is-active");
            moveIndicator(link);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- 4. Detección de puntero fino ---------- */
  const fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- 5. Menú móvil ---------- */
  const setMenu = (open) => {
    menuToggle?.classList.toggle("is-open", open);
    mobileMenu?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mobileMenu?.setAttribute("aria-hidden", String(!open));
  };

  menuToggle?.addEventListener("click", () => {
    setMenu(!mobileMenu.classList.contains("is-open"));
  });

  mobileLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- 6. Sincronizar las dos capas de video ----------
     La capa con blur y la capa nítida deben reproducirse idénticas
     para que la máscara no muestre costuras. */
  const heroVideos = [...document.querySelectorAll(".hero__bg, .hero__bg-blur video")];
  if (heroVideos.length > 1) {
    const [main, ...rest] = heroVideos;

    const syncVideos = () => {
      rest.forEach((v) => {
        // Si el desfase supera un umbral perceptible, reajusta
        if (Math.abs(v.currentTime - main.currentTime) > 0.06) {
          try { v.currentTime = main.currentTime; } catch (_) {}
        }
        // Igualar estado de reproducción
        if (main.paused && !v.paused) v.pause();
        if (!main.paused && v.paused) v.play().catch(() => {});
      });
    };

    // El video principal marca el ritmo; el secundario lo sigue
    main.addEventListener("play", syncVideos);
    main.addEventListener("seeked", syncVideos);
    main.addEventListener("timeupdate", syncVideos);
    main.addEventListener("playing", syncVideos);

    // Si el blur queda pausado por el navegador, arrancarlo
    rest.forEach((v) => {
      v.addEventListener("loadeddata", () => {
        try { v.currentTime = main.currentTime; } catch (_) {}
        v.play().catch(() => {});
      });
    });
  }

  /* ---------- 7. Formulario liquid glass en el hero ----------
     Al confirmar asistencia: los dos botones salen y el formulario entra.
     Al volver: el formulario se recoge y los botones regresan. */
  const openBtn = document.getElementById("openForm");
  const closeBtn = document.getElementById("closeForm");
  const heroActions = document.getElementById("heroActions");
  const glassForm = document.getElementById("registroForm");

  const setForm = (open) => {
    if (!glassForm || !heroActions) return;

    if (open) {
      // 1. Los botones salen con un fundido + desenfoque
      heroActions.classList.add("is-leaving");

      // 2. Cuando ya casi salieron, ocultamos los botones y mostramos el formulario
      window.setTimeout(() => {
        heroActions.hidden = true;

        glassForm.setAttribute("aria-hidden", "false");
        glassForm.dataset.open = "true";
        openBtn?.setAttribute("aria-expanded", "true");

        // Medimos el contenido real del formulario (no el elemento recortado).
        // Los hijos directos suman la altura natural: cabecera + rejilla + pie.
        const natural = [...glassForm.children].reduce(
          (sum, el) => sum + el.getBoundingClientRect().height,
          0
        );
        const target = Math.ceil(natural + 64); // + padding superior/inferior

        // Estado inicial reproducible: sin clase y altura 0, forzamos recálculo.
        void glassForm.offsetHeight;
        glassForm.style.maxHeight = "0px";

        // Siguiente frame: arrancamos la transición hacia la altura medida.
        requestAnimationFrame(() => {
          glassForm.classList.add("is-open");
          glassForm.style.maxHeight = target + "px";
        });

        // Al terminar la entrada, liberamos la restricción de altura para que
        // nunca se recorte (p. ej. mensajes de error de validación).
        glassForm.addEventListener("transitionend", function onOpen(ev) {
          if (ev.propertyName !== "max-height" || !glassForm.classList.contains("is-open")) return;
          glassForm.style.maxHeight = "none";
          glassForm.removeEventListener("transitionend", onOpen);
        });

        // 3. Llevamos el foco al primer campo (buena accesibilidad)
        window.setTimeout(() => {
          glassForm.querySelector(".field__input")?.focus({ preventScroll: true });
        }, 520);
      }, 420);
    } else {
      // 1. El formulario se recoge
      glassForm.setAttribute("aria-hidden", "true");
      glassForm.dataset.open = "false";
      openBtn?.setAttribute("aria-expanded", "false");

      // Si quedó liberado en "none", fijamos primero la altura actual real
      // para que la transición hacia 0 sea visible.
      if (getComputedStyle(glassForm).maxHeight === "none") {
        glassForm.style.maxHeight = glassForm.getBoundingClientRect().height + "px";
        void glassForm.offsetHeight;
      }
      glassForm.classList.remove("is-open");
      glassForm.style.maxHeight = "0px";

      // 2. Los botones vuelven, ya recogido el formulario
      window.setTimeout(() => {
        heroActions.hidden = false;
        void heroActions.offsetHeight;
        heroActions.classList.remove("is-leaving");
        openBtn?.focus({ preventScroll: true });
      }, 420);
    }
  };

  openBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    setForm(true);
  });

  closeBtn?.addEventListener("click", () => setForm(false));

  // Esc cierra el formulario
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && glassForm?.dataset.open === "true") setForm(false);
  });

  /* ---------- 7b. Contador de acompañantes (− / +) ---------- */
  const stepper = glassForm?.querySelector(".stepper");
  if (stepper) {
    const input = stepper.querySelector(".stepper__input");
    const dec = stepper.querySelector('[data-step="-1"]');
    const inc = stepper.querySelector('[data-step="1"]');

    const clampVal = () => {
      const min = Number(input.min) || 0;
      const max = Number(input.max) || 20;
      const v = Math.round(Number(input.value));
      const safe = Number.isFinite(v) ? Math.min(Math.max(v, min), max) : min;
      input.value = String(safe);
      dec.disabled = safe <= min;
      inc.disabled = safe >= max;
      return safe;
    };

    const bump = (delta) => {
      const min = Number(input.min) || 0;
      const max = Number(input.max) || 20;
      const next = Math.min(Math.max(clampVal() + delta, min), max);
      input.value = String(next);
      clampVal();
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    dec.addEventListener("click", () => bump(-1));
    inc.addEventListener("click", () => bump(1));
    input.addEventListener("input", clampVal);
    input.addEventListener("blur", clampVal);
    clampVal();
  }

  // Envío: validación mínima + estado de éxito (sin backend todavía)
  glassForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!glassForm.checkValidity()) {
      glassForm.reportValidity();
      return;
    }
    const label = glassForm.querySelector(".neu-btn__label");
    if (label) label.textContent = "¡Tu lugar quedó guardado!";
    const foot = glassForm.querySelector(".glass-form__foot");
    foot?.classList.add("is-success");
  });

  /* ---------- 8. Entrada del header al cargar ---------- */
  document.body.classList.add("is-ready");
})();
