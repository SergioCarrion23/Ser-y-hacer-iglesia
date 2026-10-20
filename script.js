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

  /* ---------- 4. Botones: relleno radial + magnético suave ---------- */
  const fine = window.matchMedia("(pointer: fine)").matches;

  if (fine) {
    const buttons = [...document.querySelectorAll(".btn")];

    buttons.forEach((el) => {
      // Sigue el cursor con el relleno radial (--mx / --my)
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });

    // Botones magnéticos: se desplazan suavemente hacia el cursor
    const magnetics = [...document.querySelectorAll("[data-magnetic]")];
    const strength = 0.22;

    magnetics.forEach((el) => {
      let raf = null;

      el.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          el.style.transition = "transform 0.25s var(--ease)";
          el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
          raf = null;
        });
      });

      el.addEventListener("pointerleave", () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        el.style.transition = "transform 0.9s var(--ease)";
        el.style.transform = "translate(0, 0)";
      });
    });
  }

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

  /* ---------- 6. Entrada del header al cargar ---------- */
  document.body.classList.add("is-ready");
})();
