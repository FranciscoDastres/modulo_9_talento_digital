import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
let media = gsap.matchMedia();
const toggle = document.querySelector<HTMLButtonElement>("#motion-toggle");
if (toggle) toggle.hidden = false;
const systemMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let userPaused = false;
try {
  userPaused = localStorage.getItem("portfolio-motion-paused") === "true";
} catch {
  /* Storage is optional. */
}

function updateControl() {
  const paused = userPaused || systemMotion.matches;
  if (toggle) toggle.disabled = systemMotion.matches;
  document.body.classList.toggle("motion-paused", paused);
  toggle?.setAttribute("aria-pressed", String(paused));
  toggle?.setAttribute(
    "aria-label",
    systemMotion.matches
      ? "Movimiento reducido por la configuración del sistema"
      : paused
        ? "Activar animaciones"
        : "Pausar animaciones",
  );
  const label = toggle?.querySelector("span");
  if (label)
    label.textContent = systemMotion.matches
      ? "Movimiento reducido del sistema"
      : paused
        ? "Animaciones pausadas"
        : "Animaciones activas";
  toggle
    ?.querySelector("path")
    ?.setAttribute("d", paused ? "M5 3l7 5-7 5z" : "M5 3v10M11 3v10");
}

function startMotion() {
  media.revert();
  media = gsap.matchMedia();
  updateControl();
  document.body.dataset.motion = "paused";
  if (userPaused) return;
  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 901px)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      if (context.conditions?.reduced) return;
      document.body.dataset.motion = "active";
      const events = new AbortController();
      const signal = events.signal;
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 1.1 } })
        .from(".title-line > span", { yPercent: 110, stagger: 0.12 })
        .from(
          ".hero-role, .hero-description, .hero-content .button",
          { y: 22, opacity: 0, stagger: 0.09, duration: 0.8 },
          "-=.65",
        );
      const cover = gsap.to(".hero-backdrop img", {
        xPercent: 1.3,
        scale: 1.08,
        duration: 9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      const logo = gsap.to(".stack-orbit img", {
        y: -9,
        rotation: 3,
        duration: 3.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      const ambients = [
        { tween: cover, trigger: ".hero-cover" },
        { tween: logo, trigger: ".stack-section" },
      ].map((item) => {
        const visibility = ScrollTrigger.create({
          trigger: item.trigger,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) =>
            self.isActive && !document.hidden
              ? item.tween.resume()
              : item.tween.pause(),
        });
        if (!visibility.isActive) item.tween.pause();
        return { ...item, visibility };
      });
      document.addEventListener(
        "visibilitychange",
        () =>
          ambients.forEach((item) =>
            item.visibility.isActive && !document.hidden
              ? item.tween.resume()
              : item.tween.pause(),
          ),
        { signal },
      );
      if (context.conditions?.desktop)
        gsap.to(".hero-backdrop", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-cover",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      gsap.utils
        .toArray<HTMLElement>(
          ".section-heading h2, .about-section h2, .music-copy h2, .contact-grid h2",
        )
        .forEach((heading) =>
          gsap.from(heading, {
            y: 22,
            opacity: 0.4,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: heading, start: "top 92%", once: true },
          }),
        );
      gsap.from(".stack-card", {
        y: 18,
        opacity: 0.35,
        duration: 0.65,
        stagger: 0.055,
        scrollTrigger: { trigger: ".stack-grid", start: "top 90%", once: true },
      });
      document.fonts.ready.then(() => {
        if (!signal.aborted) ScrollTrigger.refresh();
      });
      return () => {
        events.abort();
        document.body.dataset.motion = "paused";
      };
    },
  );
}

toggle?.addEventListener("click", () => {
  // The OS preference remains authoritative; the button still records the user's choice.
  userPaused = !(userPaused || systemMotion.matches);
  try {
    localStorage.setItem("portfolio-motion-paused", String(userPaused));
  } catch {
    /* Storage is optional. */
  }
  startMotion();
});
systemMotion.addEventListener("change", startMotion);
window.addEventListener("pagehide", () => media.revert());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) startMotion();
});
startMotion();
