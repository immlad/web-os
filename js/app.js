document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // AUTH
  const userRaw = localStorage.getItem("jasonos_user");
  if (!userRaw) return (window.location.href = "boot/boot.html");
  const user = JSON.parse(userRaw);

  // TOPBAR
  document.getElementById("username").textContent = user.name;
  if (user.isAdmin) document.getElementById("admin-badge").classList.remove("hidden");

  // CLOCK
  function updateClock() {
    document.getElementById("clock").textContent =
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  updateClock();
  setInterval(updateClock, 30000);

  // WALLPAPER
  body.classList.add(`wallpaper-${user.wallpaper || "cloud"}`);

  // DESKTOP PHRASE
  const phrases = [
    "I am Iceman",
    "Ja makin me dinner mom?",
    "I am Fireman",
    "UwU Nyaa~ Jason"
  ];
  document.getElementById("phrase").textContent =
    phrases[Math.floor(Math.random() * phrases.length)];

  // WINDOW SYSTEM
  const windows = {};
  const z = { value: 50 };

  function createWindow(id, title, contentHTML) {
    if (windows[id]) return focus(windows[id]);

    const win = document.createElement("div");
    win.className = "window";
    win.dataset.id = id;

    win.innerHTML = `
      <div class="window-header" data-drag>
        <span>${title}</span>
        <div class="window-controls">
          <button class="win-close"></button>
          <button class="win-minimize"></button>
          <button class="win-fullscreen"></button>
        </div>
      </div>
      <div class="window-body">${contentHTML}</div>
    `;

    document.getElementById("windows").appendChild(win);
    windows[id] = win;

    // Position
    const rect = win.getBoundingClientRect();
    win.style.left = `${(window.innerWidth - rect.width) / 2}px`;
    win.style.top = `${80 + Math.random() * 40}px`;

    // Focus
    win.addEventListener("mousedown", () => focus(win));

    // Controls
    win.querySelector(".win-close").onclick = () => close(win);
    win.querySelector(".win-minimize").onclick = () => minimize(win);
    win.querySelector(".win-fullscreen").onclick = () => fullscreen(win);

    // Drag
    makeDraggable(win);

    // Resize
    makeResizable(win);

    focus(win);
  }

  function focus(win) {
    z.value++;
    win.style.zIndex = z.value;
    document.querySelectorAll(".window").forEach((w) => w.classList.remove("focused"));
    win.classList.add("focused");
  }

  function close(win) {
    delete windows[win.dataset.id];
    win.remove();
  }

  function minimize(win) {
    win.classList.add("minimized");
  }

  function fullscreen(win) {
    win.classList.toggle("fullscreen");
  }

  // DRAGGING
  function makeDraggable(win) {
    const header = win.querySelector("[data-drag]");
    let dragging = false;
    let sx, sy, sl, st;

    header.addEventListener("mousedown", (e) => {
      dragging = true;
      sx = e.clientX;
      sy = e.clientY;
      const rect = win.getBoundingClientRect();
      sl = rect.left;
      st = rect.top;
      focus(win);
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      win.style.left = `${sl + (e.clientX - sx)}px`;
      win.style.top = `${st + (e.clientY - sy)}px`;
    });

    document.addEventListener("mouseup", () => (dragging = false));
  }

  // RESIZE
  function makeResizable(win) {
    const edges = ["left", "right", "top", "bottom"];
    edges.forEach((edge) => {
      const div = document.createElement("div");
      div.className = `resize-${edge}`;
      win.appendChild(div);

      let resizing = false;
      let sx, sy, sw, sh, sl, st;

      div.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        resizing = true;
        sx = e.clientX;
        sy = e.clientY;

        const rect = win.getBoundingClientRect();
        sw = rect.width;
        sh = rect.height;
        sl = rect.left;
        st = rect.top;

        focus(win);
      });

      document.addEventListener("mousemove", (e) => {
        if (!resizing) return;

        const dx = e.clientX - sx;
        const dy = e.clientY - sy;

        if (edge === "right") win.style.width = `${sw + dx}px`;
        if (edge === "bottom") win.style.height = `${sh + dy}px`;
        if (edge === "left") {
          win.style.width = `${sw - dx}px`;
          win.style.left = `${sl + dx}px`;
        }
        if (edge === "top") {
          win.style.height = `${sh - dy}px`;
          win.style.top = `${st + dy}px`;
        }
      });

      document.addEventListener("mouseup", () => (resizing = false));
    });
  }

  // DOCK
  document.querySelectorAll(".dock-item").forEach((item) => {
    item.onclick = () => {
      const app = item.dataset.app;

      if (app === "logout") {
        localStorage.removeItem("jasonos_user");
        return (window.location.href = "boot/boot.html");
      }

      if (app === "chat") {
        createWindow(
          "chat",
          "Liquid Aura",
          `<iframe src="https://immlad.github.io/liquid-aura/#/app/?user=${encodeURIComponent(
            user.name
          )}&admin=${user.isAdmin}&theme=${user.theme}&avatar=default" style="width:100%;height:100%;border:none;"></iframe>`
        );
        return;
      }

      if (app === "settings") {
        createWindow(
          "settings",
          "Settings",
          `
            <div class="settings-body">
              <h2>Appearance</h2>
              <div class="settings-row">
                <div>
                  <h3>Theme</h3>
                  <button class="settings-theme-btn" data-theme="cloud">Cloud</button>
                  <button class="settings-theme-btn" data-theme="night">Night</button>
                  <button class="settings-theme-btn" data-theme="forest">Forest</button>
                  <button class="settings-theme-btn" data-theme="jason">JASON</button>
                  <button class="settings-theme-btn" data-theme="sebastian">Sebastian</button>
                </div>
                <div>
                  <h3>Wallpaper</h3>
                  <button class="settings-wallpaper-btn" data-wallpaper="cloud">Cloud</button>
                  <button class="settings-wallpaper-btn" data-wallpaper="night">Night</button>
                  <button class="settings-wallpaper-btn" data-wallpaper="forest">Forest</button>
                  <button class="settings-wallpaper-btn" data-wallpaper="jason">JASON</button>
                  <button class="settings-wallpaper-btn" data-wallpaper="sebastian">Sebastian</button>
                </div>
              </div>

              <h2>System</h2>
              <button id="settings-cloak-btn">Cloak Desktop</button>
              <button id="settings-reload-btn">Reload OS</button>
            </div>
          `
        );
        attachSettingsLogic();
        return;
      }

      if (app === "admin") {
        createWindow(
          "admin",
          "Admin Panel",
          `
            <div class="admin-body">
              ${
                user.isAdmin
                  ? `
                <h2>Broadcast Message</h2>
                <input id="admin-message-input" placeholder="Message" />
                <button id="admin-broadcast-btn">Send</button>

                <h2>Ban / Unban User</h2>
                <input id="admin-target-name" placeholder="Username" />
                <button id="admin-ban-btn">Ban</button>
                <button id="admin-unban-btn">Unban</button>
              `
                  : `<p>You are not an admin.</p>`
              }
            </div>
          `
        );
        attachAdminLogic();
        return;
      }

      if (app === "about") {
        createWindow(
          "about",
          "About JASON OS",
          `
            <div class="settings-body">
              <h2>JASON OS – Tahoe</h2>
              <p>Custom OS by Minh.</p>
              <p>Liquid glass, snapping, dock, and more.</p>
            </div>
          `
        );
        return;
      }
    };
  });

  // DOCK MAGNIFICATION
  const dock = document.getElementById("dock");
  const dockItems = document.querySelectorAll(".dock-item");

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

  // SETTINGS LOGIC
  function attachSettingsLogic() {
    document.querySelectorAll(".settings-theme-btn").forEach((btn) => {
      btn.onclick = () => {
        user.theme = btn.dataset.theme;
        localStorage.setItem("jasonos_user", JSON.stringify(user));
        window.location.reload();
      };
    });

    document.querySelectorAll(".settings-wallpaper-btn").forEach((btn) => {
      btn.onclick = () => {
        user.wallpaper = btn.dataset.wallpaper;
        localStorage.setItem("jasonos_user", JSON.stringify(user));
        window.location.reload();
      };
    });

    document.getElementById("settings-cloak-btn").onclick = () => {
      body.classList.toggle("cloaked");
    };

    document.getElementById("settings-reload-btn").onclick = () => {
      window.location.reload();
    };
  }

  // ADMIN LOGIC
  function attachAdminLogic() {
    if (!user.isAdmin) return;

    const msgInput = document.getElementById("admin-message-input");
    const msgBtn = document.getElementById("admin-broadcast-btn");

    msgBtn.onclick = () => {
      localStorage.setItem("jasonos_global_message", msgInput.value.trim());
      renderGlobalMessage();
    };

    const banInput = document.getElementById("admin-target-name");
    const banBtn = document.getElementById("admin-ban-btn");
    const unbanBtn = document.getElementById("admin-unban-btn");

    banBtn.onclick = () => {
      const banned = JSON.parse(localStorage.getItem("jasonos_banned") || "[]");
      banned.push(banInput.value.trim().toLowerCase());
      localStorage.setItem("jasonos_banned", JSON.stringify(banned));
    };

    unbanBtn.onclick = () => {
      let banned = JSON.parse(localStorage.getItem("jasonos_banned") || "[]");
      banned = banned.filter((u) => u !== banInput.value.trim().toLowerCase());
      localStorage.setItem("jasonos_banned", JSON.stringify(banned));
    };
  }

  // GLOBAL MESSAGE
  function renderGlobalMessage() {
    const msg = localStorage.getItem("jasonos_global_message");
    const el = document.getElementById("global-message");

    if (msg && msg.trim()) {
      el.textContent = `Admin: ${msg}`;
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  }

  renderGlobalMessage();
});