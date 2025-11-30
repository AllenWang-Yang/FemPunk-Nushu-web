/**
 * 用户画布 Hook
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUserContributedCanvas, type Canvas } from '../services/canvasService';

export function useUserCanvas() {
  const { address } = useAccount();
  const [canvasList, setCanvasList] = useState<Canvas[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserCanvas = async () => {
    if (!address) {
      setCanvasList([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserContributedCanvas(address);
      setCanvasList(data);
    } catch (err) {
      console.error('Failed to fetch user canvas:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCanvas();
  }, [address]);

  return {
    canvasList,
    isLoading,
    error,
    refetch: fetchUserCanvas,
  };
}

export default useUserCanvas;