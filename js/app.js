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

  // --- User name + admin badge ---
  const usernameEl = document.getElementById("topbar-username");
  const adminBadgeEl = document.getElementById("topbar-admin-badge");

  if (usernameEl) {
    usernameEl.textContent = user.name || "";
  }

  if (adminBadgeEl) {
    if (isAdmin) {
      adminBadgeEl.classList.remove("hidden");
    } else {
      adminBadgeEl.classList.add("hidden");
    }
  }

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
  function applyTheme(theme) {
    body.classList.remove("theme-cloud", "theme-night", "theme-forest", "theme-jason");
    body.classList.add(`theme-${theme}`);
    localStorage.setItem("jasonos_theme", theme);
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

  // Fullscreen with restore
  function toggleFullscreen(win) {
    const isFs = win.classList.contains("fullscreen");

    if (!isFs) {
      const rect = win.getBoundingClientRect();
      win.dataset.prevLeft = rect.left;
      win.dataset.prevTop = rect.top;
      win.dataset.prevWidth = rect.width;
      win.dataset.prevHeight = rect.height;

      win.classList.add("fullscreen");
      win.dataset.fullscreen = "true";
    } else {
      win.classList.remove("fullscreen");
      win.dataset.fullscreen = "false";

      const prevLeft = parseFloat(win.dataset.prevLeft || "100");
      const prevTop = parseFloat(win.dataset.prevTop || "100");
      const prevWidth = parseFloat(win.dataset.prevWidth || "800");
      const prevHeight = parseFloat(win.dataset.prevHeight || "500");

      win.style.left = `${prevLeft}px`;
      win.style.top = `${prevTop}px`;
      win.style.width = `${prevWidth}px`;
      win.style.height = `${prevHeight}px`;
    }
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

  // --- App launcher (dock) ---
  function handleLaunch(appId) {
    if (appId === "logout") {
      localStorage.removeItem("jasonos_user");
      window.location.href = "boot/boot.html";
      return;
    }

    openWindowById(appId);
  }

  document.querySelectorAll("[data-app]").forEach((el) => {
    el.addEventListener("click", () => {
      const app = el.dataset.app;
      handleLaunch(app);
    });
  });

  // --- Dock magnification (true macOS wave) ---
  const dock = document.getElementById("dock");
  const dockItems = Array.from(document.querySelectorAll(".dock-item"));

  function updateDockMagnification(mouseY) {
    const maxScale = 1.6;
    const midScale = 1.3;
    const lowScale = 1.1;
    const influenceRadius = 80; // px

    dockItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = Math.abs(mouseY - centerY);

      let scale = 1;

      if (distance < influenceRadius) {
        const t = 1 - distance / influenceRadius;
        if (t > 0.66) {
          scale = maxScale;
        } else if (t > 0.33) {
          scale = midScale;
        } else {
          scale = lowScale;
        }
      }

      item.style.transform = `scale(${scale})`;
    });
  }

  if (dock) {
    dock.addEventListener("mousemove", (e) => {
      updateDockMagnification(e.clientY);
    });

    dock.addEventListener("mouseleave", () => {
      dockItems.forEach((item) => {
        item.style.transform = "scale(1)";
      });
    });
  }

  // --- Admin console wiring ---
  const adminPanel = document.getElementById("admin-panel");
  const adminLocked = document.getElementById("admin-locked");
  const adminInput = document.getElementById("admin-message-input");
  const adminBtn = document.getElementById("admin-broadcast-btn");

  const targetNameInput = document.getElementById("admin-target-name");
  const banBtn = document.getElementById("admin-ban-btn");
  const unbanBtn = document.getElementById("admin-unban-btn");
  const makeAdminBtn = document.getElementById("admin-make-admin-btn");
  const removeAdminBtn = document.getElementById("admin-remove-admin-btn");

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

  function getBannedNames() {
    const raw = localStorage.getItem("jasonos_banned_names");
    return raw ? JSON.parse(raw) : [];
  }

  function setBannedNames(list) {
    localStorage.setItem("jasonos_banned_names", JSON.stringify(list));
  }

  function getAdminNames() {
    const raw = localStorage.getItem("jasonos_admin_names");
    return raw ? JSON.parse(raw) : [];
  }

  function setAdminNames(list) {
    localStorage.setItem("jasonos_admin_names", JSON.stringify(list));
  }

  function normalizeNameInput() {
    const val = targetNameInput.value.trim();
    return val.toLowerCase();
  }

  if (isAdmin && targetNameInput && banBtn && unbanBtn && makeAdminBtn && removeAdminBtn) {
    banBtn.addEventListener("click", () => {
      const n = normalizeNameInput();
      if (!n) return;
      const list = getBannedNames();
      if (!list.includes(n)) list.push(n);
      setBannedNames(list);
      alert(`Banned: ${n}`);
    });

    unbanBtn.addEventListener("click", () => {
      const n = normalizeNameInput();
      if (!n) return;
      let list = getBannedNames();
      list = list.filter((x) => x !== n);
      setBannedNames(list);
      alert(`Unbanned: ${n}`);
    });

    makeAdminBtn.addEventListener("click", () => {
      const n = normalizeNameInput();
      if (!n) return;
      const list = getAdminNames();
      if (!list.includes(n)) list.push(n);
      setAdminNames(list);
      alert(`Made admin: ${n}`);
    });

    removeAdminBtn.addEventListener("click", () => {
      const n = normalizeNameInput();
      if (!n) return;
      let list = getAdminNames();
      list = list.filter((x) => x !== n);
      setAdminNames(list);
      alert(`Removed admin: ${n}`);
    });
  }
});