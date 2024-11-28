const LIGHT_COLORS = ['red', 'green', 'blue']
const LIGHT_RGB_COLORS = ['255, 0, 0', '0, 255, 0', '0, 0, 255']

let ws_read = new WebSocket('ws://localhost:8000/ws/read');
ws_read.onmessage = function(event) {
    console.log(event.data);
    handleMessage(event.data);
};

let ws_send = new WebSocket('ws://localhost:8000/ws/send');
function sendMessage() {
    const message = document.getElementById('message').value;
    if (ws_send.readyState === WebSocket.OPEN)
        ws_send.send(message);
}

function handleMessage(message) {
    let parsedMessage = JSON.parse(message);
    switch(parsedMessage['type']) {
        case 'lightOutput':
            drawLightOnSequenceIndicator(parsedMessage['lightId']);
            break;
        case 'lightInput':
            drawLightOnUserInputs(parsedMessage['lightId']);
            break;
    }
    addLogMessage(message, 'OUTPUT');
}

//RESHAPE CANVASES
function reshapeSeqIndicatorCanvas() {
    let seqIndicatorCanvas = document.getElementById('seq-indicator-canvas');
    let seqIndicatorImage = document.getElementById('seq-indicator-img');
    seqIndicatorCanvas.width = seqIndicatorImage.width;
    seqIndicatorCanvas.height = seqIndicatorImage.height;
}

function reshapeUserInputsCanvas() {
    let userInputsCanvas = document.getElementById('user-inputs-canvas');
    let userInputsImage = document.getElementById('user-inputs-img');
    userInputsCanvas.width = userInputsImage.width;
    userInputsCanvas.height = userInputsImage.height;
}

// SEQUENCE INDICATOR
function drawLightOnSequenceIndicator(lightId) {
    reshapeSeqIndicatorCanvas();
    let lightRgbColor = LIGHT_RGB_COLORS[lightId];
    let seqIndicatorCanvas = document.getElementById('seq-indicator-canvas');
    let ctx = seqIndicatorCanvas.getContext('2d');
    let radius = 100
    let x = seqIndicatorCanvas.width * 0.75;
    let y = seqIndicatorCanvas.height * 0.53;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    
    gradient.addColorStop(0, 'rgba(' + lightRgbColor + ',1.0)');   // Fully transparent at the center
    gradient.addColorStop(0.7, 'rgba(' + lightRgbColor + ',0.5)'); // Semi-transparent midway
    gradient.addColorStop(1, 'rgba(' + lightRgbColor + ',0.0)');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    setTimeout((ctx) => {
        ctx.clearRect(0, 0, seqIndicatorCanvas.width, seqIndicatorCanvas.height);
    }, 500, ctx);
}

// USER INPUTS
function drawLightOnUserInputs(lightId) {
    reshapeUserInputsCanvas();
    let lightRgbColor = LIGHT_RGB_COLORS[lightId];
    let userInputsCanvas = document.getElementById('user-inputs-canvas');
    let ctx = userInputsCanvas.getContext('2d');
    let radius = 70
    let y = userInputsCanvas.height * 0.27;

    let x = 0
    switch(lightId) {
        case 0:
            x = userInputsCanvas.width * 0.32;
            break;
        case 1:
            x = userInputsCanvas.width * 0.5;
            break;
        case 2:
            x = userInputsCanvas.width * 0.68;
            break
    }

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    
    gradient.addColorStop(0, 'rgba(' + lightRgbColor + ',1.0)');   // Fully transparent at the center
    gradient.addColorStop(0.7, 'rgba(' + lightRgbColor + ',0.5)'); // Semi-transparent midway
    gradient.addColorStop(1, 'rgba(' + lightRgbColor + ',0.0)');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    setTimeout((ctx) => {
        ctx.clearRect(0, 0, userInputsCanvas.width, userInputsCanvas.height);
    }, 500, ctx);
}

function sendSettings() {
    const settingsMessage = "SETTINGS:" + document.getElementById('difficulty').value + ":" + document.getElementById('gamemode').value;
    console.log(settingsMessage);
    if (ws_send.readyState === WebSocket.OPEN)
        ws_send.send(settingsMessage);
    
    addLogMessage(settingsMessage, 'INPUT');
}

function sendControlMessage(message) {
    if (ws_send.readyState === WebSocket.OPEN)
        ws_send.send(message);

    addLogMessage(message, 'INPUT');
}

function getTime() {
    return new Date().toLocaleTimeString();
}

function addLogMessage(message, type) {
    let log_div = document.getElementById('log-div');
    let log_message = "";
    if (type == 'OUTPUT') {
        if (message.includes("lightOutput"))
            log_message = `<p> [${getTime()}] DEVICE OUT: <span class="hint"> ${message} </span> </p>`; 
        else
            log_message = `<p> [${getTime()}] DEVICE OUT: ${message} </p>`; 
    }
    else
        log_message = `<p> [${getTime()}] DEVICE IN: ${message} </p>`;

    log_div.innerHTML += log_message;
}

function refreshLog() {
    let log_div = document.getElementById('log-div');
    log_div.innerHTML = "";

    fetch('http://127.0.0.1:8000/log')
        .then(response => { log_div.innerHTML = ""; return response.json(); })
        .then(data => {
            data["messages"].forEach(element => {
                addLogMessage(element[0], element[1]);
            });
        });
}

let showHints = false;

function showOrHideHints() {
    hints = document.querySelectorAll('.hint');
    if (showHints) {
        hints.forEach(element => {
            element.style.display = 'none';
        });
        showHints = false;
    }
    else {
        hints.forEach(element => {
            element.style.display = 'inline';
        });
        showHints = true;
    }
}