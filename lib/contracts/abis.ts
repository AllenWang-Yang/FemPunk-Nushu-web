// Smart Contract ABIs for FemPunk NüShu Platform
// This file is kept for backward compatibility
// New code should import from lib/contracts/abis/

export {
  FemCanvasABI,
  FemColorsABI,
  FemCanvasContributionABI,
  FemCanvasRevenueABI,
  FemColorsABI as ColorNFTABI,
} from './abis/index';

// Legacy ArtworkNFT ABI (kept for backward compatibility)
export const ArtworkNFTABI = [
  // ERC721 Standard Functions
  {
    inputs: [{ name: "to", type: "address" }, { name: "tokenId", type: "uint256" }],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // ERC721 Standard Functions
  {
    inputs: [{ name: "to", type: "address" }, { name: "tokenId", type: "uint256" }],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  // Custom Artwork NFT Functions
  {
    inputs: [
      { name: "canvasData", type: "string" },
      { name: "contributors", type: "address[]" },
      { name: "contributions", type: "uint256[]" },
      { name: "dailyThemeId", type: "string" }
    ],
    name: "mintArtwork",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getArtworkDetails",
    outputs: [
      {
        components: [
          { name: "canvasData", type: "string" },
          { name: "contributors", type: "address[]" },
          { name: "contributions", type: "uint256[]" },
          { name: "dailyThemeId", type: "string" },
          { name: "mintedAt", type: "uint256" },
          { name: "price", type: "uint256" }
        ],
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "contributor", type: "address" }],
    name: "getContributorArtworks",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "contributors", type: "address[]" },
      { indexed: false, name: "dailyThemeId", type: "string" }
    ],
    name: "ArtworkMinted",
    type: "event"
  }
] as const;

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  sepolia: {
    colorNFT: '0xcf7ec06cA3929679650E18020128443d403f5529',
    artworkNFT: '0x8527C2b70Cd541E7d179beF4751248967dfe2794',
    femCanvas: '0x8527C2b70Cd541E7d179beF4751248967dfe2794',
    femCanvasContribution: '0xDF3826f94f66ACDC1CCB65Eb1ef77DF1C629129d',
    femCanvasRevenue: '0x00d6dE1C6a534A8d4a2dCeF5d6F4Cd57Aa20A522',
  },
  baseSepolia: {
    colorNFT: process.env.NEXT_PUBLIC_COLORS_CONTRACT_ADDRESS || '0xcf7ec06cA3929679650E18020128443d403f5529',
    artworkNFT: process.env.NEXT_PUBLIC_CANVAS_CONTRACT_ADDRESS || '0x8527C2b70Cd541E7d179beF4751248967dfe2794',
    femCanvas: process.env.NEXT_PUBLIC_CANVAS_CONTRACT_ADDRESS || '0x8527C2b70Cd541E7d179beF4751248967dfe2794',
    femCanvasContribution: process.env.NEXT_PUBLIC_CONTRIBUTION_CONTRACT_ADDRESS || '0xDF3826f94f66ACDC1CCB65Eb1ef77DF1C629129d',
    femCanvasRevenue: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS || '0x00d6dE1C6a534A8d4a2dCeF5d6F4Cd57Aa20A522',
  },
  mainnet: {
    colorNFT: process.env.NEXT_PUBLIC_COLORS_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    artworkNFT: process.env.NEXT_PUBLIC_CANVAS_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    femCanvas: process.env.NEXT_PUBLIC_CANVAS_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    femCanvasContribution: process.env.NEXT_PUBLIC_CONTRIBUTION_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    femCanvasRevenue: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  }
} as const;

// Type definitions for contract interactions
import type { FemColorsABI } from './abis/FemColors';

export type ColorNFTContract = {
  address: `0x${string}`;
  abi: typeof FemColorsABI;
};

export type ArtworkNFTContract = {
  address: `0x${string}`;
  abi: typeof ArtworkNFTABI;
};