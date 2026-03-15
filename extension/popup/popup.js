const timerDisplay = document.getElementById('timer');
const startStopBtn = document.getElementById('start-stop');
const resetBtn = document.getElementById('reset');

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateUI(seconds, isRunning) {
  timerDisplay.textContent = formatTime(seconds);
  if (isRunning) {
    startStopBtn.textContent = 'Stop';
    startStopBtn.classList.add('running');
  } else {
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('running');
  }
}

// Listen for updates from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TIMER_UPDATE') {
    updateUI(message.seconds, message.isRunning);
  }
});

// Request initial state
chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
  if (response) {
    updateUI(response.seconds, response.isRunning);
  }
});

startStopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'TOGGLE_TIMER' });
});

resetBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'RESET_TIMER' });
});
