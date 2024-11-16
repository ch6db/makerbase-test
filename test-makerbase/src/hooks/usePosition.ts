import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

interface Position {
  x: number;
  y: number;
}

export const usePosition = (updateInterval: number = 500) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [error, setError] = useState<string>('');

  const updatePosition = async () => {
    try {
      const response = await axios.get(`${API_URL}/position`);
      setPosition(response.data);
      setError('');
    } catch (err) {
      setError('Failed to get position');
    }
  };

  useEffect(() => {
    const interval = setInterval(updatePosition, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  return { position, error, updatePosition };
};