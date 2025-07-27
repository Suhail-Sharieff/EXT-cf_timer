chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "RESET_TIMER") {
    resetTimer();
  }
});

let interval;

function resetTimer() {
  const key = "cf-timer-start-" + window.location.pathname;
  const newStart = Date.now();
  localStorage.setItem(key, newStart);
}

function injectTimer() {
  const existing = document.getElementById("cf-timer");
  if (existing) return;

  const problemStatement = document.querySelector(".problem-statement");
  if (!problemStatement) {
    setTimeout(injectTimer, 500);
    return;
  }

  const h2 = problemStatement.querySelector("h2");

  const timerDiv = document.createElement("div");
  timerDiv.id = "cf-timer";
  timerDiv.style.cssText = `
    margin: 10px 0;
    padding: 4px 8px;
    font-size: 14px;
    font-family: monospace;
    background: #f0f0f0;
    border: 1px solid #ccc;
    display: inline-block;
  `;
  timerDiv.textContent = "⏰: 00:00:00";

  if (h2 && h2.nextSibling) {
    h2.parentNode.insertBefore(timerDiv, h2.nextSibling);
  } else {
    problemStatement.prepend(timerDiv);
  }

  const key = "cf-timer-start-" + window.location.pathname;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, Date.now());
  }

  if (interval) clearInterval(interval);
  interval = setInterval(() => {
    const start = parseInt(localStorage.getItem(key), 10);
    const now = Date.now();
    const elapsed = Math.floor((now - start) / 1000);
    const timerDiv = document.getElementById("cf-timer");
    if (timerDiv) {
      timerDiv.textContent = "⏰: " + formatTime(elapsed);
    }
  }, 1000);
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map(t => String(t).padStart(2, '0')).join(':');
}

injectTimer();
