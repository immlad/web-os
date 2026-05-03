document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Auth guard
  const userRaw = localStorage.getItem("jasonos_user");
  if (!userRaw) {
    window.location.href = "boot/boot.html";
    return;
  }
  const user = JSON.parse(userRaw);
  const isAdmin = !!user.isAdmin;

  // Topbar user
  const usernameEl = document.getElementById("topbar-username");
  const adminBadgeEl = document.getElementById("topbar-admin-badge");
  if (usernameEl) usernameEl.textContent = user.name || "";
  if (adminBadgeEl) adminBadgeEl.classList.toggle("hidden", !isAdmin);

  // Desktop phrase
  const phrases = [
    "I am Iceman",
    "Ja makin me dinner mom?",
    "I am Fireman",
    "UwU Nyaa~ Jason"
  ];
  const phraseEl = document.getElementById("desktop-phrase");
  if (phraseEl) phraseEl.textContent = phrases[Math.floor(Math.random() * phrases.length)];

  // Clock
  const clockEl = document.getElementById("topbar-clock");
  function updateClock() {
    const now = new Date();
    const opts = { weekday: "short", hour: "2-digit", minute: "2-digit" };
    clockEl.textContent = now.toLocaleString(undefined, opts);
  }
  if (clockEl) {
    updateClock();
    setInterval(updateClock, 30000);
  }

  // Theme
  function applyTheme(theme) {
    body.classList.remove("theme-cloud", "theme-night", "theme-forest", "theme-jason", "theme-sebastian");
    body.classList.add(`theme-${theme}`);
    localStorage.setItem("jasonos_theme", theme);
  }

  const savedTheme = localStorage.getItem("jasonos_theme") || "cloud";
  applyTheme(savedTheme);

  document.querySelectorAll(".settings-theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  // Global message
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

  // Notifications
  const notificationEl = document.getElementById("notification-banner");
  const notificationTextEl = document.getElementById("notification-text");

  function showNotification(text, timeout = 3500) {
    notificationTextEl.textContent = text;
    notificationEl.classList.remove("hidden");
    notificationEl.classList.add("show");
    setTimeout(() => {
      notificationEl.classList.remove("show");
      setTimeout(() => notificationEl.classList.add("hidden"), 200);
    }, timeout);
  }

  // Control Center toggle
  const controlCenterEl = document.getElementById("control-center");
  const topbarPills = document.querySelectorAll(".topbar-pill-item");
  const ccTrigger = topbarPills[2];
  if (ccTrigger && controlCenterEl) {
    ccTrigger.addEventListener("click", () => {
      controlCenterEl.classList.toggle("hidden");
      if (!controlCenterEl.classList.contains("hidden")) {
        openWindowById("control-center");
      }
    });
  }

  // Window manager
  const windows = Array.from(document.querySelectorAll("[data-app-window]"));
  const appSwitcher = document.getElementById("app-switcher");
  let zCounter = 50;

  function updateAppSwitcherActive(appId) {
    appSwitcher.querySelectorAll(".app-switcher-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.switchApp === appId);
    });
  }

  function bringToFront(win) {
    zCounter++;
    win.style.zIndex = zCounter;
    windows.forEach((w) => w.classList.remove("focused"));
    win.classList.add("focused");
    updateAppSwitcherActive(win.dataset.appId);
  }

  function ensureAppInSwitcher(appId, win) {
    let btn = appSwitcher.querySelector(`[data-switch-app="${appId}"]`);
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "app-switcher-btn";
      btn.dataset.switchApp = appId;
      btn.textContent = win.querySelector(".window-title")?.textContent || appId;
      btn.addEventListener("click", () => openWindowById(appId));
      appSwitcher.appendChild(btn);
    }
    updateAppSwitcherActive(appId);
  }

  function removeAppFromSwitcher(appId) {
    const btn = appSwitcher.querySelector(`[data-switch-app="${appId}"]`);
    if (btn) btn.remove();
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
    const isFs = win.classList.contains("fullscreen");
    if (!isFs) {
      const rect = win.getBoundingClientRect();
      win.dataset.prevLeft = rect.left;
      win.dataset.prevTop = rect.top;
      win.dataset.prevWidth = rect.width;
      win.dataset.prevHeight = rect.height;
      win.classList.add("fullscreen");
    } else {
      win.classList.remove("fullscreen");
      win.style.left = `${win.dataset.prevLeft}px`;
      win.style.top = `${win.dataset.prevTop}px`;
      win.style.width = `${win.dataset.prevWidth}px`;
      win.style.height = `${win.dataset.prevHeight}px`;
    }
  }

  function makeDraggable(win) {
    const handle = win.querySelector("[data-drag-handle]");
    if (!handle) return;

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    handle.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || win.classList.contains("fullscreen")) return;
      isDragging = true;
      bringToFront(win);

      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      win.style.transform = "none";

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });

    function onMove(e) {
      if (!isDragging) return;
      win.style.left = `${startLeft + (e.clientX - startX)}px`;
      win.style.top = `${startTop + (e.clientY - startY)}px`;
    }

    function onUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
  }

  windows.forEach((win) => {
    makeDraggable(win);
    win.querySelector(".win-close")?.addEventListener("click", () => closeWindow(win));
    win.querySelector(".win-minimize")?.addEventListener("click", () => minimizeWindow(win));
    win.querySelector(".win-fullscreen")?.addEventListener("click", () => toggleFullscreen(win));
    win.addEventListener("mousedown", () => bringToFront(win));
  });

  // Dock launcher + Liquid Aura sync
  function handleLaunch(appId) {
    if (appId === "logout") {
      localStorage.removeItem("jasonos_user");
      window.location.href = "boot/boot.html";
      return;
    }

    if (appId === "chat") {
      const frame = document.getElementById("liquid-aura-frame");
      const theme = localStorage.getItem("jasonos_theme") || "cloud";
      const url =
        `https://immlad.github.io/liquid-aura/#/app` +
        `?user=${encodeURIComponent(user.name)}` +
        `&admin=${user.isAdmin}` +
        `&theme=${encodeURIComponent(theme)}`;
      frame.src = url;
    }

    openWindowById(appId);
  }

  document.querySelectorAll("[data-app]").forEach((el) => {
    el.addEventListener("click", () => handleLaunch(el.dataset.app));
  });

  // Dock magnification
  const dock = document.getElementById("dock");
  const dockInner = document.getElementById("dock-inner");
  let dockItems = Array.from(document.querySelectorAll(".dock-item"));

  function updateDockMagnification(mouseX) {
    const maxScale = 1.45;
    const midScale = 1.25;
    const lowScale = 1.10;
    const influenceRadius = 90;

    dockItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - centerX);

      let scale = 1;
      if (distance < influenceRadius) {
        const t = 1 - distance / influenceRadius;
        scale = t > 0.66 ? maxScale : t > 0.33 ? midScale : lowScale;
      }

      item.style.transform = `scale(${scale})`;
    });
  }

  dock.addEventListener("mousemove", (e) => updateDockMagnification(e.clientX));
  dock.addEventListener("mouseleave", () => {
    dockItems.forEach((item) => (item.style.transform = "scale(1)"));
  });

  // Dock drag & drop
  const DOCK_ORDER_KEY = "jasonos_dock_order";

  function loadDockOrder() {
    try {
      return JSON.parse(localStorage.getItem(DOCK_ORDER_KEY));
    } catch {
      return null;
    }
  }

  function saveDockOrder(order) {
    localStorage.setItem(DOCK_ORDER_KEY, JSON.stringify(order));
  }

  function applyDockOrder() {
    const order = loadDockOrder();
    if (!order) return;

    const map = new Map();
    dockItems.forEach((item) => map.set(item.dataset.app, item));

    dockInner.innerHTML = "";
    order.forEach((appId) => {
      const item = map.get(appId);
      if (item) dockInner.appendChild(item);
    });

    dockItems = Array.from(document.querySelectorAll(".dock-item"));
  }

  if (!loadDockOrder()) {
    saveDockOrder(dockItems.map((i) => i.dataset.app));
  } else {
    applyDockOrder();
  }

  let dragSrcEl = null;

  function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.dataset.app);
    this.style.opacity = "0.4";
  }

  function handleDragOver(e) {
    e.preventDefault();
    return false;
  }

  function handleDrop(e) {
    e.stopPropagation();
    const srcApp = e.dataTransfer.getData("text/plain");
    const targetApp = this.dataset.app;

    if (!srcApp || srcApp === targetApp) return false;

    const order = loadDockOrder();
    const srcIndex = order.indexOf(srcApp);
    const targetIndex = order.indexOf(targetApp);

    order.splice(srcIndex, 1);
    order.splice(targetIndex, 0, srcApp);

    saveDockOrder(order);
    applyDockOrder();
    return false;
  }

  function handleDragEnd() {
    this.style.opacity = "1";
  }

  function wireDockDragAndDrop() {
    dockItems.forEach((item) => {
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragover", handleDragOver);
      item.addEventListener("drop", handleDrop);
      item.addEventListener("dragend", handleDragEnd);
    });
  }

  wireDockDragAndDrop();

  new MutationObserver(() => {
    dockItems = Array.from(document.querySelectorAll(".dock-item"));
    wireDockDragAndDrop();
  }).observe(dockInner, { childList: true });

  // Mission Control (F9)
  let missionControlActive = false;
  const windowOriginalStates = new Map();

  function enterMissionControl() {
    if (missionControlActive) return;
    missionControlActive = true;

    const cols = 2;
    const gap = 20;
    const marginTop = 80;
    const marginSide = 120;

    windows.forEach((win, index) => {
      if (win.classList.contains("hidden")) return;

      const rect = win.getBoundingClientRect();
      windowOriginalStates.set(win, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        transform: win.style.transform || ""
      });

      const col = index % cols;
      const row = Math.floor(index / cols);

      const targetWidth = (window.innerWidth - marginSide * 2 - gap * (cols - 1)) / cols;
      const targetHeight = (window.innerHeight - marginTop * 2 - gap * 2) / 3;

      win.style.transition = "all 0.18s ease";
      win.style.left = `${marginSide + col * (targetWidth + gap)}px`;
      win.style.top = `${marginTop + row * (targetHeight + gap)}px`;
      win.style.width = `${targetWidth}px`;
      win.style.height = `${targetHeight}px`;
      win.style.transform = "none";
    });
  }

  function exitMissionControl() {
    if (!missionControlActive) return;
    missionControlActive = false;

    windows.forEach((win) => {
      const state = windowOriginalStates.get(win);
      if (!state) return;

      win.style.left = `${state.left}px`;
      win.style.top = `${state.top}px`;
      win.style.width = `${state.width}px`;
      win.style.height = `${state.height}px`;
      win.style.transform = state.transform;
      win.style.transition = "all 0.18s ease";
    });

    windowOriginalStates.clear();
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "F9") {
      missionControlActive ? exitMissionControl() : enterMissionControl();
    }
  });

  // Admin console
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
    adminPanel.classList.toggle("hidden", !isAdmin);
    adminLocked.classList.toggle("hidden", isAdmin);
  }

  function getBannedNames() {
    return JSON.parse(localStorage.getItem("jasonos_banned_names") || "[]");
  }

  function setBannedNames(list) {
    localStorage.setItem("jasonos_banned_names", JSON.stringify(list));
  }

  function getAdminNames() {
    return JSON.parse(localStorage.getItem("jasonos_admin_names") || "[]");
  }

  function setAdminNames(list) {
    localStorage.setItem("jasonos_admin_names", JSON.stringify(list));
  }

  function normalizeNameInput() {
    return targetNameInput.value.trim().toLowerCase();
  }

  function isTrueAdminName(n) {
    return n === "minh" || n === "jason";
  }

  if (isAdmin) {
    banBtn?.addEventListener("click", () => {
      const n = normalizeNameInput();
      if (!n) return;
      if (isTrueAdminName(n)) {
        alert("You cannot ban a true admin.");
        return;
      }
      const list = getBannedNames();
      if (!list.includes(n)) list.push(n);
      setBannedNames(list);
      alert(`Banned: ${n}`);
    });

    unbanBtn?.addEventListener("click", () => {
      const n = normalizeNameInput();
      if (!n) return;
      setBannedNames(getBannedNames().filter((x) => x !== n));
      alert(`Unbanned: ${n}`);
    });

    makeAdminBtn?.addEventListener("click", () => {
      const n = normalizeNameInput();
      if (!n) return;
      if (isTrueAdminName(n)) {
        alert("This user is already a true admin.");
        return;
      }
      const list = getAdminNames();
      if (!list.includes(n)) list.push(n);
      setAdminNames(list);
      alert(`Made admin: ${n}`);
    });

    removeAdminBtn?.addEventListener("click", () => {
      const n = normalizeNameInput();
      if (!n) return;
      if (isTrueAdminName(n)) {
        alert("You cannot remove admin from a true admin.");
        return;
      }
      setAdminNames(getAdminNames().filter((x) => x !== n));
      alert(`Removed admin: ${n}`);
    });
  }

  // About secret Sebastian theme
  let aboutClickCount = 0;
  const aboutWindow = document.getElementById("window-about");
  if (aboutWindow) {
    aboutWindow.addEventListener("click", () => {
      aboutClickCount++;
      if (aboutClickCount >= 10) {
        applyTheme("sebastian");
        showNotification("Sebastian Mode Activated");
      }
    });
  }

  // Welcome
  showNotification(`Welcome, ${user.name}`);
});