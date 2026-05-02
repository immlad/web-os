// ======================================================
// Jason OS – Windows 11 Gaming Edition (Purple Neon)
// ======================================================

// THEMES
const themes = {
  forest: {
    name: "Forest",
    wallpaper: "assets/wallpaper-forest.png",
    accent: "#22c55e",
    glow: "#22c55e55"
  },
  night: {
    name: "Night",
    wallpaper: "assets/wallpaper-night.png",
    accent: "#4f46e5",
    glow: "#4f46e555"
  },
  cloud: {
    name: "Cloud",
    wallpaper: "assets/wallpaper-cloud.png",
    accent: "#38bdf8",
    glow: "#38bdf855"
  },
  jason: {
    name: "JASON",
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

  // JASON THEME OVERRIDE
  if (key === "jason") {
    document.querySelectorAll(".desktop-icon-img").forEach(el => {
      el.style.backgroundImage = "url('assets/jason.png')";
      el.style.backgroundSize = "cover";
      el.textContent = "";
    });

    document.querySelectorAll(".dock-icon").forEach(el => {
      el.style.backgroundImage = "url('assets/jason.png')";
      el.style.backgroundSize = "cover";
      el.textContent = "";
    });

    document.querySelectorAll(".window-title").forEach(el => {
      el.textContent = "Jason App";
    });
  } else {
    const defaults = {
      home: "🏠",
      profile: "👤",
      settings: "⚙️",
      nebulo: "🌙",
      chat: "💬"
    };

    document.querySelectorAll(".desktop-icon").forEach(btn => {
      const app = btn.getAttribute("data-app");
      const img = btn.querySelector(".desktop-icon-img");
      img.style.backgroundImage = "";
      img.textContent = defaults[app];
    });

    document.querySelectorAll(".dock-item").forEach(btn => {
      const app = btn.getAttribute("data-app");
      const img = btn.querySelector(".dock-icon");
      img.style.backgroundImage = "";
      img.textContent = defaults[app];
    });
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
    win.style.display = "none";
  }

  // MINIMIZE WINDOW
  function minimizeWindow(win) {
    if (window.JasonAnimations?.minimizeWindow) {
      window.JasonAnimations.minimizeWindow(win);
    }
  }

  // MAXIMIZE WINDOW
  function maximizeWindow(win) {
    win.classList.toggle("window-full");
  }

  // WINDOW CONTROLS
  document.querySelectorAll(".window").forEach(win => {
    win.querySelector(".win-btn.close").addEventListener("click", () => closeWindow(win));
    win.querySelector(".win-btn.min").addEventListener("click", () => minimizeWindow(win));
    win.querySelector(".win-btn.max").addEventListener("click", () => maximizeWindow(win));
  });

  // DESKTOP ICONS
  document.querySelectorAll(".desktop-icon").forEach(btn => {
    btn.addEventListener("dblclick", () => {
      openWindow(btn.getAttribute("data-app"));
    });
  });

  // DOCK ICONS
  document.querySelectorAll(".dock-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const app = btn.getAttribute("data-app");
      const icon = btn.querySelector(".dock-icon");

      if (window.JasonAnimations?.bounceIcon) {
        window.JasonAnimations.bounceIcon(icon);
      }

      openWindow(app);
    });
  });

  // START BUTTON
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");

  startBtn.addEventListener("click", () => {
    startMenu.classList.toggle("hidden");
  });

  // START MENU ITEMS
  document.querySelectorAll(".start-item").forEach(btn => {
    btn.addEventListener("click", () => {
      startMenu.classList.add("hidden");
      openWindow(btn.getAttribute("data-app"));
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

});