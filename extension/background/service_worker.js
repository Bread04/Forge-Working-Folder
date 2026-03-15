let timerSeconds = 0;
let isRunning = false;
let socket = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("FocusFlow Enforcer Installed");
});

function connectWebSocket() {
  socket = new WebSocket("ws://localhost:8000/api/ws/focus");
  
  socket.onopen = () => {
    console.log("Connected to backend focus sync");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "SYNC_TIMER") {
      timerSeconds = data.seconds;
      isRunning = data.isRunning;
      broadcastState();
    }
  };

  socket.onclose = () => {
    setTimeout(connectWebSocket, 5000);
  };
}

connectWebSocket();

function broadcastState() {
  chrome.runtime.sendMessage({ 
    type: "TIMER_UPDATE", 
    seconds: timerSeconds, 
    isRunning: isRunning 
  });
  
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: "SYNC_TIMER",
      seconds: timerSeconds,
      isRunning: isRunning
    }));
  }
}

chrome.alarms.create("pulse", { periodInMinutes: 0.01666 }); // Every second roughly

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pulse" && isRunning) {
    timerSeconds++;
    broadcastState();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_STATE") {
    sendResponse({ seconds: timerSeconds, isRunning: isRunning });
  } else if (message.type === "TOGGLE_TIMER") {
    isRunning = !isRunning;
    broadcastState();
  } else if (message.type === "RESET_TIMER") {
    timerSeconds = 0;
    isRunning = false;
    broadcastState();
  }
});
