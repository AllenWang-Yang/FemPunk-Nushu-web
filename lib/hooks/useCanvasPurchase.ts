/**
 * 画布购买 Hook - 处理画布购买的完整流程
 */

import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getFemCanvasContract } from '../contracts/config';
import { 
  recordCanvasPurchase, 
  getAllCanvas, 
  getCanvasById,
  getCanvasByDay,
  type Canvas 
} from '../services/canvasService';

export interface UseCanvasPurchaseResult {
  // 状态
  isPurchasing: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
  
  // 方法
  purchaseCanvas: (canvasId: bigint, price?: bigint) => Promise<void>;
  reset: () => void;
}

/**
 * 画布购买 Hook
 */
export function useCanvasPurchase(): UseCanvasPurchaseResult {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();
  const contract = chainId ? getFemCanvasContract(chainId) : null;

  const purchaseCanvas = async (canvasId: bigint, price?: bigint) => {
    if (!address || !contract) {
      setError(new Error('Please connect your wallet'));
      return;
    }

    setIsPurchasing(true);
    setError(null);
    setIsSuccess(false);
    setTxHash(null);

    try {
      // 使用传入的价格或默认价格
      const purchasePrice = price || parseEther('0.0018');

      // 调用合约购买画布
      console.log('Purchasing canvas:', { canvasId, price: purchasePrice });
      
      const hash = await writeContractAsync({
        ...contract,
        functionName: 'buyCanvas',
        args: [canvasId],
        value: purchasePrice,
      });

      console.log('Transaction sent:', hash);
      setTxHash(hash);

      // 等待交易确认
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 调用后端记录购买
      console.log('Recording canvas purchase to backend...');
      await recordCanvasPurchase({
        canvas_id: canvasId.toString(),
        buyer_address: address,
        tx_hash: hash,
        amount_wei: purchasePrice.toString(),
      });

      console.log('Canvas purchase recorded successfully');
      setIsSuccess(true);
    } catch (err) {
      console.error('Error purchasing canvas:', err);
      setError(err instanceof Error ? err : new Error('Failed to purchase canvas'));
    } finally {
      setIsPurchasing(false);
    }
  };

  const reset = () => {
    setIsPurchasing(false);
    setIsSuccess(false);
    setError(null);
    setTxHash(null);
  };

  return {
    isPurchasing,
    isSuccess,
    error,
    txHash,
    purchaseCanvas,
    reset,
  };
}

/**
 * 获取当前画布的 Hook
 */
export function useCurrentCanvas() {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCanvas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllCanvas();
      setCanvas(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch canvas'));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCanvas();
  }, []);

  return {
    canvas,
    isLoading,
    error,
    refetch: fetchCanvas,
  };
}

/**
 * 根据ID获取画布的 Hook
 */
export function useCanvasById(canvasId?: string) {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCanvas = async () => {
    if (!canvasId) {
      setCanvas(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getCanvasById(canvasId);
      setCanvas(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch canvas'));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCanvas();
  }, [canvasId]);

  return {
    canvas,
    isLoading,
    error,
    refetch: fetchCanvas,
  };
}

/**
 * 获取画布价格的 Hook
 */
export function useCanvasPrice(canvasId?: bigint) {
  const chainId = useChainId();
  const contract = chainId ? getFemCanvasContract(chainId) : null;
  
  const { data: price, isLoading, error } = useReadContract({
    ...contract,
    functionName: 'canvasPrice',
    args: canvasId ? [canvasId] : undefined,
    query: {
      enabled: !!contract && !!canvasId,
    },
  });

  return {
    price: price || parseEther('0.0018'), // 默认价格
    priceInEth: price ? formatEther(price) : '0.0018',
    isLoading,
    error,
  };
}

/**
 * 获取画布购买信息的 Hook
 */
export function useCanvasPurchaseInfo(canvasId?: bigint) {
  const { address } = useAccount();
  const chainId = useChainId();
  const contract = chainId ? getFemCanvasContract(chainId) : null;
  
  const { data, isLoading, error } = useReadContract({
    ...contract,
    functionName: 'getCanvasPurchaseInfo',
    args: canvasId ? [canvasId] : undefined,
    query: {
      enabled: !!contract && !!canvasId,
    },
  });

  // data 返回: [price, minted, remaining, userHasMinted]
  const purchaseInfo = data ? {
    price: data[0],
    minted: data[1],
    remaining: data[2],
    userHasMinted: data[3],
  } : null;

  return {
    purchaseInfo,
    isLoading,
    error,
  };
}

/**
 * 检查用户是否已购买画布的 Hook
 */
export function useHasPurchasedCanvas(canvasId?: bigint) {
  const { address } = useAccount();
  const chainId = useChainId();
  const contract = chainId ? getFemCanvasContract(chainId) : null;
  
  const { data: balance, isLoading } = useReadContract({
    ...contract,
    functionName: 'balanceOf',
    args: address && canvasId ? [address as `0x${string}`, canvasId] : undefined,
    query: {
      enabled: !!contract && !!address && !!canvasId,
    },
  });

  return {
    hasPurchased: balance ? balance > 0n : false,
    balance: balance || 0n,
    isLoading,
  };
}
