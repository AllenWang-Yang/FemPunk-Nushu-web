'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { FEM_CANVAS_REVENUE_ADDRESS } from '../contracts/config';
import { femCanvasRevenueABI } from '../contracts/abis/FemCanvasRevenue';

// Hook for sending revenue to contract
export function useSendRevenue() {
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { 
    writeContract, 
    data: hash, 
    isPending: isLoading, 
    error 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess 
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      setTxHash(hash);
    }
  }, [hash]);

  const sendRevenue = async (canvasId: number, amount: string) => {
    try {
      await writeContract({
        address: FEM_CANVAS_REVENUE_ADDRESS,
        abi: femCanvasRevenueABI,
        functionName: 'receiveRevenue',
        args: [BigInt(canvasId)],
        value: parseEther(amount),
      });
    } catch (err) {
      console.error('Error sending revenue:', err);
      throw err;
    }
  };

  return {
    sendRevenue,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    txHash,
  };
}

// Hook for claiming revenue
export function useClaimRevenue() {
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { 
    writeContract, 
    data: hash, 
    isPending: isLoading, 
    error 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess 
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      setTxHash(hash);
    }
  }, [hash]);

  const claimRevenue = async (canvasId: number) => {
    try {
      await writeContract({
        address: FEM_CANVAS_REVENUE_ADDRESS,
        abi: femCanvasRevenueABI,
        functionName: 'claimRevenue',
        args: [BigInt(canvasId)],
      });
    } catch (err) {
      console.error('Error claiming revenue:', err);
      throw err;
    }
  };

  return {
    claimRevenue,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    txHash,
  };
}

// Hook for getting claimable amount
export function useClaimableAmount(canvasId: number) {
  const { address } = useAccount();
  
  const { data, isLoading, error } = useReadContract({
    address: FEM_CANVAS_REVENUE_ADDRESS,
    abi: femCanvasRevenueABI,
    functionName: 'getClaimableAmount',
    args: [BigInt(canvasId), address as `0x${string}`],
    query: {
      enabled: !!address && !!canvasId,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const claimableAmount = data ? formatEther(data as bigint) : '0.0000';

  return {
    claimableAmount,
    isLoading,
    error,
  };
}

// Hook for getting canvas revenue status
export function useCanvasRevenueStatus(canvasId: number) {
  const { data, isLoading, error } = useReadContract({
    address: FEM_CANVAS_REVENUE_ADDRESS,
    abi: femCanvasRevenueABI,
    functionName: 'getCanvasRevenueStatus',
    args: [BigInt(canvasId)],
    query: {
      enabled: !!canvasId,
      refetchInterval: 15000, // Refetch every 15 seconds
    },
  });

  let status = null;
  if (data && Array.isArray(data)) {
    const [totalRevenue, distributed, contributorsCount] = data;
    status = {
      totalRevenue: formatEther(totalRevenue as bigint),
      distributed: distributed as boolean,
      contributorsCount: Number(contributorsCount),
    };
  }

  return {
    status,
    isLoading,
    error,
  };
}

// Hook for getting contributor info
export function useContributorInfo(canvasId: number, contributorAddress?: string) {
  const { address } = useAccount();
  const targetAddress = contributorAddress || address;
  
  const { data, isLoading, error } = useReadContract({
    address: FEM_CANVAS_REVENUE_ADDRESS,
    abi: femCanvasRevenueABI,
    functionName: 'claimableAmount',
    args: [BigInt(canvasId), targetAddress as `0x${string}`],
    query: {
      enabled: !!targetAddress && !!canvasId,
      refetchInterval: 20000, // Refetch every 20 seconds
    },
  });

  let contributorInfo = null;
  if (data) {
    contributorInfo = {
      contribution: 0, // This would need to be fetched from contribution contract
      claimed: formatEther(data as bigint),
    };
  }

  return {
    contributorInfo,
    isLoading,
    error,
  };
}

// Hook for getting all contributors of a canvas
export function useCanvasContributors(canvasId: number) {
  const [contributors, setContributors] = useState<Array<{
    address: string;
    contribution: number;
    claimed: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchContributors = async () => {
    if (!canvasId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // This would typically call a backend API or use a multicall
      // For now, we'll return empty array as this requires more complex contract interaction
      setContributors([]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, [canvasId]);

  return {
    contributors,
    isLoading,
    error,
    refetch: fetchContributors,
  };
}