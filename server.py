import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles 
from fastapi.templating import Jinja2Templates
import serial
from datetime import datetime

# Initialize FastAPI
app = FastAPI()

# Store messages
message_log = []

# Arduino Serial Port Configuration
SERIAL_PORT = "/dev/pts/11"  # Update based on your OS and device
BAUD_RATE = 9600

app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

@app.get("/")
async def get_root():
    return FileResponse('frontend/index.html')


@app.get("/log")
async def get_messages():
    """HTTP Endpoint to retrieve all messages."""
    return {"messages": message_log}


@app.websocket("/ws/read")
async def stream_messages(websocket: WebSocket):
    await websocket.accept()  
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.1)
    while True:    
        if ser.in_waiting > 0:
            line = ser.readline().decode("utf-8").strip()
            message_log.append((line, 'OUTPUT'))
            await websocket.send_text(line) 
        await asyncio.sleep(0.1)
    

@app.websocket("/ws/send")
async def read_messages(websocket: WebSocket):
    await websocket.accept()
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.1)
    while True:
        message = await websocket.receive_text()
        message_log.append((message, 'INPUT'))
        ser.write(message.encode("utf-8"))
