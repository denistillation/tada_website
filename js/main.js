(() => {
  document.documentElement.classList.add("js");

  // --- Mobile menu ---
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-links");

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("open", !expanded);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!menu.classList.contains("open")) return;
      if (!event.target.closest(".site-header")) closeMenu();
    });
  }

  // --- Scrollspy: highlight the nav link for the section in view ---
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        if (link.hash === "#" + id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );

    sections.forEach((section) => spy.observe(section));
  }

  // --- Reveal on scroll ---
  const revealEls = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // --- Submission deadline countdown ---
  const status = document.getElementById("deadline-status");
  if (status) {
    // End of August 1, 2026, anywhere on Earth (UTC-12)
    const deadline = Date.UTC(2026, 7, 2, 11, 59, 59);
    const msLeft = deadline - Date.now();
    const daysLeft = Math.ceil(msLeft / 86400000);

    if (msLeft <= 0) {
      status.textContent = "Submissions closed";
    } else if (daysLeft <= 1) {
      status.textContent = "Submissions close today";
    } else {
      status.textContent = "Submissions open · " + daysLeft + " days left";
    }
  }
})();
