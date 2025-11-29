import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useAccount, useChainId } from 'wagmi';
import { formatEther, parseEther, type Address } from 'viem';
import { getColorNFTContract, getArtworkNFTContract, GAS_LIMITS } from '../contracts/config';

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  totalCost: bigint;
  totalCostEth: string;
  isLoading: boolean;
  error: string | null;
}

// Hook for estimating gas costs
export function useGasEstimation() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  
  const [gasPrice, setGasPrice] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current gas price
  const fetchGasPrice = useCallback(async () => {
    if (!publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      const price = await publicClient.getGasPrice();
      setGasPrice(price);
    } catch (err) {
      setError('获取 Gas 价格失败');
      console.error('Gas price fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  // Auto-fetch gas price on mount and periodically
  useEffect(() => {
    fetchGasPrice();
    
    // Update gas price every 30 seconds
    const interval = setInterval(fetchGasPrice, 30000);
    return () => clearInterval(interval);
  }, [fetchGasPrice]);

  // Estimate gas for color purchase
  const estimateColorPurchase = useCallback(async (
    colorId: number,
    metadataURI: string,
    priceInEth: string
  ): Promise<GasEstimate> => {
    if (!publicClient || !address || !chainId) {
      throw new Error('钱包未连接');
    }

    const contract = getColorNFTContract(chainId);
    
    try {
      const gasLimit = await publicClient.estimateContractGas({
        ...contract,
        functionName: 'buyColor',
        args: [BigInt(colorId), metadataURI],
        value: parseEther(priceInEth),
        account: address as Address,
      });

      const totalCost = gasLimit * gasPrice;
      
      return {
        gasLimit,
        gasPrice,
        totalCost,
        totalCostEth: formatEther(totalCost),
        isLoading: false,
        error: null,
      };
    } catch (err) {
      // Fallback to predefined gas limit
      const gasLimit = GAS_LIMITS.purchaseColor;
      const totalCost = gasLimit * gasPrice;
      
      return {
        gasLimit,
        gasPrice,
        totalCost,
        totalCostEth: formatEther(totalCost),
        isLoading: false,
        error: '使用预估 Gas 费用',
      };
    }
  }, [publicClient, address, chainId, gasPrice]);

  // Estimate gas for artwork minting
  const estimateArtworkMinting = useCallback(async (
    canvasData: string,
    contributors: string[],
    contributions: number[],
    dailyThemeId: string
  ): Promise<GasEstimate> => {
    if (!publicClient || !address || !chainId) {
      throw new Error('钱包未连接');
    }

    const contract = getArtworkNFTContract(chainId);
    const contributionsInWei = contributions.map(c => BigInt(c * 100));
    
    try {
      const gasLimit = await publicClient.estimateContractGas({
        ...contract,
        functionName: 'mintArtwork',
        args: [canvasData, contributors as `0x${string}`[], contributionsInWei, dailyThemeId],
        account: address as Address,
      });

      const totalCost = gasLimit * gasPrice;
      
      return {
        gasLimit,
        gasPrice,
        totalCost,
        totalCostEth: formatEther(totalCost),
        isLoading: false,
        error: null,
      };
    } catch (err) {
      // Fallback to predefined gas limit
      const gasLimit = GAS_LIMITS.mintArtwork;
      const totalCost = gasLimit * gasPrice;
      
      return {
        gasLimit,
        gasPrice,
        totalCost,
        totalCostEth: formatEther(totalCost),
        isLoading: false,
        error: '使用预估 Gas 费用',
      };
    }
  }, [publicClient, address, chainId, gasPrice]);

  // Estimate gas for redemption
  // Note: Redemption is handled off-chain, this is kept for backward compatibility
  const estimateRedemption = useCallback(async (
    redemptionCode: string
  ): Promise<GasEstimate> => {
    // Redemption is handled via backend API, return minimal gas estimate
    const gasLimit = GAS_LIMITS.redeemColor;
    const totalCost = gasLimit * gasPrice;
    
    return {
      gasLimit,
      gasPrice,
      totalCost,
      totalCostEth: formatEther(totalCost),
      isLoading: false,
      error: 'Redemption handled off-chain',
    };
  }, [gasPrice]);

  // Get gas price in different units
  const getGasPriceInfo = useCallback(() => {
    if (!gasPrice) return null;

    const gasPriceGwei = Number(gasPrice) / 1e9;
    
    return {
      wei: gasPrice,
      gwei: gasPriceGwei,
      gweiFormatted: `${gasPriceGwei.toFixed(2)} Gwei`,
    };
  }, [gasPrice]);

  // Check if gas price is high
  const isHighGasPrice = useCallback(() => {
    const gasPriceGwei = Number(gasPrice) / 1e9;
    return gasPriceGwei > 50; // Consider >50 Gwei as high
  }, [gasPrice]);

  return {
    gasPrice,
    isLoading,
    error,
    estimateColorPurchase,
    estimateArtworkMinting,
    estimateRedemption,
    getGasPriceInfo,
    isHighGasPrice,
    refreshGasPrice: fetchGasPrice,
  };
}

// Hook for displaying gas costs to users
export function useGasDisplay() {
  const { gasPrice, getGasPriceInfo, isHighGasPrice } = useGasEstimation();

  const formatGasCost = useCallback((gasLimit: bigint, includeWarning = true) => {
    if (!gasPrice) return null;

    const totalCost = gasLimit * gasPrice;
    const costEth = formatEther(totalCost);
    const costUsd = 0; // Would need ETH price feed for USD conversion
    
    const gasPriceInfo = getGasPriceInfo();
    const isHigh = includeWarning && isHighGasPrice();

    return {
      costEth: `${parseFloat(costEth).toFixed(6)} ETH`,
      costUsd: costUsd > 0 ? `$${costUsd.toFixed(2)}` : null,
      gasPrice: gasPriceInfo?.gweiFormatted || '',
      isHighGas: isHigh,
      warning: isHigh ? 'Gas 费用较高，建议稍后重试' : null,
    };
  }, [gasPrice, getGasPriceInfo, isHighGasPrice]);

  return {
    formatGasCost,
    isHighGasPrice: isHighGasPrice(),
    currentGasPrice: getGasPriceInfo(),
  };
}