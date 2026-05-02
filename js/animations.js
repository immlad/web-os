// ===============================
// Jason OS – animations.js
// ===============================

(function () {

  // Bounce animation for dock icons
  function bounceIcon(el) {
    if (!el) return;
    el.classList.remove("dock-bounce");
    void el.offsetWidth; // restart animation
    el.classList.add("dock-bounce");
  }

  // Window zoom-open animation
  function zoomOpen(win) {
    if (!win) return;
    win.classList.remove("window-zoom");
    void win.offsetWidth;
    win.classList.add("window-zoom");
  }

  // Window minimize animation
  function minimizeWindow(win) {
    if (!win) return;
    win.classList.add("window-minimize");
    setTimeout(() => {
      win.style.display = "none";
      win.classList.remove("window-minimize");
    }, 280);
  }

  // Dock hover lift effect
  function enableDockHover() {
    document.querySelectorAll(".dock-item .dock-emoji").forEach((icon) => {
      icon.addEventListener("mouseenter", () => {
        icon.classList.add("dock-hover");
      });
      icon.addEventListener("mouseleave", () => {
        icon.classList.remove("dock-hover");
      });
    });
  }

  // Export animations
  window.JasonAnimations = {
    bounceIcon,
    zoomOpen,
    minimizeWindow,
    enableDockHover,
  };

})();