import { withBase } from "../utils/paths";
import { gsap } from "gsap";
const cards = Array.from(
  document.querySelectorAll<HTMLAnchorElement>(".stack-card"),
);
const icon = document.querySelector<HTMLImageElement>("#stack-feature-icon")!;
const docs = document.querySelector<HTMLAnchorElement>("#stack-feature-docs")!;
const copy = document.querySelector<HTMLElement>(".stack-feature-copy")!;
const navigation = document.querySelector<HTMLElement>(
  ".stack-feature-navigation",
)!;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
let active = 0;
function resetTransition() {
  gsap.killTweensOf([docs, copy]);
  gsap.set([docs, copy], { clearProps: "opacity,visibility,transform" });
}
function select(card: HTMLAnchorElement) {
  const index = cards.indexOf(card);
  if (index === active) return;
  active = index;
  resetTransition();
  const position = document.querySelector("#stack-position");
  if (position)
    position.textContent = `${String(index + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  cards.forEach((item) => (item.dataset.selected = String(item === card)));
  icon.src = withBase(`/svg/${card.dataset.icon}.svg`);
  docs.href = card.href;
  docs.setAttribute("aria-label", card.getAttribute("aria-label")!);
  for (const key of ["name", "category", "description"]) {
    const target = document.querySelector(`#stack-feature-${key}`);
    if (target) target.textContent = card.dataset[key] || "";
  }
  document
    .querySelector<HTMLElement>(".stack-feature")
    ?.style.setProperty(
      "--skill-accent",
      card.style.getPropertyValue("--skill-accent"),
    );
  if (!reduced.matches && !document.body.classList.contains("motion-paused"))
    gsap.fromTo(
      [docs, copy],
      { opacity: 0.15, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.48,
        stagger: 0.04,
        ease: "power2.out",
        overwrite: true,
        clearProps: "opacity,transform",
      },
    );
}
navigation.hidden = false;
document
  .querySelector("#stack-prev")
  ?.addEventListener("click", () =>
    select(cards[(active - 1 + cards.length) % cards.length]),
  );
document
  .querySelector("#stack-next")
  ?.addEventListener("click", () => select(cards[(active + 1) % cards.length]));
cards.forEach((card) => {
  card.addEventListener("click", () => select(card));
  card.addEventListener("focus", () => select(card));
  card.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") select(card);
  });
});
new MutationObserver(() => {
  if (document.body.classList.contains("motion-paused")) resetTransition();
}).observe(document.body, { attributes: true, attributeFilter: ["class"] });
reduced.addEventListener("change", () => {
  if (reduced.matches) resetTransition();
});
