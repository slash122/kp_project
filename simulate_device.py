import serial
import time

# Configuration
SERIAL_PORT = "/dev/pts/10"  # Specify the port
BAUD_RATE = 9600      # Match the baud rate of the receiver

def send_data_to_port():
    try:
        # Open the serial port
        with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.1) as ser:
            print(f"Opened {SERIAL_PORT} for sending data.")
            
            while True:
                # Message to send
                message = input()
                
                # Write message to the serial port
                ser.write(message.encode("utf-8"))
                print(f"Sent: {message.strip()}")

    except serial.SerialException as e:
        print(f"Error: {e}")

# Call the function
send_data_to_port()