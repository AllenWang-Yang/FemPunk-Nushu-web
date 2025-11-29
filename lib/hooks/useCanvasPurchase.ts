/**
 * 画布购买 Hook - 简化版本
 */

import React, { useState } from 'react';
import { useAccount, useWriteContract, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { getFemCanvasContract } from '../contracts/config';

export interface UseCanvasPurchaseResult {
  isPurchasing: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
  purchaseCanvas: (canvasId: bigint, price?: bigint) => Promise<void>;
  reset: () => void;
}

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
      const purchasePrice = price || parseEther('0.0018');
      
      const hash = await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: 'buyCanvas',
        args: [canvasId],
        value: purchasePrice,
      });

      setTxHash(hash);
      setIsSuccess(true);
    } catch (err) {
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

// 简化的价格Hook
export function useCanvasPrice() {
  return {
    price: parseEther('0.0018'),
    priceInEth: '0.0018',
    isLoading: false,
    error: null,
  };
}

// 简化的购买信息Hook
export function useCanvasPurchaseInfo() {
  return {
    purchaseInfo: {
      price: parseEther('0.0018'),
      minted: 0n,
      remaining: 100n,
      userHasMinted: false,
    },
    isLoading: false,
    error: null,
  };
}

// 简化的购买状态Hook
export function useHasPurchasedCanvas() {
  return {
    hasPurchased: false,
    balance: 0n,
    isLoading: false,
  };
}

// 当前画布信息Hook
export function useCurrentCanvas() {
  const [canvas, setCanvas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCanvas = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟获取当前画布数据
      const mockCanvas = {
        canvas_id: '1',
        day_timestamp: Date.now(),
        total_raised_wei: '1800000000000000', // 0.0018 ETH
        finalized: false,
        metadata_uri: '/images/homepage/spring.png',
      };
      
      setCanvas(mockCanvas);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch canvas'));
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchCanvas();
  };

  // 初始加载
  React.useEffect(() => {
    fetchCanvas();
  }, []);

  return {
    canvas,
    isLoading,
    error,
    refetch,
  };
}