document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const savedTheme = localStorage.getItem("jasonos_theme") || "cloud";
  body.classList.add(`theme-${savedTheme}`);

  const form = document.getElementById("boot-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("boot-name").value.trim();
    const password = document.getElementById("boot-password").value;

    if (!name || !password) return;

    const lower = name.toLowerCase();

    // TRUE ADMINS
    const isTrueAdmin = (lower === "minh" || lower === "jason");

    // Promoted admins
    const adminRaw = localStorage.getItem("jasonos_admin_names");
    const adminNames = adminRaw ? JSON.parse(adminRaw) : [];

    const isAdmin = isTrueAdmin || adminNames.includes(lower);

    const user = {
      name,
      isAdmin,
      createdAt: Date.now()
    };

    localStorage.setItem("jasonos_user", JSON.stringify(user));
    window.location.href = "../index.html";
  });
});