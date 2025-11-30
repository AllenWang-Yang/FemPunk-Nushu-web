'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAllCanvas } from '../../lib/hooks/useAllCanvas';
import CanvasGrid from '../canvas/CanvasGrid';
import type { Canvas } from '../../lib/services/canvasService';

/**
 * GalleryPage Component
 *
 * @description
 * Gallery page displaying all collaborative artworks from past days.
 * Shows artwork cards with status (painting/mint/buy) and action buttons.
 *
 * @features
 * - Grid layout of artwork cards
 * - Navigation bar matching other pages
 * - Status-based action buttons (Paint/Mint/Buy)
 * - Participant count and price display
 * - Wallet connection integration
 */

export function GalleryPage() {
  const router = useRouter();
  const handleCanvasSelect = (canvas: Canvas) => {
    const daysSinceEpoch = Math.floor(canvas.day_timestamp / (24 * 60 * 60));
    const isToday = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) === daysSinceEpoch;
    
    if (isToday) {
      router.push('/canvas');
    } else if (canvas.finalized) {
      console.log('Buy canvas:', canvas);
    } else {
      console.log('Mint canvas:', canvas);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };



  return (
    <div className="relative overflow-hidden bg-[#161616] min-h-screen">
      {/* Background Image - Same as homepage */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-0">
        <Image
          src="/images/homepage/top_bg.png"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center top' }}
        />
        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#161616]/30 to-[#161616]/80" />
      </div>

      {/* Navigation Bar - Matches Paint page */}
      <nav className="relative left-0 top-0 w-full h-24 z-[100]">
        <div className="relative w-full h-full flex items-center justify-between px-7 max-w-[1440px] mx-auto">
          {/* Left side: Logo and navigation menu */}
          <div className="flex items-center gap-14">
            {/* Logo - Using local fempunk_logo.png from public/images/homepage */}
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
            
            {/* Navigation Links - Montserrat font */}
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
                className="font-['Montserrat',sans-serif] font-extrabold text-[18px] leading-normal uppercase text-[#1ee11f] bg-transparent border-none cursor-pointer transition-all hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                GALLERY
              </button>
              <button
                onClick={() => handleNavigation('/my-paints')}
                className="font-['Montserrat',sans-serif] font-normal text-[18px] leading-normal uppercase text-white bg-transparent border-none cursor-pointer transition-all hover:text-[#1ee11f] hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                MY PAINTS
              </button>
            </nav>
          </div>
          
          {/* Right side: Connect wallet button */}
          <div className="[&_button]:!bg-black/60 [&_button]:!border-white/30 [&_button]:hover:!bg-black/80">
            <ConnectButton 
              chainStatus="icon"
              accountStatus="address"
              showBalance={false}
            />
          </div>
        </div>
      </nav>

      {/* Gallery Grid */}
      <div className="relative z-10 mt-10 w-full max-w-[1440px] mx-auto">
        <CanvasGrid onCanvasSelect={handleCanvasSelect} />
      </div>

    </div>
  );
}

export default GalleryPage;
