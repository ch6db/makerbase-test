# Makerbase XY Controller

A touch-screen interface for controlling Makerbase X & Y axes using GRBL commands.

## Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Flask backend:
   ```bash
   python backend/app.py
   ```

4. Start the React frontend:
   ```bash
   npm run dev
   ```

## Features

- Real-time XY coordinate display
- Touch-friendly jog controls
- Set home position
- Return to home
- Automatic position updates
- Error handling and status display

## Hardware Requirements

- Makerbase controller connected to /dev/ttyUSB0
- Display resolution: 960x540