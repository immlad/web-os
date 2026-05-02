const themes = {
  forest: {
    name: "Forest",
    wallpaper: "assets/wallpaper-forest.png",
    accent: "#22c55e",
    accentStrong: "#15803d",
  },
  night: {
    name: "Night",
    wallpaper: "assets/wallpaper-night.png",
    accent: "#4f46e5",
    accentStrong: "#1d1b4f",
  },
  cloud: {
    name: "Cloud",
    wallpaper: "assets/wallpaper-cloud.png",
    accent: "#38bdf8",
    accentStrong: "#0ea5e9",
  },
  jason: {
    name: "JASON",
    wallpaper: "assets/wallpaper-jason.png",
    accent: "#4cc9f0",
    accentStrong: "#4361ee",
  },
};

function applyTheme(key) {
  const theme = themes[key] || themes.jason;
  const root = document.documentElement;
  const wallpaper = theme.wallpaper;

  root.style.setProperty("--bg-wallpaper", `url("${wallpaper}")`);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-strong", theme.accentStrong);

  const label = document.getElementById("theme-label");
  const labelSmall = document.getElementById("theme-label-small");
  if (label) label.textContent = `Theme: ${theme.name}`;
  if (labelSmall) labelSmall.textContent = theme.name;

  // JASON theme: override icons with jason.png
  const dockIcons = document.querySelectorAll(".dock-item img");
  if (key === "jason") {
    dockIcons.forEach((img) => {
      img.src = "assets/jason.png";
    });
  } else {
    // reset to app-default for non-profile apps
    dockIcons.forEach((img) => {
      const parent = img.closest(".dock-item");
      const app = parent?.getAttribute("data-app");
      if (app === "profile") {
        img.src = "assets/jason.png";
      } else {
        img.src = "assets/app-default.png";
      }
    });
  }

  localStorage.setItem("jason_theme", key);
}

window.addEventListener("load", () => {
  const mainWindow = document.getElementById("main-window");
  const profileWindow = document.getElementById("profile-window");
  const settingsWindow = document.getElementById("settings-window");
  const nebuloWindow = document.getElementById("nebulo-window");
  const chatWindow = document.getElementById("chat-window");
  const logoutBtn = document.getElementById("logout-btn");
  const saveProfileBtn = document.getElementById("save-profile");
  const profileStatus = document.getElementById("profile-status");
  const modeLabel = document.getElementById("mode-label");

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

  // Theme init
  const savedTheme = localStorage.getItem("jason_theme") || "jason";
  applyTheme(savedTheme);

  // Admin mode label
  const isAdmin = sessionStorage.getItem("jason_admin") === "true";
  if (modeLabel) {
    modeLabel.textContent = isAdmin ? "Admin" : "Standard User";
  }

  // Inject Admin app into dock if admin
  if (isAdmin) {
    const dock = document.getElementById("dock");
    const adminBtn = document.createElement("button");
    adminBtn.className = "dock-item";
    adminBtn.setAttribute("data-app", "admin");
    adminBtn.setAttribute("draggable", "true");
    adminBtn.innerHTML = `
      <img src="assets/app-default.png" alt="Admin" />
      <span>Admin</span>
    `;
    dock.appendChild(adminBtn);
  }

  // Animations
  if (enableDockHover) enableDockHover();
  if (zoomOpen && mainWindow) zoomOpen(mainWindow);

  // Dock click handling
  function openWindowForApp(app) {
    if (app === "home" && mainWindow) {
      mainWindow.style.display = "block";
      if (zoomOpen) zoomOpen(mainWindow);
    }
    if (app === "profile" && profileWindow) {
      profileWindow.classList.remove("hidden");
      profileWindow.style.display = "block";
      if (zoomOpen) zoomOpen(profileWindow);

      const user = localStorage.getItem("jason_session") || "";
      document.getElementById("edit-username").value = user;
      document.getElementById("edit-password").value = "";
      profileStatus.textContent = "";
    }
    if (app === "settings" && settingsWindow) {
      settingsWindow.classList.remove("hidden");
      settingsWindow.style.display = "block";
      if (zoomOpen) zoomOpen(settingsWindow);
    }
    if (app === "nebulo" && nebuloWindow) {
      nebuloWindow.classList.remove("hidden");
      nebuloWindow.style.display = "block";
      if (zoomOpen) zoomOpen(nebuloWindow);
    }
    if (app === "chat" && chatWindow) {
      chatWindow.classList.remove("hidden");
      chatWindow.style.display = "block";
      if (zoomOpen) zoomOpen(chatWindow);
    }
    if (app === "admin" && isAdmin) {
      window.location.href = "admin.html";
    }
  }

  document.querySelectorAll(".dock-item").forEach((item) => {
    item.addEventListener("click", () => {
      const app = item.getAttribute("data-app");
      if (bounceIcon) bounceIcon(item);
      openWindowForApp(app);
    });
  });

  // Window controls
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

  // Theme buttons
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-theme");
      applyTheme(key);
    });
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

      if (newUser.toLowerCase() === "minh" || newUser.toLowerCase() === "jason") {
        sessionStorage.setItem("jason_admin", "true");
      } else {
        sessionStorage.removeItem("jason_admin");
      }

      profileStatus.textContent = "Profile saved.";
    });
  }

  // Dock drag & drop
  const dock = document.getElementById("dock");
  let dragItem = null;

  dock.addEventListener("dragstart", (e) => {
    const target = e.target.closest(".dock-item");
    if (!target) return;
    dragItem = target;
    e.dataTransfer.effectAllowed = "move";
  });

  dock.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest(".dock-item");
    if (!target || target === dragItem) return;
    const rect = target.getBoundingClientRect();
    const before = e.clientX < rect.left + rect.width / 2;
    dock.insertBefore(dragItem, before ? target : target.nextSibling);
  });

  dock.addEventListener("drop", (e) => {
    e.preventDefault();
    dragItem = null;
  });
});