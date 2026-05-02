(function () {
  function bounceIcon(el) {
    el.classList.remove("dock-bounce");
    void el.offsetWidth;
    el.classList.add("dock-bounce");
  }

  function zoomOpen(win) {
    if (!win) return;
    win.classList.remove("window-zoom");
    void win.offsetWidth;
    win.classList.add("window-zoom");
  }

  function minimizeWindow(win) {
    if (!win) return;
    win.classList.add("window-minimize");
    setTimeout(() => {
      win.style.display = "none";
      win.classList.remove("window-minimize");
    }, 280);
  }

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

  window.JasonAnimations = {
    bounceIcon,
    zoomOpen,
    minimizeWindow,
    enableDockHover,
  };
})();