window.addEventListener("load", () => {
  const bar = document.querySelector(".boot-bar");
  let progress = 0;

  const interval = setInterval(() => {
    progress += 2;
    bar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 400);
    }
  }, 40);
});