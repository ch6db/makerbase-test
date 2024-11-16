import React from 'react';

interface PositionDisplayProps {
  x: number;
  y: number;
  error?: string;
}

export const PositionDisplay: React.FC<PositionDisplayProps> = ({ x, y, error }) => (
  <div className="w-full bg-white rounded-lg p-4 shadow-md">
    <h1 className="text-2xl font-bold text-center mb-2">Makerbase XY Controller</h1>
    <div className="flex justify-center space-x-8">
      <div className="text-xl">X: {x.toFixed(3)} mm</div>
      <div className="text-xl">Y: {y.toFixed(3)} mm</div>
    </div>
    {error && <div className="text-red-500 text-center mt-2">{error}</div>}
  </div>
);