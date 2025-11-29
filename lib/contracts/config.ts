import { sepolia, mainnet, baseSepolia } from 'viem/chains';
import { CONTRACT_ADDRESSES, ColorNFTABI, ArtworkNFTABI, FemCanvasABI, FemCanvasRevenueABI } from './abis';

// Export individual contract addresses for easy access
export const FEM_CANVAS_REVENUE_ADDRESS = CONTRACT_ADDRESSES.sepolia.femCanvasRevenue as `0x${string}`;
export const FEM_CANVAS_ADDRESS = CONTRACT_ADDRESSES.sepolia.femCanvas as `0x${string}`;
export const COLOR_NFT_ADDRESS = CONTRACT_ADDRESSES.sepolia.colorNFT as `0x${string}`;

// Network configuration
export const SUPPORTED_CHAINS = [sepolia, mainnet, baseSepolia] as const;

export const DEFAULT_CHAIN = baseSepolia; // Development default

// Contract configurations per network
export const getColorNFTContract = (chainId: number) => {
  const isMainnet = chainId === mainnet.id;
  const isBaseSepolia = chainId === baseSepolia.id;
  const addresses = isMainnet ? CONTRACT_ADDRESSES.mainnet : 
                   isBaseSepolia ? CONTRACT_ADDRESSES.baseSepolia : 
                   CONTRACT_ADDRESSES.sepolia;
  
  return {
    address: addresses.colorNFT as `0x${string}`,
    abi: ColorNFTABI,
    chainId,
  };
};

export const getArtworkNFTContract = (chainId: number) => {
  const isMainnet = chainId === mainnet.id;
  const isBaseSepolia = chainId === baseSepolia.id;
  const addresses = isMainnet ? CONTRACT_ADDRESSES.mainnet : 
                   isBaseSepolia ? CONTRACT_ADDRESSES.baseSepolia : 
                   CONTRACT_ADDRESSES.sepolia;
  
  return {
    address: addresses.artworkNFT as `0x${string}`,
    abi: ArtworkNFTABI,
    chainId,
  };
};

export const getFemCanvasContract = (chainId: number) => {
  const isMainnet = chainId === mainnet.id;
  const isBaseSepolia = chainId === baseSepolia.id;
  const addresses = isMainnet ? CONTRACT_ADDRESSES.mainnet : 
                   isBaseSepolia ? CONTRACT_ADDRESSES.baseSepolia : 
                   CONTRACT_ADDRESSES.sepolia;
  
  return {
    address: addresses.femCanvas as `0x${string}`,
    abi: FemCanvasABI,
    chainId,
  };
};

export const getFemCanvasRevenueContract = (chainId: number) => {
  const isMainnet = chainId === mainnet.id;
  const isBaseSepolia = chainId === baseSepolia.id;
  const addresses = isMainnet ? CONTRACT_ADDRESSES.mainnet : 
                   isBaseSepolia ? CONTRACT_ADDRESSES.baseSepolia : 
                   CONTRACT_ADDRESSES.sepolia;
  
  return {
    address: addresses.femCanvasRevenue as `0x${string}`,
    abi: FemCanvasRevenueABI,
    chainId,
  };
};

// Environment-based configuration
export const getContractConfig = () => {
  const env = process.env.NODE_ENV;
  const isProduction = env === 'production';
  
  return {
    defaultChain: isProduction ? mainnet : sepolia,
    supportedChains: SUPPORTED_CHAINS,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
  };
};

// Gas estimation configurations
export const GAS_LIMITS = {
  purchaseColor: 150000n,
  mintArtwork: 300000n,
  redeemColor: 100000n,
  transfer: 21000n,
  receiveRevenue: 200000n,
  claimRevenue: 150000n,
} as const;

// Price configurations (in wei)
export const PRICE_CONFIG = {
  baseColorPrice: 10000000000000000n, // 0.01 ETH
  priceIncrement: 1000000000000000n,   // 0.001 ETH per day
  maxColorPrice: 100000000000000000n,  // 0.1 ETH
} as const;