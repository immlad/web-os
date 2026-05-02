const ADMIN_PASSWORD = "JASONDABEST";

window.addEventListener("load", () => {
  const loginScreen = document.getElementById("login-screen");
  const desktop = document.getElementById("desktop");
  const loginBtn = document.getElementById("login-btn");
  const passwordInput = document.getElementById("password-input");
  const errorEl = document.getElementById("login-error");
  const mainWindow = document.getElementById("main-window");

  const { bounceIcon, zoomOpen, minimizeWindow, enableDockHover } =
    window.JasonAnimations || {};

  if (enableDockHover) enableDockHover();
  if (zoomOpen && mainWindow) zoomOpen(mainWindow);

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const value = (passwordInput.value || "").trim();

      if (!value) {
        errorEl.textContent = "Password required.";
        return;
      }

      if (value === ADMIN_PASSWORD) {
        sessionStorage.setItem("jason_admin", "true");
        window.location.href = "admin.html";
      } else {
        sessionStorage.removeItem("jason_admin");
        loginScreen.classList.add("hidden");
        desktop.classList.remove("hidden");
        errorEl.textContent = "";
        if (zoomOpen && mainWindow) {
          mainWindow.style.display = "block";
          zoomOpen(mainWindow);
        }
      }
    });

    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") loginBtn.click();
    });
  }

  // Dock interactions
  document.querySelectorAll(".dock-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (bounceIcon) bounceIcon(item);
      if (mainWindow) {
        mainWindow.style.display = "block";
        if (zoomOpen) zoomOpen(mainWindow);
      }
    });
  });

  // Window controls
  const closeBtn = document.querySelector(".win-dot.close");
  const minBtn = document.querySelector(".win-dot.min");

  if (closeBtn && mainWindow) {
    closeBtn.addEventListener("click", () => {
      mainWindow.style.display = "none";
    });
  }

  if (minBtn && mainWindow && minimizeWindow) {
    minBtn.addEventListener("click", () => minimizeWindow(mainWindow));
  }
});