document.addEventListener("DOMContentLoaded", () => {
  // Apply saved theme to boot background
  const body = document.body;
  const savedTheme = localStorage.getItem("jasonos_theme") || "cloud";
  body.classList.add(`theme-${savedTheme}`);

  const form = document.getElementById("boot-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("boot-name").value.trim();
    const password = document.getElementById("boot-password").value;

    if (!name || !password) return;

    const isAdmin = ["minh", "jason"].includes(name.toLowerCase());

    const user = {
      name,
      isAdmin,
      createdAt: Date.now()
    };

    localStorage.setItem("jasonos_user", JSON.stringify(user));
    window.location.href = "../index.html";
  });
});