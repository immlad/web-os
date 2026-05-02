export function fadeInWindow(el) {
  el.classList.add("active");
  el.classList.remove("hidden");
}

export function fadeOutWindow(el) {
  el.classList.remove("active");
  setTimeout(() => {
    el.classList.add("hidden");
  }, 160);
}