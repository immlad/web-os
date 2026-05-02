// ===============================
// Jason OS – app.js (Part 1/3)
// ===============================

// Theme definitions
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
    wallpaper: "assets/jason.png",
    accent: "#4cc9f0",
    accentStrong: "#4361ee",
  },
};

// Apply theme with Jason Total Override Mode
function applyTheme(key) {
  const theme = themes[key];
  const root = document.documentElement;

  // Wallpaper + accents
  if (theme) {
    root.style.setProperty("--bg-wallpaper", `url("${theme.wallpaper}")`);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-strong", theme.accentStrong);
  } else {
    root.style.setProperty("--bg-wallpaper", `url("assets/app-default.png")`);
    root.style.setProperty("--accent", "#4cc9f0");
    root.style.setProperty("--accent-strong", "#4361ee");
  }

  // Update labels
  const label = document.getElementById("theme-label");
  const labelSmall = document.getElementById("theme-label-small");
  const name = theme ? theme.name : "Default";
  if (label) label.textContent = `Theme: ${name}`;
  if (labelSmall) labelSmall.textContent = name;

  // ===============================
  // JASON THEME TOTAL OVERRIDE MODE
  // ===============================
  if (key === "jason") {
    // Replace ALL dock icons with Jason image
    document.querySelectorAll(".dock-emoji").forEach((el) => {
      el.style.backgroundImage = "url('assets/jason.png')";
      el.style.backgroundSize = "cover";
      el.textContent = "";
    });

    // Replace ALL desktop icons with Jason image
    document.querySelectorAll(".desktop-icon-emoji").forEach((el) => {
      el.style.backgroundImage = "url('assets/jason.png')";
      el.style.backgroundSize = "cover";
      el.textContent = "";
    });

    // Replace ALL window titles
    document.querySelectorAll(".window-title").forEach((el) => {
      el.textContent = "Jason App";
    });

    // Replace top bar logo
    const topLogo = document.querySelector(".top-logo");
    if (topLogo) topLogo.src = "assets/jason.png";

  } else {
    // ===============================
    // RESET TO NORMAL ICONS
    // ===============================

    const defaultIcons = {
      home: "🏠",
      profile: "👤",
      settings: "⚙️",
      nebulo: "🌙",
      chat: "💬",
      admin: "🛡️",
    };

    // Reset dock icons
    document.querySelectorAll(".dock-item").forEach((item) => {
      const app = item.getAttribute("data-app");
      const emoji = item.querySelector(".dock-emoji");
      if (emoji && defaultIcons[app]) {
        emoji.style.backgroundImage = "";
        emoji.textContent = defaultIcons[app];
      }
    });

    // Reset desktop icons
    document.querySelectorAll(".desktop-icon").forEach((item) => {
      const app = item.getAttribute("data-app");
      const emoji = item.querySelector(".desktop-icon-emoji");
      if (emoji && defaultIcons[app]) {
        emoji.style.backgroundImage = "";
        emoji.textContent = defaultIcons[app];
      }
    });

    // Reset window titles
    const titles = {
      home: "Jason OS Home",
      profile: "Profile",
      settings: "Settings",
      nebulo: "Nebulo",
      chat: "Chat",
      admin: "Admin",
    };

    document.querySelectorAll(".window").forEach((win) => {
      const app = win.id.replace("-window", "");
      const title = win.querySelector(".window-title");
      if (title && titles[app]) title.textContent = titles[app];
    });

    // Reset top bar logo
    const topLogo = document.querySelector(".top-logo");
    if (topLogo) topLogo.src = "assets/jason.png";
  }

  // Save theme
  if (key) {
    localStorage.setItem("jason_theme", key);
  } else {
    localStorage.removeItem("jason_theme");
  }
}

// ===============================
// MAIN OS LOADER
// ===============================
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
  const desktopIcons = document.getElementById("desktop-icons");

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

  // Load theme
  const savedTheme = localStorage.getItem("jason_theme");
  if (savedTheme) applyTheme(savedTheme);
  else applyTheme(null);

  // Admin mode
  const isAdmin = sessionStorage.getItem("jason_admin") === "true";
  if (modeLabel) modeLabel.textContent = isAdmin ? "Admin" : "Standard User";

  // Inject Admin app into dock + desktop
  if (isAdmin) {
    const dock = document.getElementById("dock");
    const adminBtn = document.createElement("button");
    adminBtn.className = "dock-item";
    adminBtn.setAttribute("data-app", "admin");
    adminBtn.setAttribute("draggable", "true");
    adminBtn.innerHTML = `
      <div class="dock-emoji">🛡️</div>
      <span>Admin</span>
    `;
    dock.appendChild(adminBtn);

    const adminDesktop = document.createElement("button");
    adminDesktop.className = "desktop-icon";
    adminDesktop.setAttribute("data-app", "admin");
    adminDesktop.setAttribute("draggable", "true");
    adminDesktop.innerHTML = `
      <div class="desktop-icon-emoji">🛡️</div>
      <span>Admin</span>
    `;
    desktopIcons.appendChild(adminDesktop);
  }
    // Global message popup
  const globalMsg = localStorage.getItem("jason_global_message");
  if (globalMsg) {
    const banner = document.createElement("div");
    banner.className = "glass-soft global-banner";
    banner.innerHTML = `
      <span class="global-text">${globalMsg}</span>
      <button class="global-close">Dismiss</button>
    `;
    document.body.appendChild(banner);

    banner.querySelector(".global-close").addEventListener("click", () => {
      banner.remove();
    });
  }

  // Enable dock hover animations
  if (enableDockHover) enableDockHover();
  if (zoomOpen && mainWindow) zoomOpen(mainWindow);

  // ===============================
  // OPEN APP WINDOWS
  // ===============================
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

  // ===============================
  // DOCK CLICK HANDLING
  // ===============================
  document.querySelectorAll(".dock-item").forEach((item) => {
    item.addEventListener("click", () => {
      const app = item.getAttribute("data-app");
      const icon = item.querySelector(".dock-emoji");
      if (bounceIcon) bounceIcon(icon || item);
      openWindowForApp(app);
    });
  });

  // ===============================
  // DESKTOP ICON DOUBLE CLICK
  // ===============================
  document.querySelectorAll(".desktop-icon").forEach((item) => {
    item.addEventListener("dblclick", () => {
      const app = item.getAttribute("data-app");
      openWindowForApp(app);
    });
  });

  // ===============================
  // WINDOW CONTROLS
  // ===============================
  document.querySelectorAll(".window").forEach((win) => {
    const closeBtn = win.querySelector(".win-dot.close");
    const minBtn = win.querySelector(".win-dot.min");
    const maxBtn = win.querySelector(".win-dot.max");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        win.style.display = "none";
      });
    }

    if (minBtn && minimizeWindow) {
      minBtn.addEventListener("click", () => minimizeWindow(win));
    }

    if (maxBtn) {
      maxBtn.addEventListener("click", () => {
        win.classList.toggle("window-full");
      });
    }
  });

  // ===============================
  // THEME BUTTONS
  // ===============================
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-theme");
      applyTheme(key);
    });
  });

  // ===============================
  // LOGOUT
  // ===============================
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("jason_session");
      sessionStorage.removeItem("jason_admin");
      window.location.href = "boot/boot.html";
    });
  }

  // ===============================
  // SAVE PROFILE
  // ===============================
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

  // ===============================
  // DOCK DRAG & DROP
  // ===============================
  const dock = document.getElementById("dock");
  let dragDockItem = null;

  dock.addEventListener("dragstart", (e) => {
    const target = e.target.closest(".dock-item");
    if (!target) return;
    dragDockItem = target;
    e.dataTransfer.effectAllowed = "move";
  });

  dock.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest(".dock-item");
    if (!target || target === dragDockItem) return;
    const rect = target.getBoundingClientRect();
    const before = e.clientX < rect.left + rect.width / 2;
    dock.insertBefore(dragDockItem, before ? target : target.nextSibling);
  });

  dock.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDockItem = null;
  });
  // ===============================
  // DESKTOP ICON DRAG & DROP
  // ===============================
  let dragDesktopItem = null;

  desktopIcons.addEventListener("dragstart", (e) => {
    const target = e.target.closest(".desktop-icon");
    if (!target) return;
    dragDesktopItem = target;
    e.dataTransfer.effectAllowed = "move";
  });

  desktopIcons.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest(".desktop-icon");
    if (!target || target === dragDesktopItem) return;

    const rect = target.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;

    desktopIcons.insertBefore(
      dragDesktopItem,
      before ? target : target.nextSibling
    );
  });

  desktopIcons.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDesktopItem = null;
  });

}); // END window.onload