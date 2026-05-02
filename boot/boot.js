const ADMIN_PASSWORD = "JASONDABEST";

window.addEventListener("load", () => {
  const bootScreen = document.getElementById("boot-screen");
  const authScreen = document.getElementById("auth-screen");

  const loginBox = document.getElementById("login-box");
  const signupBox = document.getElementById("signup-box");

  const goSignup = document.getElementById("go-signup");
  const goLogin = document.getElementById("go-login");

  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  const loginUser = document.getElementById("login-user");
  const loginPass = document.getElementById("login-pass");
  const loginError = document.getElementById("login-error");

  const signupUser = document.getElementById("signup-user");
  const signupPass = document.getElementById("signup-pass");
  const signupError = document.getElementById("signup-error");

  // Boot animation
  const bar = document.querySelector(".boot-bar");
  let progress = 0;

  const interval = setInterval(() => {
    progress += 2;
    bar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);

      const session = localStorage.getItem("jason_session");
      if (session) {
        window.location.href = "../index.html";
        return;
      }

      bootScreen.classList.add("hidden");
      authScreen.classList.remove("hidden");
    }
  }, 40);

  // Switch to signup
  goSignup.addEventListener("click", () => {
    loginBox.classList.add("hidden");
    signupBox.classList.remove("hidden");
  });

  // Switch to login
  goLogin.addEventListener("click", () => {
    signupBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
  });

  // Signup
  signupBtn.addEventListener("click", () => {
    const user = signupUser.value.trim();
    const pass = signupPass.value.trim();

    if (!user || !pass) {
      signupError.textContent = "All fields required.";
      return;
    }

    let accounts = JSON.parse(localStorage.getItem("jason_accounts") || "{}");

    if (accounts[user]) {
      signupError.textContent = "Username already exists.";
      return;
    }

    accounts[user] = pass;
    localStorage.setItem("jason_accounts", JSON.stringify(accounts));

    signupError.textContent = "";
    signupUser.value = "";
    signupPass.value = "";

    signupBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
  });

  // Login
  loginBtn.addEventListener("click", () => {
    const user = loginUser.value.trim();
    const pass = loginPass.value.trim();

    // Admin shortcut
    if (pass === ADMIN_PASSWORD) {
      sessionStorage.setItem("jason_admin", "true");
      localStorage.setItem("jason_session", user || "Admin");
      window.location.href = "../index.html";
      return;
    }

    let accounts = JSON.parse(localStorage.getItem("jason_accounts") || "{}");

    if (!accounts[user] || accounts[user] !== pass) {
      loginError.textContent = "Invalid username or password.";
      return;
    }

    localStorage.setItem("jason_session", user);

    // Username-based admin
    if (user.toLowerCase() === "minh" || user.toLowerCase() === "jason") {
      sessionStorage.setItem("jason_admin", "true");
    } else {
      sessionStorage.removeItem("jason_admin");
    }

    window.location.href = "../index.html";
  });
});