import EmblaCarousel from "embla-carousel";
import { gsap } from "gsap";
const root = document.querySelector<HTMLElement>(".project-showcase")!;
const viewport = root.querySelector<HTMLElement>(".carousel-viewport")!;
const controls = root.querySelector<HTMLElement>(".carousel-controls")!;
const thumbs = Array.from(
  root.querySelectorAll<HTMLButtonElement>("[data-slide]"),
);
const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-panel]"));
const slides = Array.from(
  root.querySelectorAll<HTMLElement>(".carousel-slide"),
);
const screens = slides.map(
  (slide) => slide.querySelector<HTMLElement>(".project-screen")!,
);
let activeIndex = -1;
const play = root.querySelector<HTMLButtonElement>(".carousel-play")!;
const announcement = root.querySelector<HTMLElement>(".carousel-announcement")!;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
function pausedMotion() {
  return reduced.matches || document.body.classList.contains("motion-paused");
}
// Layout must be horizontal before Embla measures slide positions.
root.classList.add("carousel-enhanced");
controls.hidden = false;
const carousel = EmblaCarousel(viewport, {
  loop: true,
  duration: pausedMotion() ? 0 : 22,
});
let playing = true,
  visible = false,
  dragging = false,
  keyboardFocused = false,
  lastPaused = pausedMotion();
let timer: ReturnType<typeof setTimeout> | undefined;
function schedule() {
  clearTimeout(timer);
  const enabled = playing && !pausedMotion();
  play.setAttribute("aria-pressed", String(enabled));
  play.setAttribute(
    "aria-label",
    enabled
      ? "Pausar cambio automático de proyectos"
      : "Activar cambio automático de proyectos",
  );
  play.textContent = enabled ? "Ⅱ" : "▷";
  play.disabled = pausedMotion();
  if (
    enabled &&
    visible &&
    !dragging &&
    !keyboardFocused &&
    !document.hidden &&
    !document.body.classList.contains("menu-is-open")
  )
    timer = setTimeout(() => carousel.scrollNext(), 6500);
}
function resetTransition() {
  gsap.killTweensOf([...panels, ...screens]);
  gsap.set([...panels, ...screens], {
    clearProps: "opacity,visibility,transform",
  });
}
function update(announce = false, animate = false) {
  const index = carousel.selectedScrollSnap();
  const changed = index !== activeIndex;
  activeIndex = index;
  if (changed) resetTransition();
  thumbs.forEach((button, i) =>
    button.setAttribute("aria-current", String(i === index)),
  );
  slides.forEach((slide, i) => {
    slide.setAttribute("aria-hidden", String(i !== index));
    const link = slide.querySelector<HTMLAnchorElement>(".project-visual");
    if (link) link.tabIndex = i === index ? 0 : -1;
  });
  panels.forEach((panel, i) => (panel.hidden = i !== index));
  if (announce)
    announcement.textContent = slides[index].getAttribute("aria-label")!;
  if (changed && animate && !pausedMotion()) {
    gsap.fromTo(
      panels[index],
      { opacity: 0.2, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        clearProps: "all",
        overwrite: true,
      },
    );
    gsap.fromTo(
      screens[index],
      { scale: 0.97, opacity: 0.6 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
        clearProps: "opacity,transform",
        overwrite: true,
      },
    );
  }
  schedule();
}
function navigate(action: () => void) {
  clearTimeout(timer);
  action();
  schedule();
}
thumbs.forEach((button, i) =>
  button.addEventListener("click", () =>
    navigate(() => carousel.scrollTo(i, pausedMotion())),
  ),
);
root
  .querySelector(".slide-prev")
  ?.addEventListener("click", () =>
    navigate(() => carousel.scrollPrev(pausedMotion())),
  );
root
  .querySelector(".slide-next")
  ?.addEventListener("click", () =>
    navigate(() => carousel.scrollNext(pausedMotion())),
  );
play.addEventListener("click", () => {
  playing = !playing;
  keyboardFocused = false;
  schedule();
});
root.addEventListener("keydown", (event) => {
  if ((event.target as HTMLElement).closest("a")) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    keyboardFocused = true;
    navigate(() =>
      event.key === "ArrowLeft"
        ? carousel.scrollPrev(pausedMotion())
        : carousel.scrollNext(pausedMotion()),
    );
  }
});
root.addEventListener("focusin", (event) => {
  keyboardFocused =
    event.target !== play &&
    (event.target as HTMLElement).matches(":focus-visible");
  schedule();
});
root.addEventListener("focusout", (event) => {
  if (!root.contains(event.relatedTarget as Node)) {
    keyboardFocused = false;
    schedule();
  }
});
carousel.on("select", () =>
  update(keyboardFocused || dragging || !playing, true),
);
carousel.on("pointerDown", () => {
  dragging = true;
  schedule();
});
carousel.on("pointerUp", () => {
  dragging = false;
  schedule();
});
carousel.on("reInit", () => update());
new IntersectionObserver(
  ([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  },
  { threshold: 0.15 },
).observe(root);
new MutationObserver(() => {
  const paused = pausedMotion();
  if (paused !== lastPaused) {
    lastPaused = paused;
    if (paused) resetTransition();
    carousel.reInit({ duration: paused ? 0 : 22 });
  }
  schedule();
}).observe(document.body, { attributes: true, attributeFilter: ["class"] });
document.addEventListener("visibilitychange", schedule);
reduced.addEventListener("change", () => {
  lastPaused = pausedMotion();
  if (lastPaused) resetTransition();
  carousel.reInit({ duration: lastPaused ? 0 : 22 });
  schedule();
});
window.addEventListener("pagehide", () => clearTimeout(timer));
window.addEventListener("pageshow", schedule);
update();
