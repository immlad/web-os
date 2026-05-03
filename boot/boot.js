(function () {
  const tabs = document.querySelectorAll(".tab");
  const form = document.getElementById("boot-form");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const error = document.getElementById("error");
  const adminToggle = document.getElementById("admin-toggle");
  const adminCheckbox = document.getElementById("admin-checkbox");
  const submitBtn = document.getElementById("submit-btn");

  let mode = "login";

  function setMode(m) {
    mode = m;
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === m));
    adminToggle.classList.toggle("hidden", m !== "signup");
    submitBtn.textContent = m === "signup" ? "Create Account" : "Login";
    error.classList.add("hidden");
  }

  tabs.forEach((t) =>
    t.addEventListener("click", () => setMode(t.dataset.mode))
  );

  function loadUsers() {
    return JSON.parse(localStorage.getItem("jasonos_users") || "[]");
  }

  function saveUsers(users) {
    localStorage.setItem("jasonos_users", JSON.stringify(users));
  }

  function showError(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = username.value.trim();
    const pass = password.value.trim();

    if (!name || !pass) {
      showError("Enter username and password.");
      return;
    }

    const users = loadUsers();

    if (mode === "signup") {
      if (users.some((u) => u.name.toLowerCase() === name.toLowerCase())) {
        showError("User already exists.");
        return;
      }

      const newUser = {
        name,
        password: pass,
        isAdmin: adminCheckbox.checked,
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
          u.name.toLowerCase() === name.toLowerCase() &&
          u.password === pass
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