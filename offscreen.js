setInterval(() => {
  chrome.runtime.sendMessage({ type: "KEEP_ALIVE" });
}, 25000); // ping every 25 seconds
