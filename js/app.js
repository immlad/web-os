window.addEventListener("load", () => {
  const mainWindow = document.getElementById("main-window");
  const profileWindow = document.getElementById("profile-window");
  const logoutBtn = document.getElementById("logout-btn");
  const saveProfileBtn = document.getElementById("save-profile");
  const profileStatus = document.getElementById("profile-status");

  const { bounceIcon, zoomOpen, minimizeWindow, enableDockHover } =
    window.JasonAnimations || {};

  // Random phrase
  const phrases = [
    "I am ICEMAN",
    "Jason is not GAYYYY",
    "UwU Nyaa~ -said Jason",
    "Year 2026",
    "I am Fireman",
    "Ja makin me dinner mom?"
  ];
  const phraseEl = document.getElementById("jason-phrase");
  if (phraseEl) {
    phraseEl.textContent =
      phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Animations
  if (enableDockHover) enableDockHover();
  if (zoomOpen && mainWindow) zoomOpen(mainWindow);

  // Dock
  document.querySelectorAll(".dock-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (bounceIcon) bounceIcon(item);
      const app = item.getAttribute("data-app");
      if (app === "home" && mainWindow) {
        mainWindow.style.display = "block";
        if (zoomOpen) zoomOpen(mainWindow);
      }
      if (app === "profile" && profileWindow) {
        profileWindow.classList.remove("hidden");
        if (zoomOpen) zoomOpen(profileWindow);

        const user = localStorage.getItem("jason_session") || "";
        document.getElementById("edit-username").value = user;
        document.getElementById("edit-password").value = "";
        profileStatus.textContent = "";
      }
    });
  });

  // Window controls (main + profile)
  document.querySelectorAll(".window").forEach((win) => {
    const closeBtn = win.querySelector(".win-dot.close");
    const minBtn = win.querySelector(".win-dot.min");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        win.style.display = "none";
      });
    }

    if (minBtn && minimizeWindow) {
      minBtn.addEventListener("click", () => minimizeWindow(win));
    }
  });

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("jason_session");
      sessionStorage.removeItem("jason_admin");
      window.location.href = "boot/boot.html";
    });
  }

  // Save profile
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      const oldUser = localStorage.getItem("jason_session");
      let accounts = JSON.parse(localStorage.getItem("jason_accounts") || "{}");

      const newUser = document.getElementById("edit-username").value.trim();
      const newPass = document.getElementById("edit-password").value.trim();

      if (!newUser || !newPass) {
        profileStatus.textContent = "All fields required.";
        return;
      }

      if (oldUser && accounts[oldUser]) {
        delete accounts[oldUser];
      }

      accounts[newUser] = newPass;
      localStorage.setItem("jason_accounts", JSON.stringify(accounts));
      localStorage.setItem("jason_session", newUser);

      profileStatus.textContent = "Profile saved.";
    });
  }
});