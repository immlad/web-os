document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("jasonos_theme") || "cloud";
  document.body.classList.add(`theme-${savedTheme}`);

  const signupScreen = document.getElementById("signup-screen");
  const loginScreen = document.getElementById("login-screen");

  const goLogin = document.getElementById("go-login");
  const goSignup = document.getElementById("go-signup");

  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  const existingUser = JSON.parse(localStorage.getItem("jasonos_user"));

  // Show correct screen
  if (existingUser) {
    loginScreen.classList.remove("hidden");
  } else {
    signupScreen.classList.remove("hidden");
  }

  // Switch screens
  goLogin?.addEventListener("click", () => {
    signupScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  });

  goSignup?.addEventListener("click", () => {
    loginScreen.classList.add("hidden");
    signupScreen.classList.remove("hidden");
  });

  // TRUE ADMINS
  function isTrueAdmin(name) {
    const lower = name.toLowerCase();
    return lower === "minh" || lower === "jason";
  }

  // SIGNUP
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signup-name").value.trim();
    const password = document.getElementById("signup-password").value;

    const user = {
      name,
      password,
      isAdmin: isTrueAdmin(name),
      createdAt: Date.now()
    };

    localStorage.setItem("jasonos_user", JSON.stringify(user));
    window.location.href = "../index.html";
  });

  // LOGIN
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value;

    if (!existingUser) {
      alert("No account exists. Please sign up.");
      return;
    }

    if (name !== existingUser.name || password !== existingUser.password) {
      alert("Incorrect name or password.");
      return;
    }

    // Restore admin status
    existingUser.isAdmin = isTrueAdmin(name);
    localStorage.setItem("jasonos_user", JSON.stringify(existingUser));

    window.location.href = "../index.html";
  });
});