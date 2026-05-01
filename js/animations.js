// Simple macOS-like window show animation helper
function showWindow(win) {
  requestAnimationFrame(() => {
    win.classList.add("window-visible");
  });
}