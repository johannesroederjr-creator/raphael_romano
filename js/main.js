(() => {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  const toast = document.getElementById("toast");

  /* ---------- Navigation ---------- */
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    burger.classList.toggle("is-open", open);
    navLinks.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Toast ---------- */
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
  };

  document.querySelectorAll("[data-placeholder]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(el.dataset.placeholder);
    })
  );

  /* ---------- Reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Zähler ---------- */
  const formatNumber = (n) => n.toLocaleString("de-DE");
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNumber(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Video ---------- */
  const video = document.getElementById("liveVideo");
  const videoPlay = document.getElementById("videoPlay");
  const videoCard = video.closest(".video-card");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const videoObserver = new IntersectionObserver(
    ([entry]) => {
      if (videoCard.classList.contains("is-playing")) {
        if (!entry.isIntersecting) video.pause();
        return;
      }
      if (entry.isIntersecting && !reducedMotion) video.play().catch(() => {});
      else video.pause();
    },
    { threshold: 0.35 }
  );
  videoObserver.observe(video);

  videoPlay.addEventListener("click", () => {
    videoCard.classList.add("is-playing");
    video.muted = false;
    video.loop = false;
    video.currentTime = 0;
    video.controls = true;
    video.play();
  });
  video.addEventListener("ended", () => {
    videoCard.classList.remove("is-playing");
    video.controls = false;
    video.muted = true;
    video.loop = true;
    video.play().catch(() => {});
  });

  /* ---------- Kontaktformular (nur Ansicht) ---------- */
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Danke! Dies ist ein Entwurf – das Formular versendet noch keine Nachrichten.");
  });
})();
