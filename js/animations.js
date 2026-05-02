function showWindow(win) {
  requestAnimationFrame(() => {
    win.classList.add("window-visible");
  });
}