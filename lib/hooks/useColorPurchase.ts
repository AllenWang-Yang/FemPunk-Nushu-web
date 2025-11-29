/**
 * 颜色购买 Hook - 处理颜色购买的完整流程
 */

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getColorNFTContract } from '../contracts/config';
import { recordColorPurchase, getAllColors, getUserColors, type Color } from '../services/colorService';

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
  const chainId = useChainId();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [pendingTx, setPendingTx] = useState<{
    hash: string;
    colorId: number;
    address: string;
    price: bigint;
  } | null>(null);

  const { writeContractAsync } = useWriteContract();
  const contract = chainId ? getColorNFTContract(chainId) : null;

  // 等待交易确认
  const { data: receipt, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash: pendingTx?.hash as `0x${string}`,
    query: {
      enabled: !!pendingTx?.hash,
    },
  });

  // 交易确认后调用后端
  React.useEffect(() => {
    if (isConfirmed && receipt && pendingTx) {
      const recordPurchase = async () => {
        try {
          console.log('Transaction confirmed, recording to backend...');
          await recordColorPurchase({
            color_id: pendingTx.colorId,
            buyer_address: pendingTx.address,
            tx_hash: pendingTx.hash,
            price_wei: pendingTx.price.toString(),
          });
          console.log('Purchase recorded successfully');
          setIsSuccess(true);
        } catch (err) {
          console.error('Failed to record purchase:', err);
          setError(new Error('交易成功但后端记录失败'));
        } finally {
          setIsPurchasing(false);
          setPendingTx(null);
        }
      };
      recordPurchase();
    }
  }, [isConfirmed, receipt, pendingTx]);

  // 交易失败处理
  React.useEffect(() => {
    if (receiptError && pendingTx) {
      console.error('Transaction failed:', receiptError);
      setError(new Error('交易失败'));
      setIsPurchasing(false);
      setPendingTx(null);
    }
  }, [receiptError, pendingTx]);

  // 读取颜色价格
  const { data: colorPrice } = useReadContract({
    ...contract,
    functionName: 'getPrice',
    args: [1n], // 默认获取颜色1的价格，所有颜色价格相同
    query: {
      enabled: !!contract,
    },
  });

  const purchaseColor = async (colorId: number, metadataURI: string) => {
    if (!address || !contract) {
      setError(new Error('Please connect your wallet'));
      return;
    }

    setIsPurchasing(true);
    setError(null);
    setIsSuccess(false);
    setTxHash(null);

    try {
      // 1. 调用合约购买颜色
      console.log('=== Color Purchase Debug Info ===');
      console.log('Chain ID:', chainId);
      console.log('Contract Address:', contract.address);
      console.log('User Address:', address);
      console.log('Color ID:', colorId);
      console.log('Metadata URI:', metadataURI);
      console.log('Color Price:', colorPrice);
      
      const hash = await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: 'buyColor',
        args: [BigInt(colorId), metadataURI],
        value: (colorPrice as bigint) || parseEther('0.001'),
        gas: 300000n
      });

      console.log('Transaction sent:', hash);
      setTxHash(hash);

      // 2. 设置待确认交易信息
      const finalPrice = (colorPrice as bigint) || parseEther('0.001');
      setPendingTx({
        hash,
        colorId,
        address,
        price: finalPrice,
      });
      
      console.log('Transaction sent, waiting for confirmation...');
    } catch (err: any) {
      console.error('=== Purchase Error Details ===');
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('Error data:', err.data);
      console.error('Error reason:', err.reason);
      console.error('Full error:', err);
      
      let errorMessage = 'Failed to purchase color';
      if (err.message?.includes('Color already minted')) {
        errorMessage = '该颜色已经被铸造，请选择其他颜色';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = '余额不足，请检查您的ETH余额';
      } else if (err.message?.includes('gas')) {
        errorMessage = 'Gas费用不足或Gas限制过低';
      } else if (err.message?.includes('revert')) {
        errorMessage = '合约执行失败，请检查参数是否正确';
      } else if (err.message?.includes('rejected')) {
        errorMessage = '用户取消了交易';
      }
      
      setError(new Error(errorMessage));
      setIsPurchasing(false);
    }
  };

  const reset = () => {
    setIsPurchasing(false);
    setIsSuccess(false);
    setError(null);
    setTxHash(null);
    setPendingTx(null);
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
// 删除不需要的 useAllColors hook

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
      console.warn('Failed to fetch user colors:', err);
      setColors([]);
      setError(null);
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
  const chainId = useChainId();
  const contract = chainId ? getColorNFTContract(chainId) : null;
  
  const { data: price, isLoading, error } = useReadContract({
    ...contract,
    functionName: 'getPrice',
    args: [1n], // 获取颜色1的价格作为基准价格
    query: {
      enabled: !!contract,
    },
  });

  return {
    price: (price as bigint) || parseEther('0.001'), // 默认价格
    priceInEth: price ? formatEther(price as bigint) : '0.001',
    isLoading,
    error,
  };
}
