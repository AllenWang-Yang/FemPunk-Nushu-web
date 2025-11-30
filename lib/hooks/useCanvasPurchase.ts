/**
 * 画布购买 Hook
 */

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { recordCanvasPurchase } from '../services/canvasService';
import { getFemCanvasContract } from '../contracts/config';

export interface UseCanvasPurchaseResult {
  isPurchasing: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
  purchaseCanvas: (canvasId: string, metadataURI: string) => Promise<void>;
  reset: () => void;
}

export function useCanvasPurchase(): UseCanvasPurchaseResult {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [pendingTx, setPendingTx] = useState<{
    hash: string;
    canvasId: string;
    address: string;
    price: bigint;
  } | null>(null);

  const { writeContractAsync } = useWriteContract();

  // Wait for transaction confirmation
  const { data: receipt, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash: pendingTx?.hash as `0x${string}`,
    query: {
      enabled: !!pendingTx?.hash,
    },
  });

  // Record purchase after confirmation
  React.useEffect(() => {
    if (isConfirmed && receipt && pendingTx) {
      const recordPurchase = async () => {
        try {
          console.log('Transaction confirmed, recording to backend...');
          await recordCanvasPurchase({
            canvas_id: pendingTx.canvasId,
            buyer_address: pendingTx.address,
            tx_hash: pendingTx.hash,
            amount_wei: pendingTx.price.toString(),
          });
          console.log('Canvas purchase recorded successfully');
          setIsSuccess(true);
        } catch (err) {
          console.error('Failed to record canvas purchase:', err);
          setError(new Error('Transaction successful but backend recording failed'));
        } finally {
          setIsPurchasing(false);
          setPendingTx(null);
        }
      };
      recordPurchase();
    }
  }, [isConfirmed, receipt, pendingTx]);

  // Handle transaction failure
  React.useEffect(() => {
    if (receiptError && pendingTx) {
      console.error('Transaction failed:', receiptError);
      setError(new Error('Transaction failed'));
      setIsPurchasing(false);
      setPendingTx(null);
    }
  }, [receiptError, pendingTx]);

  const { switchChain } = useSwitchChain();

  const purchaseCanvas = async (canvasId: string, metadataURI: string) => {
    if (!address) {
      setError(new Error('Please connect your wallet'));
      return;
    }

    // 检查并切换到 Base Sepolia
    if (chainId !== baseSepolia.id) {
      try {
        await switchChain({ chainId: baseSepolia.id });
      } catch (err) {
        setError(new Error('Please switch to Base Sepolia network'));
        return;
      }
    }

    setIsPurchasing(true);
    setError(null);
    setIsSuccess(false);
    setTxHash(null);

    try {
      console.log('=== Canvas Purchase Debug Info ===');
      console.log('Chain ID:', chainId);
      console.log('User Address:', address);
      console.log('Canvas ID:', canvasId);
      console.log('Metadata URI:', metadataURI);
      
      const canvasPrice = parseEther('0.001');
      const contract = getFemCanvasContract(baseSepolia.id);
      
      const hash = await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: 'buyCanvas',
        args: [BigInt(canvasId)],
        value: canvasPrice,
      });
      
      console.log('Transaction sent:', hash);
      setTxHash(hash);

      setPendingTx({
        hash,
        canvasId,
        address,
        price: canvasPrice,
      });
      
    } catch (err: any) {
      console.error('=== Canvas Purchase Error ===');
      console.error('Error:', err);
      
      let errorMessage = 'Failed to purchase canvas';
      if (err.message?.includes('Canvas does not exist')) {
        errorMessage = 'Canvas not found';
      } else if (err.message?.includes('Canvas already finalized')) {
        errorMessage = 'Canvas is no longer available for purchase';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH balance';
      } else if (err.message?.includes('rejected')) {
        errorMessage = 'Transaction cancelled by user';
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
    purchaseCanvas,
    reset,
  };
}

// 导出 useCurrentCanvas hook
export { useCurrentCanvas } from './useCurrentCanvas';