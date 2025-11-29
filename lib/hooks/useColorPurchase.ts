/**
 * 颜色购买 Hook - 处理颜色购买的完整流程
 */

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { FemColorsABI } from '../contracts/abis';
import { recordColorPurchase, getAllColors, getUserColors, type Color } from '../services/colorService';

// 合约地址 - 从环境变量读取
const COLOR_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_COLORS_CONTRACT_ADDRESS || '0x6e0b182c2a590401298ef82400Ae7a128611888A') as `0x${string}`;

export interface UseColorPurchaseResult {
  // 状态
  isPurchasing: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
  
  // 方法
  purchaseColor: (colorId: number, metadataURI: string) => Promise<void>;
  reset: () => void;
}

/**
 * 颜色购买 Hook
 */
export function useColorPurchase(): UseColorPurchaseResult {
  const { address } = useAccount();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  // 读取颜色价格
  const { data: colorPrice } = useReadContract({
    address: COLOR_CONTRACT_ADDRESS,
    abi: FemColorsABI,
    functionName: 'getPrice',
    args: [1n], // 默认获取颜色1的价格，所有颜色价格相同
  });

  const purchaseColor = async (colorId: number, metadataURI: string) => {
    if (!address) {
      setError(new Error('Please connect your wallet'));
      return;
    }

    setIsPurchasing(true);
    setError(null);
    setIsSuccess(false);
    setTxHash(null);

    try {
      // 1. 调用合约购买颜色
      console.log('Purchasing color:', { colorId, metadataURI, price: colorPrice });
      
      const hash = await writeContractAsync({
        address: COLOR_CONTRACT_ADDRESS,
        abi: FemColorsABI,
        functionName: 'buyColor',
        args: [BigInt(colorId), metadataURI],
        value: colorPrice || parseEther('0.0001'), // 使用合约价格或默认价格
      });

      console.log('Transaction sent:', hash);
      setTxHash(hash);

      // 2. 等待交易确认（这里简化处理，实际应该用 useWaitForTransactionReceipt）
      // 等待一段时间让交易上链
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 3. 调用后端记录购买
      console.log('Recording purchase to backend...');
      await recordColorPurchase({
        color_id: colorId,
        buyer_address: address,
        tx_hash: hash,
        price_wei: (colorPrice || parseEther('0.0001')).toString(),
      });

      console.log('Purchase recorded successfully');
      setIsSuccess(true);
    } catch (err) {
      console.error('Error purchasing color:', err);
      setError(err instanceof Error ? err : new Error('Failed to purchase color'));
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
    purchaseColor,
    reset,
  };
}

/**
 * 获取所有颜色列表的 Hook
 */
export function useAllColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchColors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllColors();
      setColors(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch colors'));
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  React.useEffect(() => {
    fetchColors();
  }, []);

  return {
    colors,
    isLoading,
    error,
    refetch: fetchColors,
  };
}

/**
 * 获取用户拥有的颜色的 Hook
 */
export function useUserOwnedColors(userAddress?: string) {
  const { address: connectedAddress } = useAccount();
  const address = userAddress || connectedAddress;
  
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserColors = async () => {
    if (!address) {
      setColors([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserColors(address);
      setColors(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user colors'));
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载和地址变化时重新加载
  React.useEffect(() => {
    fetchUserColors();
  }, [address]);

  return {
    colors,
    isLoading,
    error,
    refetch: fetchUserColors,
  };
}

/**
 * 获取颜色价格的 Hook
 */
export function useColorPrice() {
  const { data: price, isLoading, error } = useReadContract({
    address: COLOR_CONTRACT_ADDRESS,
    abi: FemColorsABI,
    functionName: 'getPrice',
    args: [1n], // 获取颜色1的价格作为基准价格
  });

  return {
    price: price || parseEther('0.0001'), // 默认价格
    priceInEth: price ? formatEther(price) : '0.0001',
    isLoading,
    error,
  };
}
