document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("jasonos_theme") || "cloud";
  document.body.classList.add(`theme-${savedTheme}`);

  const signupScreen = document.getElementById("signup-screen");
  const loginScreen = document.getElementById("login-screen");

  const goLogin = document.getElementById("go-login");
  const goSignup = document.getElementById("go-signup");

  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  // Load accounts list (ALWAYS fresh)
  function loadAccounts() {
    return JSON.parse(localStorage.getItem("jasonos_accounts") || "[]");
  }

  function saveAccounts(list) {
    localStorage.setItem("jasonos_accounts", JSON.stringify(list));
  }

  let accounts = loadAccounts();

  // Show correct screen
  if (accounts.length > 0) {
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

    accounts = loadAccounts(); // refresh

    const name = document.getElementById("signup-name").value.trim();
    const password = document.getElementById("signup-password").value;

    // Check if username exists
    if (accounts.some(acc => acc.name.toLowerCase() === name.toLowerCase())) {
      alert("This username is already taken.");
      return;
    }

    const newUser = {
      name,
      password,
      isAdmin: isTrueAdmin(name),
      createdAt: Date.now()
    };

    accounts.push(newUser);
    saveAccounts(accounts);

    alert("Account created! Please log in.");

    signupScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  });

  // LOGIN
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    accounts = loadAccounts(); // refresh

    const name = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value;

    const account = accounts.find(acc => acc.name.toLowerCase() === name.toLowerCase());

    if (!account) {
      alert("No account exists with that name.");
      return;
    }

    if (account.password !== password) {
      alert("Incorrect name or password.");
      return;
    }

    // Restore admin status
    account.isAdmin = isTrueAdmin(name);

    localStorage.setItem("jasonos_user", JSON.stringify(account));

    window.location.href = "../index.html";
  });
});