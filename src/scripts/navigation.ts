import { gsap } from "gsap";
const menu = document.querySelector<HTMLDialogElement>("#site-menu")!;
const open = document.querySelector<HTMLButtonElement>("#menu-open")!;
const close = document.querySelector<HTMLButtonElement>("#menu-close")!;
open.hidden = false;
open.addEventListener("click", () => {
  menu.showModal();
  document.body.classList.add("menu-is-open");
  open.setAttribute("aria-expanded", "true");
  if (
    !document.body.classList.contains("motion-paused") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    gsap.fromTo(
      menu.querySelectorAll("nav a"),
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.065,
        duration: 0.65,
        ease: "power3.out",
        overwrite: true,
        clearProps: "all",
      },
    );
  }
});
close.addEventListener("click", () => menu.close());
menu.addEventListener("close", () => {
  document.body.classList.remove("menu-is-open");
  open.setAttribute("aria-expanded", "false");
  open.focus({ preventScroll: true });
});
menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector<HTMLElement>(
      link.getAttribute("href")!,
    );
    menu.close();
    target?.scrollIntoView({
      behavior: document.body.classList.contains("motion-paused")
        ? "instant"
        : "smooth",
    });
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }),
);
const clock = document.querySelector<HTMLTimeElement>("#local-time");
function updateClock() {
  if (clock) {
    clock.textContent = new Intl.DateTimeFormat("es-CL", {
      timeZone: "America/Santiago",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
    clock.dateTime = new Date().toISOString();
  }
}
updateClock();
setInterval(updateClock, 1000);

const header = document.querySelector<HTMLElement>(".site-header");
let scrollFrame = 0;
function updateNavigation() {
  header?.classList.toggle(
    "is-scrolled",
    window.scrollY > window.innerHeight * 0.6,
  );
  const links = Array.from(
    menu.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]'),
  );
  let active = "#home";
  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href")!);
    if (
      section &&
      section.getBoundingClientRect().top < window.innerHeight * 0.45
    )
      active = link.getAttribute("href")!;
  });
  links.forEach((link) =>
    link.getAttribute("href") === active
      ? link.setAttribute("aria-current", "location")
      : link.removeAttribute("aria-current"),
  );
  scrollFrame = 0;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation);
  },
  { passive: true },
);
updateNavigation();

menu.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = Array.from(
    menu.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], [tabindex="0"]',
    ),
  );
  const first = focusable[0],
    last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
