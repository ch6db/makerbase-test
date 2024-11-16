import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, Target } from 'lucide-react';

const API_URL = 'http://localhost:5000';

interface Position {
  x: number;
  y: number;
}

function App() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [error, setError] = useState<string>('');
  const stepSize = 10; // mm per jog
  const updateInterval = 500; // ms

  useEffect(() => {
    const interval = setInterval(updatePosition, updateInterval);
    return () => clearInterval(interval);
  }, []);

  const updatePosition = async () => {
    try {
      const response = await axios.get(`${API_URL}/position`);
      setPosition(response.data);
      setError('');
    } catch (err) {
      setError('Failed to get position');
    }
  };

  const handleJog = async (x: number, y: number) => {
    try {
      await axios.post(`${API_URL}/jog`, { x, y });
      updatePosition();
    } catch (err) {
      setError('Jog failed');
    }
  };

  const handleHome = async () => {
    try {
      await axios.post(`${API_URL}/home`);
      updatePosition();
    } catch (err) {
      setError('Homing failed');
    }
  };

  const handleSetHome = async () => {
    try {
      await axios.post(`${API_URL}/set-home`);
      updatePosition();
    } catch (err) {
      setError('Setting home failed');
    }
  };

  const ControlButton = ({ onClick, children, className = '' }) => (
    <button
      onClick={onClick}
      className={`w-20 h-20 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
      flex items-center justify-center text-2xl shadow-lg active:transform 
      active:scale-95 transition-all ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="h-[540px] w-[960px] bg-gray-100 p-6 flex flex-col items-center justify-between">
      {/* Header with Position Display */}
      <div className="w-full bg-white rounded-lg p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Makerbase XY Controller</h1>
        <div className="flex justify-center space-x-8">
          <div className="text-xl">X: {position.x.toFixed(3)} mm</div>
          <div className="text-xl">Y: {position.y.toFixed(3)} mm</div>
        </div>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>

      {/* Control Pad */}
      <div className="grid grid-cols-3 gap-4">
        <div></div>
        <ControlButton onClick={() => handleJog(0, stepSize)}>
          <ArrowUp size={32} />
        </ControlButton>
        <div></div>

        <ControlButton onClick={() => handleJog(-stepSize, 0)}>
          <ArrowLeft size={32} />
        </ControlButton>
        <ControlButton onClick={handleHome}>
          <Home size={32} />
        </ControlButton>
        <ControlButton onClick={() => handleJog(stepSize, 0)}>
          <ArrowRight size={32} />
        </ControlButton>

        <div></div>
        <ControlButton onClick={() => handleJog(0, -stepSize)}>
          <ArrowDown size={32} />
        </ControlButton>
        <div></div>
      </div>

      {/* Set Home Button */}
      <ControlButton 
        onClick={handleSetHome}
        className="bg-green-500 hover:bg-green-600"
      >
        <Target size={32} />
      </ControlButton>
    </div>
  );
}

export default App;