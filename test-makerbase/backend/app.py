from flask import Flask, jsonify, request
from flask_cors import CORS
from serial_manager import SerialManager
import atexit

app = Flask(__name__)
CORS(app)

serial_manager = SerialManager()

# Ensure clean shutdown
def cleanup():
    if serial_manager.connection:
        serial_manager.connection.close()

atexit.register(cleanup)

@app.route('/position', methods=['GET'])
def get_position():
    success, response = serial_manager.send_command('?')
    if not success:
        return jsonify({'error': response}), 500
    
    try:
        coords = response.split('MPos:')[1].split('|')[0].split(',')
        return jsonify({
            'x': float(coords[0]),
            'y': float(coords[1])
        })
    except Exception as e:
        return jsonify({'error': f'Could not parse position: {str(e)}'}), 500

@app.route('/jog', methods=['POST'])
def jog():
    data = request.json
    x = data.get('x', 0)
    y = data.get('y', 0)
    feed_rate = data.get('feed_rate', 1000)
    
    # Switch to relative positioning
    success, response = serial_manager.send_command('G91')
    if not success:
        return jsonify({'error': response}), 500

    # Execute jog movement
    success, response = serial_manager.send_command(f'G0 X{x} Y{y} F{feed_rate}')
    if not success:
        return jsonify({'error': response}), 500

    # Return to absolute positioning
    success, response = serial_manager.send_command('G90')
    if not success:
        return jsonify({'error': response}), 500

    return jsonify({'status': 'success'})

@app.route('/home', methods=['POST'])
def go_home():
    success, response = serial_manager.send_command('$H')
    if not success:
        return jsonify({'error': response}), 500
    return jsonify({'status': 'success'})

@app.route('/set-home', methods=['POST'])
def set_home():
    success, response = serial_manager.send_command('G92 X0 Y0')
    if not success:
        return jsonify({'error': response}), 500
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)</content>