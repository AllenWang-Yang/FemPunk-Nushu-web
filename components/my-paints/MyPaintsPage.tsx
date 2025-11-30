'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useUserCanvas } from '../../lib/hooks/useUserCanvas';

/**
 * MyPaintsPage Component
 *
 * @description
 * Displays user's participated artworks with contribution details and settlement options.
 * Shows contribution amount, settleable amount, and settlement button.
 *
 * @features
 * - Wallet connection required
 * - Grid layout of participated artworks
 * - Contribution and earnings display
 * - Settlement button (active only when canvas status is 3)
 * - Navigation bar matching other pages
 */

interface CanvasContribution {
  canvas_id: string;
  day_timestamp: number;
  metadata_uri: string;
  total_raised_wei: string;
  settleable_amount: number;
  finalized: number;
  contributions: number;
  created_ts: number;
  status?: number; // 0=stopped, 1=active, 2=minted, 3=settled
}

// Mock data for testing
const MOCK_CANVASES: CanvasContribution[] = [
  {
    canvas_id: '123456789',
    day_timestamp: Date.now() - 86400000 * 2, // 2 days ago
    metadata_uri: '',
    total_raised_wei: '180000000000000000',
    settleable_amount: 32400000000000000,
    finalized: 1,
    contributions: 150,
    created_ts: Date.now() - 86400000 * 2,
    status: 3, // Settled - green button
  },
  {
    canvas_id: '987654321',
    day_timestamp: Date.now() - 86400000 * 5, // 5 days ago
    metadata_uri: '',
    total_raised_wei: '240000000000000000',
    settleable_amount: 0,
    finalized: 0,
    contributions: 89,
    created_ts: Date.now() - 86400000 * 5,
    status: 2, // Minted - gray button
  },
  {
    canvas_id: '456789123',
    day_timestamp: Date.now() - 86400000 * 10, // 10 days ago
    metadata_uri: '',
    total_raised_wei: '150000000000000000',
    settleable_amount: 15000000000000000,
    finalized: 0,
    contributions: 45,
    created_ts: Date.now() - 86400000 * 10,
    status: 1, // Active - gray button
  },
];

export function MyPaintsPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { canvasList, isLoading, error } = useUserCanvas();



  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSettle = async (canvas: CanvasContribution) => {
    // Disabled for demo - no operation allowed
    console.log('Settlement disabled for demo. Canvas:', canvas.canvas_id);
    return;
  };

  const formatEth = (wei: string) => {
    try {
      const ethValue = parseFloat(wei) / 1e18;
      return ethValue.toFixed(4);
    } catch {
      return '0.0000';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative overflow-hidden bg-[#161616] min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-0">
        <Image
          src="/images/homepage/top_bg.png"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#161616]/30 to-[#161616]/80" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative left-0 top-0 w-full h-24 z-[100]">
        <div className="relative w-full h-full flex items-center justify-between px-7 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-14">
            <button
              onClick={() => handleNavigation('/')}
              className="relative w-[168px] h-[51.902px] flex items-center overflow-hidden bg-transparent border-none cursor-pointer transition-opacity hover:opacity-80 p-0"
            >
              <Image
                src="/images/homepage/fempunk_logo.png"
                alt="FemPunk Logo"
                width={168}
                height={52}
                priority
                className="h-full w-auto"
              />
            </button>
            
            <nav className="flex items-center gap-14">
              <button
                onClick={() => handleNavigation('/canvas')}
                className="font-['Montserrat',sans-serif] font-normal text-[18px] leading-normal uppercase text-white bg-transparent border-none cursor-pointer transition-all hover:text-[#1ee11f] hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                PAINT
              </button>
              <button
                onClick={() => handleNavigation('/color')}
                className="font-['Montserrat',sans-serif] font-normal text-[18px] leading-normal uppercase text-white bg-transparent border-none cursor-pointer transition-all hover:text-[#1ee11f] hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                COLOR
              </button>
              <button
                onClick={() => handleNavigation('/gallery')}
                className="font-['Montserrat',sans-serif] font-normal text-[18px] leading-normal uppercase text-white bg-transparent border-none cursor-pointer transition-all hover:text-[#1ee11f] hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                GALLERY
              </button>
              <button
                onClick={() => handleNavigation('/my-paints')}
                className="font-['Montserrat',sans-serif] font-extrabold text-[18px] leading-normal uppercase text-[#1ee11f] bg-transparent border-none cursor-pointer transition-all hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                MY PAINTS
              </button>
            </nav>
          </div>
          
          <div className="[&_button]:!bg-black/60 [&_button]:!border-white/30 [&_button]:hover:!bg-black/80">
            <ConnectButton 
              chainStatus="icon"
              accountStatus="address"
              showBalance={false}
            />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 mt-10">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-8">Please connect your wallet to view your paintings</p>
              <ConnectButton />
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-lg">Loading your paintings...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-400 text-lg">{error.message}</div>
          </div>
        ) : canvasList.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">No Paintings Yet</h2>
              <p className="text-gray-400 mb-8">Start creating to see your artworks here</p>
              <button
                onClick={() => handleNavigation('/canvas')}
                className="bg-[#1ee11f] text-[#161616] font-semibold px-8 py-3 rounded-3xl hover:bg-[#2fff30] transition-all"
              >
                Start Painting
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 items-start justify-center">
            {canvasList.map((canvas) => {
              // Canvas is settleable when finalized
              const isSettleable = canvas.finalized === 1;
              const settleableAmount = parseFloat(canvas.total_raised_wei) * 0.18; // 18% of total raised
              
              return (
                <div key={canvas.canvas_id} className="w-[350px]">
                  {canvas.metadata_uri ? (
                    <Image
                      src={canvas.metadata_uri}
                      alt={`Canvas ${canvas.canvas_id}`}
                      width={350}
                      height={350}
                      className="object-cover z-10 w-[350px] h-[350px] rounded"
                    />
                  ) : (
                    <div className="w-[350px] h-[350px] rounded bg-neutral-700/50 flex items-center justify-center">
                      <span className="text-neutral-500 text-sm">Canvas {canvas.canvas_id}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col px-4 pt-12 pb-4 w-full rounded-xl border border-solid bg-zinc-800 border-white border-opacity-10 -mt-12">
                    <div className="self-start text-sm font-medium text-white mb-3">
                      {formatDate(canvas.day_timestamp * 1000)}
                    </div>
                    
                    <div className="flex flex-col gap-2 text-xs text-white mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Raised:</span>
                        <span className="font-semibold">{formatEth(canvas.total_raised_wei)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Settleable Amount:</span>
                        <span className={`font-semibold ${isSettleable ? 'text-[#1ee11f]' : 'text-gray-500'}`}>
                          {isSettleable ? `${formatEth(settleableAmount.toString())} ETH` : 'Not available'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSettle(canvas)}
                      disabled={true}
                      className={`w-full px-6 py-3 font-semibold text-center rounded-3xl border-0 cursor-not-allowed transition-all ${
                        isSettleable
                          ? 'bg-[#1ee11f] text-[#161616]'
                          : 'bg-gray-600 text-gray-400'
                      }`}
                    >
                      {isSettleable ? `Settle ${formatEth(settleableAmount.toString())} ETH` : 'Not Settleable'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPaintsPage;
