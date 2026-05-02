// ======================================================
// Jason OS – Windows 11 Gaming Edition Animations
// ======================================================

(function () {

  // ------------------------------------------------------
  // Dock Bounce Animation
  // ------------------------------------------------------
  function bounceIcon(el) {
    if (!el) return;
    el.classList.remove("dock-bounce");
    void el.offsetWidth; // restart animation
    el.classList.add("dock-bounce");
  }

  // ------------------------------------------------------
  // Window Zoom-Open Animation
  // ------------------------------------------------------
  function zoomOpen(win) {
    if (!win) return;
    win.classList.remove("window-zoom");
    void win.offsetWidth;
    win.classList.add("window-zoom");
  }

  // ------------------------------------------------------
  // Window Minimize Animation
  // ------------------------------------------------------
  function minimizeWindow(win) {
    if (!win) return;
    win.classList.add("window-minimize");

    setTimeout(() => {
      win.style.display = "none";
      win.classList.remove("window-minimize");
    }, 220);
  }

  // ------------------------------------------------------
  // Dock Hover Lift Effect
  // ------------------------------------------------------
  function enableDockHover() {
    document.querySelectorAll(".dock-icon").forEach(icon => {
      icon.addEventListener("mouseenter", () => {
        icon.classList.add("dock-hover");
      });
      icon.addEventListener("mouseleave", () => {
        icon.classList.remove("dock-hover");
      });
    });
  }

  // Enable hover on load
  window.addEventListener("load", enableDockHover);

  // ------------------------------------------------------
  // Export Animations
  // ------------------------------------------------------
  window.JasonAnimations = {
    bounceIcon,
    zoomOpen,
    minimizeWindow,
    enableDockHover
  };

})();