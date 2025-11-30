/**
 * 获取所有画布数据的 Hook
 */

import { useState, useEffect } from 'react';
import { getAllCanvas, type Canvas } from '../services/canvasService';

export function useAllCanvas() {
  const [canvasList, setCanvasList] = useState<Canvas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllCanvas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllCanvas();
      setCanvasList(data);
    } catch (err) {
      console.error('Failed to fetch all canvas:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCanvas();
  }, []);

  return {
    canvasList,
    isLoading,
    error,
    refetch: fetchAllCanvas,
  };
}

export default useAllCanvas;