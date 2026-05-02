document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("boot-form");
  const tabs = document.querySelectorAll(".boot-tab");
  const confirmField = document.getElementById("boot-confirm");
  const subtitle = document.getElementById("boot-subtitle");
  const nameInput = document.getElementById("boot-name");
  const emailInput = document.getElementById("boot-email");
  const submitBtn = document.getElementById("boot-submit");

  let mode = "signin";

  // If user already exists, show quick hint
  const existingUserRaw = localStorage.getItem("jasonos_user");
  if (existingUserRaw) {
    try {
      const existingUser = JSON.parse(existingUserRaw);
      if (existingUser && existingUser.name) {
        subtitle.textContent = `Welcome back, ${existingUser.name}.`;
        nameInput.value = existingUser.name;
        emailInput.value = existingUser.email || "";
      }
    } catch {
      // ignore
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      mode = tab.dataset.mode;

      if (mode === "signup") {
        confirmField.classList.remove("hidden");
        confirmField.required = true;
        submitBtn.textContent = "Create account";
      } else {
        confirmField.classList.add("hidden");
        confirmField.required = false;
        submitBtn.textContent = "Continue";
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = document.getElementById("boot-password").value;
    const confirm = confirmField.value;

    if (!name || !email || !password) return;

    if (mode === "signup" && password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    const user = { name, email, createdAt: Date.now() };
    localStorage.setItem("jasonos_user", JSON.stringify(user));

    window.location.href = "../index.html";
  });
});