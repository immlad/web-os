document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // --- Auth guard ---
  const userRaw = localStorage.getItem("jasonos_user");
  if (!userRaw) {
    window.location.href = "boot/boot.html";
    return;
  }
  const user = JSON.parse(userRaw);
  const isAdmin = !!user.isAdmin;

  // --- Random desktop phrase ---
  const phrases = [
    "I am Iceman",
    "Ja makin me dinner mom?",
    "I am Fireman",
    "UwU Nyaa~ Jason"
  ];
  const phraseEl = document.getElementById("desktop-phrase");
  if (phraseEl) {
    const pick = phrases[Math.floor(Math.random() * phrases.length)];
    phraseEl.textContent = pick;
  }

  // --- Clock ---
  const clockEl = document.getElementById("topbar-clock");
  function updateClock() {
    const now = new Date();
    const opts = {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit"
    };
    clockEl.textContent = now.toLocaleString(undefined, opts);
  }
  if (clockEl) {
    updateClock();
    setInterval(updateClock, 30_000);
  }

  // --- Theme switching + localStorage (from Settings) ---
  const appIcons = document.querySelectorAll(".app-icon");
  const jasonIconPath = "assets/jason.png";
  const defaultIconPath = "assets/app-default.png";

  function applyTheme(theme) {
    body.classList.remove("theme-cloud", "theme-night", "theme-forest", "theme-jason");
    body.classList.add(`theme-${theme}`);
    localStorage.setItem("jasonos_theme", theme);

    if (theme === "jason") {
      appIcons.forEach((img) => {
        img.dataset.originalSrc = img.dataset.originalSrc || img.getAttribute("src");
        img.setAttribute("src", jasonIconPath);
      });
    } else {
      appIcons.forEach((img) => {
        const original = img.dataset.originalSrc || defaultIconPath;
        img.setAttribute("src", original);
      });
    }
  }

  const savedTheme = localStorage.getItem("jasonos_theme") || "cloud";
  applyTheme(savedTheme);

  document.querySelectorAll(".settings-theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
    });
  });

  // --- Global admin message ---
  const globalMessageEl = document.getElementById("global-message");
  function renderGlobalMessage() {
    const msg = localStorage.getItem("jasonos_global_message");
    if (msg && msg.trim()) {
      globalMessageEl.textContent = `Admin: ${msg.trim()}`;
      globalMessageEl.classList.remove("hidden");
    } else {
      globalMessageEl.classList.add("hidden");
    }
  }
  renderGlobalMessage();

  // --- Window management ---
  const windows = Array.from(document.querySelectorAll("[data-app-window]"));
  const appSwitcher = document.getElementById("app-switcher");
  let zCounter = 50;

  function updateAppSwitcherActive(appId) {
    if (!appSwitcher) return;
    appSwitcher.querySelectorAll(".app-switcher-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.switchApp === appId);
    });
  }

  function bringToFront(win) {
    zCounter += 1;
    win.style.zIndex = zCounter;
    windows.forEach((w) => w.classList.remove("focused"));
    win.classList.add("focused");
    updateAppSwitcherActive(win.dataset.appId);
  }

  function ensureAppInSwitcher(appId, win) {
    if (!appSwitcher || !appId) return;

    let btn = appSwitcher.querySelector(`[data-switch-app="${appId}"]`);
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "app-switcher-btn";
      btn.dataset.switchApp = appId;
      const title = win.querySelector(".window-title")?.textContent || appId;
      btn.textContent = title;
      btn.addEventListener("click", () => {
        openWindowById(appId);
      });
      appSwitcher.appendChild(btn);
    }
    updateAppSwitcherActive(appId);
  }

  function removeAppFromSwitcher(appId) {
    if (!appSwitcher || !appId) return;
    const btn = appSwitcher.querySelector(`[data-switch-app="${appId}"]`);
    if (btn) appSwitcher.removeChild(btn);
  }

  function openWindowById(id) {
    const win = document.getElementById(`window-${id}`);
    if (!win) return;

    win.classList.remove("hidden", "minimized");
    if (!win.dataset.positioned) {
      const rect = win.getBoundingClientRect();
      win.style.left = `${(window.innerWidth - rect.width) / 2}px`;
      win.style.top = `${80 + Math.random() * 40}px`;
      win.style.transform = "none";
      win.dataset.positioned = "true";
    }

    requestAnimationFrame(() => {
      win.classList.add("active");
      bringToFront(win);
      ensureAppInSwitcher(id, win);
    });
  }

  function closeWindow(win) {
    win.classList.remove("active", "fullscreen", "minimized");
    setTimeout(() => {
      win.classList.add("hidden");
      removeAppFromSwitcher(win.dataset.appId);
    }, 160);
  }

  function minimizeWindow(win) {
    win.classList.add("minimized");
  }

  function toggleFullscreen(win) {
    win.classList.toggle("fullscreen");
  }

  // Dragging
  function makeDraggable(win) {
    const handle = win.querySelector("[data-drag-handle]");
    if (!handle) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    handle.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      if (win.classList.contains("fullscreen")) return;
      isDragging = true;
      bringToFront(win);

      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      win.style.transform = "none";

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.style.left = `${startLeft + dx}px`;
      win.style.top = `${startTop + dy}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  }

  windows.forEach((win) => {
    makeDraggable(win);

    const closeBtn = win.querySelector(".win-close");
    const minBtn = win.querySelector(".win-minimize");
    const fullBtn = win.querySelector(".win-fullscreen");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeWindow(win));
    }
    if (minBtn) {
      minBtn.addEventListener("click", () => minimizeWindow(win));
    }
    if (fullBtn) {
      fullBtn.addEventListener("click", () => toggleFullscreen(win));
    }

    win.addEventListener("mousedown", () => bringToFront(win));
  });

  // --- App launcher (rail + dock) ---
  function handleLaunch(appId) {
    openWindowById(appId);
  }

  document.querySelectorAll("[data-app]").forEach((el) => {
    el.addEventListener("click", () => {
      const app = el.dataset.app;
      handleLaunch(app);
    });
  });

  // --- Admin console wiring ---
  const adminPanel = document.getElementById("admin-panel");
  const adminLocked = document.getElementById("admin-locked");
  const adminInput = document.getElementById("admin-message-input");
  const adminBtn = document.getElementById("admin-broadcast-btn");

  if (adminPanel && adminLocked) {
    if (isAdmin) {
      adminPanel.classList.remove("hidden");
      adminLocked.classList.add("hidden");
    } else {
      adminPanel.classList.add("hidden");
      adminLocked.classList.remove("hidden");
    }
  }

  if (isAdmin && adminBtn && adminInput) {
    adminBtn.addEventListener("click", () => {
      const msg = adminInput.value.trim();
      localStorage.setItem("jasonos_global_message", msg);
      renderGlobalMessage();
    });
  }
});