document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const userRaw = localStorage.getItem("jasonos_user");
  if (!userRaw) {
    window.location.href = "boot/boot.html";
    return;
  }
  const user = JSON.parse(userRaw);
  const isAdmin = !!user.isAdmin;

  const usernameEl = document.getElementById("topbar-username");
  const adminBadgeEl = document.getElementById("topbar-admin-badge");
  if (usernameEl) usernameEl.textContent = user.name || "";
  if (adminBadgeEl) adminBadgeEl.classList.toggle("hidden", !isAdmin);

  const phrases = [
    "I am Iceman",
    "Ja makin me dinner mom?",
    "I am Fireman",
    "UwU Nyaa~ Jason"
  ];
  const phraseEl = document.getElementById("desktop-phrase");
  if (phraseEl) phraseEl.textContent = phrases[Math.floor(Math.random() * phrases.length)];

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

  const windows = Array.from(document.querySelectorAll("[data-app-window]"));
  let zCounter = 50;

  function bringToFront(win) {
    zCounter++;
    win.style.zIndex = zCounter;
    windows.forEach((w) => w.classList.remove("focused"));
    win.classList.add("focused");
  }

  function openWindowById(id) {
    const win = document.getElementById(`window-${id}`);
    if (!win) return;

    win.classList.remove("hidden", "minimized");

    if (!win.dataset.positioned) {
      const rect = win.getBoundingClientRect();
      win.style.left = `${(window.innerWidth - rect.width) / 2}px`;
      win.style.top = `${80 + Math.random() * 40}px`;
      win.dataset.positioned = "true";
    }

    requestAnimationFrame(() => {
      win.classList.add("active");
      bringToFront(win);
    });
  }

  function closeWindow(win) {
    win.classList.remove("active", "fullscreen", "minimized");
    setTimeout(() => win.classList.add("hidden"), 160);
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

  function handleLaunch(appId) {
    if (appId === "logout") {
      localStorage.removeItem("jasonos_user");
      window.location.href = "boot/boot.html";
      return;
    }

    if (appId === "chat") {
      const frame = document.getElementById("liquid-aura-frame");
      const theme = localStorage.getItem("jasonos_theme") || "cloud";

      const avatar =
        user.name.toLowerCase() === "minh"
          ? "https://yourcdn/minh.png"
          : user.name.toLowerCase() === "jason"
          ? "https://yourcdn/jason.png"
          : "https://yourcdn/default.png";

      const url =
        `https://immlad.github.io/liquid-aura/#/app/` +
        `?user=${encodeURIComponent(user.name)}` +
        `&admin=${user.isAdmin}` +
        `&theme=${encodeURIComponent(theme)}` +
        `&avatar=${encodeURIComponent(avatar)}`;

      frame.src = url;
    }

    openWindowById(appId);
  }

  document.querySelectorAll("[data-app]").forEach((el) => {
    el.addEventListener("click", () => handleLaunch(el.dataset.app));
  });

  const dock = document.getElementById("dock");
  const dockItems = Array.from(document.querySelectorAll(".dock-item"));

  dock.addEventListener("mousemove", (e) => {
    dockItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - center);
      const scale = Math.max(1, 1.4 - dist / 150);
      item.style.transform = `scale(${scale})`;
    });
  });

  dock.addEventListener("mouseleave", () => {
    dockItems.forEach((item) => (item.style.transform = "scale(1)"));
  });

  const adminPanel = document.getElementById("admin-panel");
  const adminLocked = document.getElementById("admin-locked");

  if (isAdmin) {
    adminPanel.classList.remove("hidden");
    adminLocked.classList.add("hidden");
  }

  const adminInput = document.getElementById("admin-message-input");
  const adminBtn = document.getElementById("admin-broadcast-btn");

  adminBtn?.addEventListener("click", () => {
    const msg = adminInput.value.trim();
    localStorage.setItem("jasonos_global_message", msg);
    renderGlobalMessage();
  });

  function showNotification(text, timeout = 3500) {
    console.log(text);
  }

  showNotification(`Welcome, ${user.name}`);
});