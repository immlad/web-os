const loginScreen = document.getElementById("loginScreen");
const desktopEl = document.getElementById("desktop");
const dock = document.getElementById("dock");
const windowsContainer = document.getElementById("windows");
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("passwordInput");
const loginTagline = document.getElementById("loginTagline");
const desktopTagline = document.getElementById("desktopTagline");
const statusClock = document.getElementById("statusClock");

let zIndexCounter = 10;

// Taglines
const taglines = [
  "JASON JASON JASON",
  "Best OS EVAAAA",
  "J.A.S.O.N",
  "JASON ISN'T GAYYY",
  "JASON",
  "I am Iceman"
];

function randomTagline() {
  return taglines[Math.floor(Math.random() * taglines.length)];
}

// Rotate tagline on login screen
loginTagline.textContent = randomTagline();
setInterval(() => {
  loginTagline.textContent = randomTagline();
}, 2500);

// Desktop tagline
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

// Simple login (no real auth)
loginBtn.addEventListener("click", () => {
  loginScreen.classList.add("hidden");
  desktopEl.classList.remove("hidden");
  dock.classList.remove("hidden");
  windowsContainer.classList.remove("hidden");

  initDesktop();
});

passwordInput.addEventListener("keydown", e => {
  if (e.key === "Enter") loginBtn.click();
});

// ---------------------------
// THEMES + WALLPAPER (with persistence)
// ---------------------------
const themes = [
  { id: "liquid-glass", name: "Liquid Glass" },
  { id: "amoled", name: "AMOLED" },
  { id: "light", name: "Light" },
  { id: "forest", name: "Forest" },
  { id: "ocean", name: "Ocean" },
  { id: "night", name: "Night" },
  { id: "jason", name: "Jason" }
];

let currentTheme = localStorage.getItem("jason_theme") || "liquid-glass";
let customWallpaperURL = localStorage.getItem("jason_wallpaper") || null;

function applyTheme(id) {
  document.body.classList.remove(
    "theme-liquid-glass",
    "theme-amoled",
    "theme-light",
    "theme-forest",
    "theme-ocean",
    "theme-night",
    "theme-jason"
  );
  document.body.classList.add("theme-" + id);
  currentTheme = id;
  localStorage.setItem("jason_theme", id);

  // Jason theme: force everything to the person picture
  if (id === "jason") {
    applyWallpaper("assets/favicon.ico");
  }
}

function applyWallpaper(url) {
  if (url) {
    customWallpaperURL = url;
    document.body.classList.add("has-custom-wallpaper");
    document.body.style.setProperty("--wallpaper-url", `url('${url}')`);
    localStorage.setItem("jason_wallpaper", url);
  } else {
    customWallpaperURL = null;
    document.body.classList.remove("has-custom-wallpaper");
    document.body.style.removeProperty("--wallpaper-url");
    localStorage.removeItem("jason_wallpaper");
  }
}

// default theme + wallpaper
applyTheme(currentTheme);
if (customWallpaperURL && currentTheme !== "jason") {
  applyWallpaper(customWallpaperURL);
}

// ---------------------------
// APPS CONFIG
// ---------------------------
const apps = [
  {
    name: "Settings",
    type: "settings",
    icon: "assets/favicon.ico"
  },
  {
    name: "Music",
    type: "iframe",
    url: "https://vapor.onl/page/music",
    icon: "assets/favicon.ico"
  },
  {
    name: "About Jason",
    type: "about",
    icon: "assets/favicon.ico"
  }
];

// ---------------------------
// INIT DESKTOP ICONS + DOCK
// ---------------------------
function initDesktop() {
  let x = 40;
  let y = 160;
  const stepY = 120;

  apps.forEach(app => {
    addDesktopApp(app, x, y);
    y += stepY;
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
  icon.onclick = () => openApp(app);
  desktopEl.appendChild(icon);

  addDockIcon(app);
}

function addDockIcon(app) {
  const icon = document.createElement("div");
  icon.className = "dock-icon";
  icon.innerHTML = `<img src="${app.icon}" alt="${app.name}">`;
  icon.onclick = () => openApp(app);
  dock.appendChild(icon);
}

// ---------------------------
// CREATE WINDOW
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
}

// ---------------------------
// SETTINGS WINDOW
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
      // If Jason theme is active, still let user override with their own chaos
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
      return "background:url('assets/favicon.ico') center/cover no-repeat;";
    default:
      return "";
  }
}

// ---------------------------
// ABOUT WINDOW
// ---------------------------
function openAboutWindow() {
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
      <p>Jason</p>
      <p>Features:</p>
      <ul>
        <li>Boot system</li>
        <li>Login screen</li>
        <li>macOS-style</li>
        <li>Theme engine + custom wallpaper</li>
        <li>Jason theme that uses your picture everywhere</li>
        <li>Music app powered by vapor.onl</li>
      </ul>
    </div>
  `;

  windowsContainer.appendChild(win);
  enableDragging(win);
  enableControls(win);
}

// ---------------------------
// DRAGGING (instant)
// ---------------------------
function enableDragging(win) {
  const header = win.querySelector(".window-header");
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  header.addEventListener("mousedown", e => {
    dragging = true;
    win.style.zIndex = zIndexCounter++;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    const move = ev => {
      if (!dragging) return;
      win.style.left = ev.clientX - offsetX + "px";
      win.style.top = ev.clientY - offsetY + "px";
    };

    const up = () => {
      dragging = false;
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
    }, 0);
  };
  win.querySelector(".fullscreen").onclick = () =>
    win.classList.toggle("fullscreen-mode");
}