// ======================================================
// Jason OS – Windows 11 Gaming Edition (A3 Dock Version)
// ======================================================

// THEMES
const themes = {
  forest: {
    wallpaper: "assets/wallpaper-forest.png",
    accent: "#22c55e",
    glow: "#22c55e55"
  },
  night: {
    wallpaper: "assets/wallpaper-night.png",
    accent: "#4f46e5",
    glow: "#4f46e555"
  },
  cloud: {
    wallpaper: "assets/wallpaper-cloud.png",
    accent: "#38bdf8",
    glow: "#38bdf855"
  },
  jason: {
    wallpaper: "assets/jason.png",
    accent: "#d946ef",
    glow: "#d946ef55"
  }
};

// APPLY THEME
function applyTheme(key) {
  const theme = themes[key];
  const root = document.documentElement;

  if (theme) {
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--glow", theme.glow);
    root.style.setProperty("--bg-wallpaper", `url("${theme.wallpaper}")`);
  }

  localStorage.setItem("jason_theme", key);
}

// ======================================================
// MAIN OS LOGIC
// ======================================================

window.addEventListener("load", () => {

  // LOAD THEME
  const savedTheme = localStorage.getItem("jason_theme");
  if (savedTheme) applyTheme(savedTheme);

  // WINDOWS
  const windows = {
    home: document.getElementById("home-window"),
    profile: document.getElementById("profile-window"),
    settings: document.getElementById("settings-window"),
    nebulo: document.getElementById("nebulo-window"),
    chat: document.getElementById("chat-window")
  };

  // OPEN WINDOW
  function openWindow(app) {
    const win = windows[app];
    if (!win) return;

    win.classList.remove("hidden");
    win.style.display = "block";

    if (window.JasonAnimations?.zoomOpen) {
      window.JasonAnimations.zoomOpen(win);
    }
  }

  // CLOSE WINDOW
  function closeWindow(win) {
    win.classList.add("hidden");
    win.style.display = "none";
  }

  // MINIMIZE WINDOW
  function minimizeWindow(win) {
    if (window.JasonAnimations?.minimizeWindow) {
      window.JasonAnimations.minimizeWindow(win);
    } else {
      closeWindow(win);
    }
  }

  // MAXIMIZE WINDOW
  function maximizeWindow(win) {
    win.classList.toggle("window-full");
  }

  // WINDOW CONTROLS
  document.querySelectorAll(".window").forEach(win => {
    const closeBtn = win.querySelector(".win-btn.close");
    const minBtn = win.querySelector(".win-btn.min");
    const maxBtn = win.querySelector(".win-btn.max");

    if (closeBtn) closeBtn.addEventListener("click", () => closeWindow(win));
    if (minBtn) minBtn.addEventListener("click", () => minimizeWindow(win));
    if (maxBtn) maxBtn.addEventListener("click", () => maximizeWindow(win));
  });

  // DOCK ICONS — MAGNIFY + BOUNCE + OPEN APP
  document.querySelectorAll(".dock-item").forEach(btn => {
    const icon = btn.querySelector(".dock-icon");

    // Hover magnification
    btn.addEventListener("mousemove", () => {
      icon.classList.add("dock-magnify");
    });

    btn.addEventListener("mouseleave", () => {
      icon.classList.remove("dock-magnify");
    });

    // Click bounce + open
    btn.addEventListener("click", () => {
      const app = btn.getAttribute("data-app");

      if (window.JasonAnimations?.bounceIcon) {
        window.JasonAnimations.bounceIcon(icon);
      }

      openWindow(app);
    });
  });

  // THEME BUTTONS
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(btn.getAttribute("data-theme"));
    });
  });

  // PROFILE SAVE
  const saveProfile = document.getElementById("save-profile");
  const profileStatus = document.getElementById("profile-status");

  if (saveProfile) {
    saveProfile.addEventListener("click", () => {
      const user = document.getElementById("edit-username").value.trim();
      const pass = document.getElementById("edit-password").value.trim();

      if (!user || !pass) {
        profileStatus.textContent = "All fields required.";
        return;
      }

      let accounts = JSON.parse(localStorage.getItem("jason_accounts") || "{}");
      const oldUser = localStorage.getItem("jason_session");

      if (oldUser && accounts[oldUser]) delete accounts[oldUser];

      accounts[user] = pass;
      localStorage.setItem("jason_accounts", JSON.stringify(accounts));
      localStorage.setItem("jason_session", user);

      profileStatus.textContent = "Profile saved.";
    });
  }

});