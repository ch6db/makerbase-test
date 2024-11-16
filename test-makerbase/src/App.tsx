import React from 'react';
import { Target } from 'lucide-react';
import { ControlButton } from './components/ControlButton';
import { PositionDisplay } from './components/PositionDisplay';
import { ControlPad } from './components/ControlPad';
import { usePosition } from './hooks/usePosition';
import { api } from './services/api';

function App() {
  const stepSize = 10; // mm per jog
  const { position, error, updatePosition } = usePosition();

  const handleJog = async (x: number, y: number) => {
    try {
      await api.jog(x, y);
      updatePosition();
    } catch (err) {
      console.error('Jog failed:', err);
    }
  };

  const handleHome = async () => {
    try {
      await api.home();
      updatePosition();
    } catch (err) {
      console.error('Homing failed:', err);
    }
  };

  const handleSetHome = async () => {
    try {
      await api.setHome();
      updatePosition();
    } catch (err) {
      console.error('Setting home failed:', err);
    }
  };

  return (
    <div className="h-[540px] w-[960px] bg-gray-100 p-6 flex flex-col items-center justify-between">
      <PositionDisplay x={position.x} y={position.y} error={error} />
      <ControlPad onJog={handleJog} onHome={handleHome} stepSize={stepSize} />
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