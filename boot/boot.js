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

    const bannedRaw = localStorage.getItem("jasonos_banned_names");
    const bannedNames = bannedRaw ? JSON.parse(bannedRaw) : [];
    if (bannedNames.includes(lower)) {
      alert("This user is banned from JASON OS.");
      return;
    }

    const adminRaw = localStorage.getItem("jasonos_admin_names");
    const adminNames = adminRaw ? JSON.parse(adminRaw) : [];

    const isDefaultAdmin = ["minh", "jason"].includes(lower);
    const isPromotedAdmin = adminNames.includes(lower);

    const user = {
      name,
      isAdmin: isDefaultAdmin || isPromotedAdmin,
      createdAt: Date.now()
    };

    localStorage.setItem("jasonos_user", JSON.stringify(user));
    window.location.href = "../index.html";
  });
});