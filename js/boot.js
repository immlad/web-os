const bootBarFill = document.getElementById("bootBarFill");
const bootLog = document.getElementById("bootLog");

const steps = [
  "Loading kernel modules...",
  "Mounting Jason filesystem...",
  "Starting liquid glass compositor...",
  "Spawning Jason processes...",
  "Finalizing boot sequence..."
];

let i = 0;

function nextStep() {
  if (i < steps.length) {
    bootLog.textContent = steps[i];
    bootBarFill.style.width = ((i + 1) / steps.length) * 100 + "%";
    i++;
    setTimeout(nextStep, 500);
  } else {
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 400);
  }
}

nextStep();