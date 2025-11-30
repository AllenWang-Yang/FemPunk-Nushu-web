/**
 * 获取当前画布的 Hook
 */

import { useState, useEffect } from 'react';
import { getCanvasByDay, type Canvas } from '../services/canvasService';

export function useCurrentCanvas() {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentCanvas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 获取今天的时间戳
      const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) * 24 * 60 * 60;
      const data = await getCanvasByDay(today);
      setCanvas(data);
    } catch (err) {
      console.error('Failed to fetch current canvas:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentCanvas();
  }, []);

  return {
    canvas,
    isLoading,
    error,
    refetch: fetchCurrentCanvas,
  };
}

export default useCurrentCanvas;