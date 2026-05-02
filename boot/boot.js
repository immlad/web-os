// ======================================================
// Jason OS – Windows 11 Gaming Edition Boot Script
// ======================================================

window.addEventListener("load", () => {
  const bar = document.getElementById("boot-bar");

  let progress = 0;
  const speed = 18; // smooth Windows-style speed

  const interval = setInterval(() => {
    progress += Math.random() * 8; // natural Windows-like increments

    if (progress >= 100) {
      progress = 100;
      bar.style.width = progress + "%";
      clearInterval(interval);

      setTimeout(() => {
        document.body.style.opacity = "0";
        document.body.style.transition = "0.6s ease";

        setTimeout(() => {
          window.location.href = "../index.html";
        }, 600);

      }, 350);
    } else {
      bar.style.width = progress + "%";
    }
  }, speed);
});