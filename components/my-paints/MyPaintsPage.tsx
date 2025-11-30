'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useUserCanvas } from '../../lib/hooks/useUserCanvas';
import { Canvas } from '../../lib/services/canvasService';
import { useClaimRevenue } from '../../lib/hooks/useRevenueContract';
import { recordRevenueClaim } from '../../lib/services/revenueService';

export function MyPaintsPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { canvasList, isLoading, error, refetch } = useUserCanvas();
  const { claimRevenue, isLoading: isClaiming, isSuccess, error: claimError, txHash } = useClaimRevenue();
  const [currentClaimingCanvas, setCurrentClaimingCanvas] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSettle = async (canvas: Canvas) => {
    if (!address) return;
    
    try {
      console.log('Claiming revenue for canvas:', canvas.canvas_id);
      setCurrentClaimingCanvas(canvas.canvas_id);
      await claimRevenue(parseInt(canvas.canvas_id));
    } catch (err) {
      console.error('Failed to claim revenue:', err);
      setCurrentClaimingCanvas(null);
    }
  };

  // 监听交易成功后调用recordRevenueClaim
  useEffect(() => {
    if (isSuccess && txHash && address && currentClaimingCanvas) {
      const recordClaim = async () => {
        try {
          console.log('Recording claim for canvas:', currentClaimingCanvas, 'with txHash:', txHash);
          await recordRevenueClaim({
            contributor: address,
            canvas_id: currentClaimingCanvas,
            tx_hash: txHash
          });
          console.log('Claim recorded successfully');
          refetch();
          setCurrentClaimingCanvas(null);
        } catch (err) {
          console.error('Failed to record claim:', err);
          setCurrentClaimingCanvas(null);
        }
      };
      recordClaim();
    }
  }, [isSuccess, txHash, address, currentClaimingCanvas, refetch]);

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
              const canvasWithClaimed = canvas as Canvas & { claimed?: number };
              const isClaimable = canvas.finalized === 1 && (canvasWithClaimed.claimed === 0 || canvasWithClaimed.claimed === undefined);
              const settleableAmount = parseFloat(canvas.total_raised_wei) * 0.18;
              
              return (
                <div key={canvas.canvas_id} className="w-[350px]">
                  {canvas.image_url ? (
                    <img
                      src={canvas.image_url}
                      alt={`Canvas ${canvas.canvas_id}`}
                      className="object-cover z-10 w-[350px] h-[350px] rounded"
                    />
                  ) : (
                    <div className="w-[350px] h-[350px] rounded bg-neutral-700/50 flex items-center justify-center">
                      <span className="text-neutral-500 text-sm">Canvas {canvas.canvas_id}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col px-4 pt-12 pb-4 w-full rounded-xl border border-solid bg-zinc-800 border-white border-opacity-10 -mt-12">
                    <div className="self-start text-sm font-medium text-white mb-3">
                      {formatDate(canvas.day_timestamp * 1000)} {canvas.canvas_id.slice(-5)}
                    </div>
                    
                    <div className="flex flex-col gap-2 text-xs text-white mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Canvas ID:</span>
                        <span className="font-semibold">{canvas.canvas_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contributions:</span>
                        <span className="font-semibold">{canvas.contributions || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Claimable Amount:</span>
                        <span className={`font-semibold ${isClaimable ? 'text-[#1ee11f]' : 'text-gray-500'}`}>
                          {canvas.finalized === 1 ? `${formatEth(settleableAmount.toString())} ETH` : 'Not available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-semibold ${
                          canvasWithClaimed.claimed === 1 ? 'text-green-500' : 
                          canvas.finalized === 1 ? 'text-yellow-500' : 'text-gray-500'
                        }`}>
                          {canvasWithClaimed.claimed === 1 ? 'Claimed' : 
                           canvas.finalized === 1 ? 'Ready to Claim' : 'Not Ready'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSettle(canvas)}
                      disabled={!isClaimable || isClaiming}
                      className={`w-full px-6 py-3 font-semibold text-center rounded-3xl border-0 transition-all ${
                        isClaimable && !isClaiming
                          ? 'bg-[#1ee11f] text-[#161616] cursor-pointer hover:bg-[#2fff30]'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isClaiming ? 'Claiming...' :
                       canvasWithClaimed.claimed === 1 ? 'Already Claimed' :
                       isClaimable ? `Claim ${formatEth(settleableAmount.toString())} ETH` : 'Not Claimable'}
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