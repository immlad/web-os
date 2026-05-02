const authScreen = document.getElementById("authScreen");
const desktopEl = document.getElementById("desktop");
const dock = document.getElementById("dock");
const windowsContainer = document.getElementById("windows");
const missionControlOverlay = document.getElementById("missionControlOverlay");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const authMessage = document.getElementById("authMessage");

const loginTagline = document.getElementById("loginTagline");
const desktopTagline = document.getElementById("desktopTagline");
const statusClock = document.getElementById("statusClock");
const logoutBtn = document.getElementById("logoutBtn");

let zIndexCounter = 10;
let currentUser = null;
let isOwner = false;
let isAdmin = false;

let aboutClickCount = 0;
let sebastianUnlocked = false;

// icons
const DEFAULT_ICON = "assets/app-default.png";
const JASON_ICON = "assets/jason.png";
const SEBASTIAN_ICON = "assets/sebastian.png";

// desktop grid for snap
const DESKTOP_COLUMNS = 7;
const DESKTOP_START_X = 40;
const DESKTOP_START_Y = 160;
const DESKTOP_STEP_X = 110;
const DESKTOP_STEP_Y = 120;

// Taglines
const taglines = [
  "I am Iceman",
  "JAAAAAAAAAAAAAAASSSSSSSSSSSOOOOOOOOOOONNNNNNN",
  "Nyaaa UWU - Jason",
  "2026",
  "Jason OS Ascends",
  "Powered by Pure Chaos"
];

function randomTagline() {
  return taglines[Math.floor(Math.random() * taglines.length)];
}

loginTagline.textContent = randomTagline();
setInterval(() => {
  loginTagline.textContent = randomTagline();
}, 2500);

desktopTagline.textContent = randomTagline();
setInterval(() => {
  desktopTagline.textContent = randomTagline();
}, 4000);

// Clock
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  statusClock.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 30000);

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    window.location.reload();
  });
}

// ---------------------------
// AUTH
// ---------------------------
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("jason_users") || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("jason_users", JSON.stringify(users));
}

function setAuthMessage(msg, isError = false) {
  authMessage.textContent = msg;
  authMessage.style.color = isError ? "#ff6b6b" : "#a0ffb0";
}

signupBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    setAuthMessage("Enter a username and password to sign up.", true);
    return;
  }

  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    setAuthMessage("That username is already taken.", true);
    return;
  }

  users.push({ username, password });
  saveUsers(users);
  setAuthMessage("Account created. You can now log in.");
});

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    setAuthMessage("Enter your username and password.", true);
    return;
  }

  const users = getUsers();
  const user = users.find(
    u =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
  );

  const isOwnerPassword = password === "JASONDABEST";

  if (!user && !isOwnerPassword) {
    setAuthMessage("Invalid credentials.", true);
    return;
  }

  currentUser = { username, password };
  isOwner = isOwnerPassword;
  isAdmin =
    isOwner ||
    username.toLowerCase() === "jason" ||
    username.toLowerCase() === "minh";

  if (isOwnerPassword && !user) {
    users.push({ username, password });
    saveUsers(users);
  }

  authScreen.classList.add("hidden");
  desktopEl.classList.remove("hidden");
  dock.classList.remove("hidden");
  windowsContainer.classList.remove("hidden");

  initThemeSystem();
  initDesktop();
});

passwordInput.addEventListener("keydown", e => {
  if (e.key === "Enter") loginBtn.click();
});

// ---------------------------
// THEMES + WALLPAPER
// ---------------------------
const themes = [
  { id: "liquid-glass", name: "Liquid Glass" },
  { id: "amoled", name: "AMOLED" },
  { id: "light", name: "Light" },
  { id: "forest", name: "Forest" },
  { id: "ocean", name: "Ocean" },
  { id: "night", name: "Night" },
  { id: "jason", name: "Jason" }
  // sebastian added dynamically after unlock
];

let currentTheme = "liquid-glass";
let customWallpaperURL = null;

function initThemeSystem() {
  currentTheme = "liquid-glass";
  customWallpaperURL = null;
  document.body.className = "";
  document.body.classList.add("theme-liquid-glass");
  applyWallpaper(null);
}

function applyTheme(id) {
  document.body.classList.remove(
    "theme-liquid-glass",
    "theme-amoled",
    "theme-light",
    "theme-forest",
    "theme-ocean",
    "theme-night",
    "theme-jason",
    "theme-sebastian"
  );
  document.body.classList.add("theme-" + id);
  currentTheme = id;

  if (id === "jason") {
    applyWallpaper("assets/wallpaper.png");
  } else if (id === "sebastian") {
    applyWallpaper(SEBASTIAN_ICON);
  } else {
    // default: blank (body gradient)
    applyWallpaper(null);
  }

  refreshAllIconsForTheme();
}

function applyWallpaper(url) {
  if (!url) {
    customWallpaperURL = null;
    document.body.classList.remove("has-custom-wallpaper");
    document.body.style.removeProperty("--wallpaper-url");
    return;
  }
  customWallpaperURL = url;
  document.body.classList.add("has-custom-wallpaper");
  document.body.style.setProperty("--wallpaper-url", `url('${url}')`);
}

function getThemeIcon() {
  if (currentTheme === "sebastian") return SEBASTIAN_ICON;
  if (currentTheme === "jason") return JASON_ICON;
  return DEFAULT_ICON;
}

function refreshAllIconsForTheme() {
  const iconSrc = getThemeIcon();
  document.querySelectorAll(".desktop-icon img").forEach(img => {
    img.src = iconSrc;
  });
  document.querySelectorAll(".dock-icon img").forEach(img => {
    img.src = iconSrc;
  });
}

// ---------------------------
// APP STORAGE
// ---------------------------
function getPendingApps() {
  try {
    return JSON.parse(localStorage.getItem("jason_pending_apps") || "[]");
  } catch {
    return [];
  }
}

function savePendingApps(list) {
  localStorage.setItem("jason_pending_apps", JSON.stringify(list));
}

function getCustomApps() {
  try {
    return JSON.parse(localStorage.getItem("jason_custom_apps") || "[]");
  } catch {
    return [];
  }
}

function saveCustomApps(list) {
  localStorage.setItem("jason_custom_apps", JSON.stringify(list));
}

// ---------------------------
// APPS CONFIG
// ---------------------------
let apps = [];

function buildApps() {
  const baseIcon = getThemeIcon();

  const baseApps = [
    {
      name: "Settings",
      type: "settings",
      icon: baseIcon
    },
    {
      name: "Music",
      type: "iframe",
      url: "https://vapor.onl/page/music",
      icon: baseIcon
    },
    {
      name: "Nebulo",
      type: "iframe",
      url: "https://nebulo.bostoncareercounselor.com",
      icon: baseIcon
    },
    {
      name: "Chat",
      type: "iframe",
      url: "https://iquid-aura.vercel.app",
      icon: baseIcon
    },
    {
      name: "Web App Creator",
      type: "creator",
      icon: baseIcon
    },
    {
      name: "App Store",
      type: "store",
      icon: baseIcon
    },
    {
      name: "About Jason",
      type: "about",
      icon: baseIcon
    }
  ];

  const customApps = getCustomApps().map(app => ({
    name: app.name,
    type: "dynamic",
    url: app.url,
    icon:
      currentTheme === "sebastian"
        ? SEBASTIAN_ICON
        : app.icon || baseIcon
  }));

  apps = [...baseApps, ...customApps];

  if (isAdmin) {
    apps.push({
      name: "Admin",
      type: "iframe",
      url: "admin.html",
      icon: baseIcon
    });
  }
}

// ---------------------------
// DESKTOP GRID (7 columns)
// ---------------------------
function initDesktop() {
  buildApps();

  apps.forEach((app, index) => {
    const col = index % DESKTOP_COLUMNS;
    const row = Math.floor(index / DESKTOP_COLUMNS);

    const x = DESKTOP_START_X + col * DESKTOP_STEP_X;
    const y = DESKTOP_START_Y + row * DESKTOP_STEP_Y;

    addDesktopApp(app, x, y);
  });
}

function addDesktopApp(app, x, y) {
  const icon = document.createElement("div");
  icon.className = "desktop-icon";
  icon.style.left = x + "px";
  icon.style.top = y + "px";
  icon.innerHTML = `
    <img src="${app.icon}">
    <div>${app.name}</div>
  `;
  icon.addEventListener("click", () => openApp(app));
  desktopEl.appendChild(icon);

  makeDesktopIconDraggable(icon);

  addDockIcon(app);
}

function addDockIcon(app) {
  const icon = document.createElement("div");
  icon.className = "dock-icon";
  icon.innerHTML = `
    <img src="${app.icon}" alt="${app.name}">
    <div class="dock-label">${app.name}</div>
  `;
  icon.addEventListener("click", () => openApp(app));
  dock.appendChild(icon);

  makeDockIconDraggable(icon);
}

// ---------------------------
// SEBASTIAN UNLOCK
// ---------------------------
function unlockSebastianTheme() {
  if (sebastianUnlocked) return;
  sebastianUnlocked = true;

  if (!themes.find(t => t.id === "sebastian")) {
    themes.push({ id: "sebastian", name: "Sebastian" });
  }

  applyTheme("sebastian");
  alert("Sebastian theme unlocked and added to Settings.");
}

// ---------------------------
// OPEN APP
// ---------------------------
function openApp(app) {
  if (app.type === "settings") {
    openSettingsWindow();
    return;
  }
  if (app.type === "about") {
    openAboutWindow();
    return;
  }
  if (app.type === "creator") {
    openCreatorWindow();
    return;
  }
  if (app.type === "store") {
    openStoreWindow();
    return;
  }
  if (app.type === "dynamic") {
    openDynamicApp(app);
    return;
  }

  const win = document.createElement("div");
  win.className = "window";
  win.style.left = "220px";
  win.style.top = "140px";
  win.style.zIndex = zIndexCounter++;

  const content =
    app.type === "iframe"
      ? `<iframe src="${app.url}"></iframe>`
      : `<div style="padding:16px;">Unknown app type</div>`;

  win.innerHTML = `
    <div class="window-header">
      <div class="controls">
        <div class="control-btn close"></div>
        <div class="control-btn minimize"></div>
        <div class="control-btn fullscreen"></div>
      </div>
      <span>${app.name}</span>
    </div>
    ${content}
  `;

  windowsContainer.appendChild(win);
  enableDragging(win);
  enableControls(win);
  showWindow(win);
}

function openDynamicApp(app) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.left = "230px";
  win.style.top = "150px";
  win.style.zIndex = zIndexCounter++;

  win.innerHTML = `
    <div class="window-header">
      <div class="controls">
        <div class="control-btn close"></div>
        <div class="control-btn minimize"></div>
        <div class="control-btn fullscreen"></div>
      </div>
      <span>${app.name}</span>
    </div>
    <iframe src="${app.url}"></iframe>
  `;

  windowsContainer.appendChild(win);
  enableDragging(win);
  enableControls(win);
  showWindow(win);
}

// ---------------------------
// SETTINGS
// ---------------------------
function openSettingsWindow() {
  const win = document.createElement("div");
  win.className = "window";
  win.style.left = "240px";
  win.style.top = "150px";
  win.style.zIndex = zIndexCounter++;

  win.innerHTML = `
    <div class="window-header">
      <div class="controls">
        <div class="control-btn close"></div>
        <div class="control-btn minimize"></div>
        <div class="control-btn fullscreen"></div>
      </div>
      <span>Settings</span>
    </div>
    <div class="settings-root">
      <div class="settings-sidebar">
        <h2>Settings</h2>
        <button class="settings-tab-btn active" data-tab="appearance">Appearance</button>
      </div>
      <div class="settings-content" id="settingsContent"></div>
    </div>
  `;

  windowsContainer.appendChild(win);
  enableDragging(win);
  enableControls(win);
  showWindow(win);

  initSettingsContent(win);
}

function initSettingsContent(win) {
  const content = win.querySelector("#settingsContent");
  renderAppearanceSettings(content);

  const tabBtn = win.querySelector(".settings-tab-btn[data-tab='appearance']");
  tabBtn.addEventListener("click", () => {
    tabBtn.classList.add("active");
    renderAppearanceSettings(content);
  });
}

function renderAppearanceSettings(container) {
  container.innerHTML = `
    <div class="settings-section-title">Appearance</div>
    <p>Choose a theme for Jason OS.</p>
    <div class="theme-grid">
      ${themes
        .map(
          t => `
        <div class="theme-card" data-theme="${t.id}">
          <div class="theme-name">${t.name}</div>
          <div class="theme-preview" style="${themePreviewStyle(t.id)}"></div>
        </div>
      `
        )
        .join("")}
    </div>

    <div class="settings-section-title" style="margin-top:18px;">Wallpaper</div>
    <p>Upload a custom wallpaper image.</p>
    <div class="wallpaper-upload">
      <input type="file" id="wallpaperInput" accept="image/*">
      <button id="clearWallpaperBtn" style="margin-left:8px;">Clear</button>
    </div>
  `;

  container.querySelectorAll(".theme-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-theme");
      applyTheme(id);
    });
  });

  const fileInput = container.querySelector("#wallpaperInput");
  const clearBtn = container.querySelector("#clearWallpaperBtn");

  fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      applyWallpaper(reader.result);
    };
    reader.readAsDataURL(file);
  });

  clearBtn.addEventListener("click", () => {
    applyWallpaper(null);
  });
}

function themePreviewStyle(id) {
  switch (id) {
    case "liquid-glass":
      return "background: radial-gradient(circle at top, #2b2f4f, #05060a);";
    case "amoled":
      return "background:#000;";
    case "light":
      return "background:#f5f5f7;";
    case "forest":
      return "background:linear-gradient(180deg,#0b3d2e,#02140f);";
    case "ocean":
      return "background:linear-gradient(180deg,#0b3a5d,#02101f);";
    case "night":
      return "background:radial-gradient(circle at top,#1b1f3b,#05060a);";
    case "jason":
      return "background:url('assets/wallpaper.png') center/cover no-repeat;";
    case "sebastian":
      return "background:url('assets/sebastian.png') center/cover no-repeat;";
    default:
      return "";
  }
}

// ---------------------------
// ABOUT (Sebastian unlock, no admin hint)
// ---------------------------
function openAboutWindow() {
  aboutClickCount++;
  if (aboutClickCount >= 20) {
    unlockSebastianTheme();
  }

  const win = document.createElement("div");
  win.className = "window";
  win.style.left = "260px";
  win.style.top = "170px";
  win.style.zIndex = zIndexCounter++;

  win.innerHTML = `
    <div class="window-header">
      <div class="controls">
        <div class="control-btn close"></div>
        <div class="control-btn minimize"></div>
        <div class="control-btn fullscreen"></div>
      </div>
      <span>About Jason OS</span>
    </div>
    <div style="padding:18px; font-size:14px;">
      <h2>Jason OS</h2>
      <p>A custom web OS with liquid glass visuals, themes, animations, a web app store, and a customizable desktop.</p>
      <p>Includes hidden features, secret themes, and advanced UI effects.</p>
    </div>
  `;

  windowsContainer.appendChild(win);
  enableDragging(win);
  enableControls(win);
  showWindow(win);
}

// ---------------------------
// WEB APP CREATOR
// ---------------------------
function openCreatorWindow() {
  const win = document.createElement("div");
  win.className = "window";
  win.style.left = "250px";
  win.style.top = "160px";
  win.style.zIndex = zIndexCounter++;

  win.innerHTML = `
    <div class="window-header">
      <div class="controls">
        <div class="control-btn close"></div>
        <div class="control-btn minimize"></div>
        <div class="control-btn fullscreen"></div>
      </div>
      <span>Web App Creator</span>
    </div>
    <div style="padding:18px; font-size:14px;">
      <p>Submit a web app to Jason OS. It will appear in the App Store after the owner approves it.</p>
      <div style="display:flex; flex-direction:column; gap:8px; max-width:320px;">
        <input id="creatorName" type="text" placeholder="App name" style="padding:6px 8px; border-radius:8px; border:none;">
        <input id="creatorUrl" type="text" placeholder="App URL (https://...)" style="padding:6px 8px; border-radius:8px; border:none;">
        <input id="creatorIcon" type="text" placeholder="Icon URL (optional)" style="padding:6px 8px; border-radius:8px; border:none;">
        <button id="creatorSubmit" style="margin-top:6px; padding:8px 14px; border-radius:999px; border:none; cursor:pointer; background:linear-gradient(135deg,#ff4ecd,#4e9bff); color:#fff;">Submit for Approval</button>
        <div id="creatorMessage" style="font-size:12px; min-height:16px; opacity:0.9;"></div>
      </div>
    </div>
  `;

  windowsContainer.appendChild(win);
  enableDragging(win);
  enableControls(win);
  showWindow(win);

  const nameInput = win.querySelector("#creatorName");
  const urlInput = win.querySelector("#creatorUrl");
  const iconInput = win.querySelector("#creatorIcon");
  const submitBtn = win.querySelector("#creatorSubmit");
  const msg = win.querySelector("#creatorMessage");

  submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const icon = iconInput.value.trim();

    if (!name || !url) {
      msg.textContent = "Name and URL are required.";
      msg.style.color = "#ff6b6b";
      return;
    }

    const pending = getPendingApps();
    pending.push({
      name,
      url,
      icon,
      submittedBy: currentUser ? currentUser.username : "unknown"
    });
    savePendingApps(pending);

    msg.textContent = "Submitted! Waiting for owner approval.";
    msg.style.color = "#a0ffb0";

    nameInput.value = "";
    urlInput.value = "";
    iconInput.value = "";
  });
}

// ---------------------------
// APP STORE
// ---------------------------
function openStoreWindow() {
  const win = document.createElement("div");
  win.className = "window";
  win.style.left = "260px";
  win.style.top = "170px";
  win.style.zIndex = zIndexCounter++;

  const customApps = getCustomApps();

  win.innerHTML = `
    <div class="window-header">
      <div class="controls">
        <div class="control-btn close"></div>
        <div class="control-btn minimize"></div>
        <div class="control-btn fullscreen"></div>
      </div>
      <span>App Store</span>
    </div>
    <div style="padding:18px; font-size:14px;">
      <p>Approved web apps for Jason OS.</p>
      <div id="storeList" style="display:flex; flex-wrap:wrap; gap:12px;"></div>
    </div>
  `;

  windowsContainer.appendChild(win);
  enableDragging(win);
  enableControls(win);
  showWindow(win);

  const list = win.querySelector("#storeList");

  if (!customApps.length) {
    list.innerHTML = `<div style="opacity:0.8;">No apps yet. Use Web App Creator to submit one.</div>`;
    return;
  }

  customApps.forEach(app => {
    const card = document.createElement("div");
    card.style.width = "140px";
    card.style.padding = "10px";
    card.style.borderRadius = "12px";
    card.style.background = "rgba(255,255,255,0.06)";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <div style="text-align:center;">
        <img src="${currentTheme === "sebastian" ? SEBASTIAN_ICON : (app.icon || DEFAULT_ICON)}" style="width:60px;height:60px;border-radius:16px;object-fit:cover;box-shadow:0 8px 20px rgba(0,0,0,0.5);">
        <div style="margin-top:6px;font-size:13px;">${app.name}</div>
      </div>
    `;
    card.addEventListener("click", () => {
      openDynamicApp({
        name: app.name,
        url: app.url
      });
    });
    list.appendChild(card);
  });
}

// ---------------------------
// DRAGGING WINDOWS + SNAP
// ---------------------------
function enableDragging(win) {
  const header = win.querySelector(".window-header");
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  header.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    dragging = true;
    win.style.zIndex = zIndexCounter++;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    const move = ev => {
      if (!dragging) return;
      win.style.left = ev.clientX - offsetX + "px";
      win.style.top = ev.clientY - offsetY + "px";
    };

    const up = ev => {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);

      snapWindow(win, ev.clientX, ev.clientY);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

function snapWindow(win, clientX, clientY) {
  const margin = 20;
  const w = window.innerWidth;
  const h = window.innerHeight;

  const nearTop = clientY <= margin;
  const nearLeft = clientX <= margin;
  const nearRight = clientX >= w - margin;

  if (nearTop) {
    // maximize
    win.style.left = "0px";
    win.style.top = "0px";
    win.style.width = w + "px";
    win.style.height = h + "px";
    win.classList.add("fullscreen-mode");
    return;
  }

  win.classList.remove("fullscreen-mode");
  win.style.width = "640px";
  win.style.height = "420px";

  if (nearLeft) {
    win.style.left = "0px";
    win.style.top = "0px";
    win.style.width = w / 2 + "px";
    win.style.height = h + "px";
  } else if (nearRight) {
    win.style.left = w / 2 + "px";
    win.style.top = "0px";
    win.style.width = w / 2 + "px";
    win.style.height = h + "px";
  }
}

// ---------------------------
// DRAGGING DESKTOP ICONS + SNAP TO GRID
// ---------------------------
function makeDesktopIconDraggable(icon) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  icon.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    dragging = true;
    icon.style.zIndex = zIndexCounter++;
    offsetX = e.clientX - icon.offsetLeft;
    offsetY = e.clientY - icon.offsetTop;

    const move = ev => {
      if (!dragging) return;
      icon.style.left = ev.clientX - offsetX + "px";
      icon.style.top = ev.clientY - offsetY + "px";
    };

    const up = () => {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);

      snapDesktopIcon(icon);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

function snapDesktopIcon(icon) {
  const x = icon.offsetLeft;
  const y = icon.offsetTop;

  const col = Math.round((x - DESKTOP_START_X) / DESKTOP_STEP_X);
  const row = Math.round((y - DESKTOP_START_Y) / DESKTOP_STEP_Y);

  const snappedX = DESKTOP_START_X + col * DESKTOP_STEP_X;
  const snappedY = DESKTOP_START_Y + row * DESKTOP_STEP_Y;

  icon.style.left = snappedX + "px";
  icon.style.top = snappedY + "px";
}

// ---------------------------
// DRAGGING DOCK ICONS (visual only)
// ---------------------------
function makeDockIconDraggable(icon) {
  let dragging = false;
  let startX = 0;

  icon.style.position = "relative";

  icon.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    dragging = true;
    startX = e.clientX;

    const move = ev => {
      if (!dragging) return;
      const dx = ev.clientX - startX;
      icon.style.transform = `translateX(${dx}px)`;
    };

    const up = () => {
      dragging = false;
      icon.style.transform = "";
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

// ---------------------------
// WINDOW CONTROLS
// ---------------------------
function enableControls(win) {
  win.querySelector(".close").onclick = () => win.remove();
  win.querySelector(".minimize").onclick = () => {
    win.style.display = "none";
    setTimeout(() => {
      win.style.display = "block";
      win.style.zIndex = zIndexCounter++;
      showWindow(win);
    }, 0);
  };
  win.querySelector(".fullscreen").onclick = () =>
    win.classList.toggle("fullscreen-mode");
}

// ---------------------------
// MISSION CONTROL
// ---------------------------
let missionControlActive = false;
let missionControlLayout = new Map(); // win -> {left, top, width, height}

function enterMissionControl() {
  if (missionControlActive) return;
  missionControlActive = true;
  document.body.classList.add("mission-control-active");
  missionControlOverlay.classList.remove("hidden");

  const wins = Array.from(document.querySelectorAll(".window"));
  if (!wins.length) return;

  missionControlLayout.clear();

  const cols = 3;
  const rows = Math.ceil(wins.length / cols);
  const padding = 40;
  const w = window.innerWidth;
  const h = window.innerHeight;

  const cellW = (w - padding * 2) / cols;
  const cellH = (h - padding * 2) / rows;

  wins.forEach((win, index) => {
    const rect = win.getBoundingClientRect();
    missionControlLayout.set(win, {
      left: win.offsetLeft,
      top: win.offsetTop,
      width: win.offsetWidth,
      height: win.offsetHeight
    });

    const col = index % cols;
    const row = Math.floor(index / cols);

    const targetLeft = padding + col * cellW + cellW * 0.05;
    const targetTop = padding + row * cellH + cellH * 0.05;
    const targetWidth = cellW * 0.9;
    const targetHeight = cellH * 0.9;

    win.style.left = targetLeft + "px";
    win.style.top = targetTop + "px";
    win.style.width = targetWidth + "px";
    win.style.height = targetHeight + "px";
  });

  missionControlOverlay.onclick = exitMissionControl;

  wins.forEach(win => {
    win.addEventListener("click", onMissionControlWindowClick, { once: true });
  });
}

function exitMissionControl() {
  if (!missionControlActive) return;
  missionControlActive = false;
  document.body.classList.remove("mission-control-active");
  missionControlOverlay.classList.add("hidden");

  missionControlLayout.forEach((pos, win) => {
    win.style.left = pos.left + "px";
    win.style.top = pos.top + "px";
    win.style.width = pos.width + "px";
    win.style.height = pos.height + "px";
  });

  missionControlLayout.clear();
}

function onMissionControlWindowClick(e) {
  if (!missionControlActive) return;
  e.stopPropagation();
  const win = e.currentTarget;
  exitMissionControl();
  win.style.zIndex = zIndexCounter++;
}

// keyboard: F3 to toggle, ESC to exit
document.addEventListener("keydown", e => {
  if (e.key === "F3") {
    if (missionControlActive) {
      exitMissionControl();
    } else {
      enterMissionControl();
    }
  }
  if (e.key === "Escape") {
    if (missionControlActive) {
      exitMissionControl();
    }
  }
});
