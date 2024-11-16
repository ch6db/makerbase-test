from flask import Flask, jsonify, request
from flask_cors import CORS
import serial
import time

app = Flask(__name__)
CORS(app)

# Configure serial connection to Makerbase
ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
time.sleep(2)  # Wait for connection to establish

def send_gcode(command):
    ser.write(f"{command}\n".encode())
    time.sleep(0.1)
    response = ser.readline().decode().strip()
    return response

@app.route('/position', methods=['GET'])
def get_position():
    response = send_gcode('?')
    # Parse the response to extract X,Y coordinates
    # Example response: <Idle|MPos:0.000,0.000,0.000|FS:0,0|WCO:0.000,0.000,0.000>
    try:
        coords = response.split('MPos:')[1].split('|')[0].split(',')
        return jsonify({
            'x': float(coords[0]),
            'y': float(coords[1])
        })
    except:
        return jsonify({'error': 'Could not parse position'})

@app.route('/jog', methods=['POST'])
def jog():
    data = request.json
    x = data.get('x', 0)
    y = data.get('y', 0)
    feed_rate = data.get('feed_rate', 1000)
    
    command = f'G91 G0 X{x} Y{y} F{feed_rate}'  # Relative positioning
    response = send_gcode(command)
    send_gcode('G90')  # Return to absolute positioning
    return jsonify({'status': 'success', 'response': response})

@app.route('/home', methods=['POST'])
def go_home():
    response = send_gcode('$H')
    return jsonify({'status': 'success', 'response': response})

@app.route('/set-home', methods=['POST'])
def set_home():
    response = send_gcode('G92 X0 Y0')
    return jsonify({'status': 'success', 'response': response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)