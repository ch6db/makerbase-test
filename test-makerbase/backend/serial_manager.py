import serial
import time
import os
import subprocess
from typing import Optional

class SerialManager:
    def __init__(self, port: str = '/dev/ttyUSB0', baudrate: int = 115200):
        self.port = port
        self.baudrate = baudrate
        self.connection: Optional[serial.Serial] = None
        self.ensure_exclusive_access()
        self.connect()

    def ensure_exclusive_access(self) -> None:
        try:
            # Find processes using the serial port
            lsof_output = subprocess.check_output(['lsof', self.port], stderr=subprocess.DEVNULL)
            for line in lsof_output.decode().split('\n')[1:]:  # Skip header
                if line:
                    pid = line.split()[1]
                    try:
                        os.kill(int(pid), 9)  # SIGKILL
                        print(f"Terminated process {pid} using {self.port}")
                    except ProcessLookupError:
                        pass
        except subprocess.CalledProcessError:
            # No processes found using the port
            pass

        # Reset the USB device
        try:
            device_path = os.path.realpath(self.port)
            if '/dev/bus/usb' in device_path:
                subprocess.run(['usbreset', device_path], stderr=subprocess.DEVNULL)
        except Exception:
            pass

        # Ensure correct permissions
        try:
            os.chmod(self.port, 0o666)
        except Exception:
            pass

    def connect(self) -> None:
        try:
            self.connection = serial.Serial(
                self.port,
                self.baudrate,
                timeout=1,
                exclusive=True  # Request exclusive access
            )
            time.sleep(2)  # Wait for connection to establish
            
            # Send soft reset to GRBL
            self.connection.write("\x18".encode())  # Ctrl+X
            time.sleep(1)
            self.connection.flushInput()
            
        except serial.SerialException as e:
            print(f"Failed to connect to {self.port}: {str(e)}")
            self.connection = None

    def is_connected(self) -> bool:
        return self.connection is not None and self.connection.is_open

    def reconnect(self) -> None:
        if self.connection:
            self.connection.close()
        self.ensure_exclusive_access()
        self.connect()

    def send_command(self, command: str) -> tuple[bool, str]:
        if not self.is_connected():
            self.reconnect()
            if not self.is_connected():
                return False, "Device not connected"

        try:
            self.connection.write(f"{command}\n".encode())
            time.sleep(0.1)
            response = self.connection.readline().decode().strip()
            return True, response
        except serial.SerialException as e:
            self.connection = None
            return False, str(e)

    def __del__(self):
        if self.connection:
            try:
                self.connection.close()
            except Exception:
                pass</content>