(function () {
  const tabs = Array.from(document.querySelectorAll(".boot-tab"));
  const form = document.getElementById("boot-form");
  const usernameInput = document.getElementById("boot-username");
  const passwordInput = document.getElementById("boot-password");
  const errorEl = document.getElementById("boot-error");
  const adminToggle = document.getElementById("boot-admin-toggle");
  const adminCheckbox = document.getElementById("boot-admin-checkbox");
  const submitBtn = document.getElementById("boot-submit-btn");

  let mode = "login";

  function setMode(next) {
    mode = next;
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
    errorEl.classList.add("hidden");
    if (mode === "signup") {
      submitBtn.textContent = "Create Account";
      adminToggle.classList.remove("hidden");
    } else {
      submitBtn.textContent = "Login";
      adminToggle.classList.add("hidden");
    }
  }

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => setMode(tab.dataset.mode))
  );

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem("jasonos_users") || "[]");
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem("jasonos_users", JSON.stringify(users));
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showError("Enter username and password.");
      return;
    }

    const users = loadUsers();

    if (mode === "signup") {
      if (users.some((u) => u.name.toLowerCase() === username.toLowerCase())) {
        showError("User already exists.");
        return;
      }
      const newUser = {
        name: username,
        password,
        isAdmin: !!adminCheckbox.checked,
        theme: "cloud",
        wallpaper: "cloud"
      };
      users.push(newUser);
      saveUsers(users);
      localStorage.setItem("jasonos_user", JSON.stringify(newUser));
      window.location.href = "../index.html";
      return;
    }

    if (mode === "login") {
      const found = users.find(
        (u) =>
          u.name.toLowerCase() === username.toLowerCase() &&
          u.password === password
      );
      if (!found) {
        showError("Invalid username or password.");
        return;
      }
      localStorage.setItem("jasonos_user", JSON.stringify(found));
      window.location.href = "../index.html";
    }
  });
})();