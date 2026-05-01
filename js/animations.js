// Dock magnification + slight bounce
document.addEventListener("mousemove", e => {
  const dock = document.getElementById("dock");
  if (!dock) return;
  const icons = dock.querySelectorAll(".dock-icon img");

  icons.forEach(icon => {
    const r = icon.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scale = Math.max(1, 1.4 - dist / 220);
    icon.style.transform = `scale(${scale})`;
    icon.style.filter = dist < 140 ? "brightness(1.1)" : "brightness(1)";
  });
});

document.addEventListener("click", e => {
  const icon = e.target.closest(".dock-icon img");
  if (!icon) return;
  icon.style.transform += " translateY(-8px)";
  setTimeout(() => {
    icon.style.transform = icon.style.transform.replace(" translateY(-8px)", "");
  }, 160);
});

// Fade-in windows when added
const windowsRoot = document.getElementById("windows");

const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.classList && node.classList.contains("window")) {
        node.style.opacity = 0;
        node.style.transform = "scale(0.96)";
        requestAnimationFrame(() => {
          node.style.transition = "opacity 0.18s ease-out, transform 0.18s ease-out";
          node.style.opacity = 1;
          node.style.transform = "scale(1)";
        });
      }
    });
  });
});

if (windowsRoot) {
  observer.observe(windowsRoot, { childList: true });
}