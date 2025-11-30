/**
 * 画布数据 Hook
 */

import { useState, useEffect } from 'react';
import { getAllCanvas, type Canvas } from '../services/canvasService';

export function useCanvas() {
  const [canvasList, setCanvasList] = useState<Canvas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCanvas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllCanvas();
      setCanvasList(data);
    } catch (err) {
      console.error('Failed to fetch canvas:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCanvas();
  }, []);

  return {
    canvasList,
    canvas: canvasList[0] || null, // 保持向后兼容性
    isLoading,
    error,
    refetch: fetchCanvas,
  };
}