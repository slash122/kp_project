import serial

# Configure the serial port
SERIAL_PORT = "/dev/pts/10"  # Replace with your port, e.g., /dev/ttyS0 on Linux
BAUD_RATE = 9600

# Open the serial port
try:
    # Open the serial port
    with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1) as ser:
        print(f"Listening on {SERIAL_PORT} at {BAUD_RATE} baud...")
        
        while True:
            # Check if there is data waiting in the buffer
            if ser.in_waiting > 0:
                # Read the data from the serial port
                data = ser.readline().decode('utf-8', errors='ignore').strip()
                print(f"Received: {data}")

except serial.SerialException as e:
    print(f"Serial port error: {e}")
except KeyboardInterrupt:
    print("Stopped by user.")