import React from 'react';

interface ControlButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export const ControlButton: React.FC<ControlButtonProps> = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-20 h-20 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
    flex items-center justify-center text-2xl shadow-lg active:transform 
    active:scale-95 transition-all ${className}`}
  >
    {children}
  </button>
);