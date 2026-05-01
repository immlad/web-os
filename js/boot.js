const fill = document.querySelector(".boot-bar-fill");
let progress = 0;

const interval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 600);
  }
  fill.style.width = progress + "%";
}, 280);