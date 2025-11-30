/**
 * 画布购买按钮组件
 */

'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  useCanvasPurchase, 
  useCanvasPrice, 
  useCanvasPurchaseInfo,
  useHasPurchasedCanvas 
} from '../../lib/hooks/useCanvasPurchase';

interface CanvasPurchaseButtonProps {
  canvasId: bigint;
  onSuccess?: () => void;
  className?: string;
}

export function CanvasPurchaseButton({ 
  canvasId, 
  onSuccess,
  className = '' 
}: CanvasPurchaseButtonProps) {
  const { isConnected } = useAccount();
  const { isPurchasing, isSuccess, error, purchaseCanvas, reset } = useCanvasPurchase();
  const { priceInEth, price } = useCanvasPrice(canvasId);
  const { purchaseInfo, isLoading: isLoadingInfo } = useCanvasPurchaseInfo(canvasId);
  const { hasPurchased, isLoading: isLoadingBalance } = useHasPurchasedCanvas(canvasId);

  // 处理购买成功
  React.useEffect(() => {
    if (isSuccess) {
      alert('Canvas purchased successfully!');
      onSuccess?.();
      reset();
    }
  }, [isSuccess, onSuccess, reset]);

  // 处理错误
  React.useEffect(() => {
    if (error) {
      alert(`Purchase failed: ${error.message}`);
    }
  }, [error]);

  const handlePurchase = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    await purchaseCanvas(canvasId.toString(), `https://api.fempunk.com/canvas/${canvasId}/metadata`);
  };

  // 未连接钱包
  if (!isConnected) {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <p className="text-sm text-gray-400">Connect wallet to purchase canvas</p>
        <ConnectButton />
      </div>
    );
  }

  // 加载中
  if (isLoadingInfo || isLoadingBalance) {
    return (
      <button 
        disabled 
        className={`px-6 py-3 bg-gray-600 text-white rounded-lg cursor-not-allowed ${className}`}
      >
        Loading...
      </button>
    );
  }

  // 已购买
  if (hasPurchased) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="px-6 py-3 bg-green-600 text-white rounded-lg">
          ✓ Already Purchased
        </div>
        <p className="text-xs text-gray-400">You own this canvas NFT</p>
      </div>
    );
  }

  // 售罄
  if (purchaseInfo && purchaseInfo.remaining === 0n) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="px-6 py-3 bg-gray-600 text-white rounded-lg cursor-not-allowed">
          Sold Out
        </div>
        <p className="text-xs text-gray-400">
          {purchaseInfo.minted.toString()} / 100 minted
        </p>
      </div>
    );
  }

  // 可购买
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-1">Canvas Price</p>
        <p className="text-2xl font-bold text-white">{priceInEth} ETH</p>
        {purchaseInfo && (
          <p className="text-xs text-gray-500 mt-1">
            {purchaseInfo.remaining.toString()} / 100 remaining
          </p>
        )}
      </div>
      
      <button
        onClick={handlePurchase}
        disabled={isPurchasing}
        className="px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors min-w-[200px]"
      >
        {isPurchasing ? 'Purchasing...' : 'Purchase Canvas'}
      </button>

      <p className="text-xs text-gray-500 text-center max-w-xs">
        Limited to 1 per wallet. Canvas NFT will be minted to your address.
      </p>
    </div>
  );
}

export default CanvasPurchaseButton;
