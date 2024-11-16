import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { ControlButton } from './ControlButton';

interface ControlPadProps {
  onJog: (x: number, y: number) => void;
  onHome: () => void;
  stepSize: number;
}

export const ControlPad: React.FC<ControlPadProps> = ({ onJog, onHome, stepSize }) => (
  <div className="grid grid-cols-3 gap-4">
    <div></div>
    <ControlButton onClick={() => onJog(0, stepSize)}>
      <ArrowUp size={32} />
    </ControlButton>
    <div></div>

    <ControlButton onClick={() => onJog(-stepSize, 0)}>
      <ArrowLeft size={32} />
    </ControlButton>
    <ControlButton onClick={onHome}>
      <Home size={32} />
    </ControlButton>
    <ControlButton onClick={() => onJog(stepSize, 0)}>
      <ArrowRight size={32} />
    </ControlButton>

    <div></div>
    <ControlButton onClick={() => onJog(0, -stepSize)}>
      <ArrowDown size={32} />
    </ControlButton>
    <div></div>
  </div>
);