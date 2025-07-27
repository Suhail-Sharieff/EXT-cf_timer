let currentProblem = null;
let timerInterval = null;
let startTime = null;

function isCodeforcesProblem(url) {
  return /^https?:\/\/(?:[\w-]+\.)?codeforces\.com\/(?:contest\/\d+\/problem\/[A-Z]|problemset\/problem\/\d+)/.test(url);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && isCodeforcesProblem(tab.url)) {
    startTimer(tab.url);
    chrome.tabs.sendMessage(tabId, { type: "SHOW_TIMER" });
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let tab = await chrome.tabs.get(activeInfo.tabId);
  if (!isCodeforcesProblem(tab.url)) pauseTimer();
});

function startTimer(url) {
  currentProblem = url;
  startTime = Date.now();
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function pauseTimer() {
  if (!currentProblem || !startTime) return;
  let duration = Date.now() - startTime;
  chrome.storage.local.get([currentProblem], (data) => {
    let previous = data[currentProblem]?.totalTimeSpent || 0;
    chrome.storage.local.set({
      [currentProblem]: { totalTimeSpent: previous + duration }
    });
  });
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = null;
}

function updateTimer() {
  if (!currentProblem || !startTime) return;
  chrome.storage.local.set({ "__last_tick__": Date.now() });
}
