'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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

  const artworks = [
    {
      id: '1',
      day: 24,
      title: 'Spring Garden',
      participants: 100,
      status: 'painting' as const,
      imageUrl: '',
    },
    {
      id: '2',
      day: 23,
      title: 'Spring Garden',
      participants: 100,
      status: 'mint' as const,
      price: 0.24,
      imageUrl: '',
    },
    {
      id: '3',
      day: 22,
      title: 'Spring Garden',
      participants: 100,
      status: 'buy' as const,
      price: 0.24,
      imageUrl: '',
    },
    {
      id: '4',
      day: 21,
      title: 'Spring Garden',
      participants: 100,
      status: 'buy' as const,
      price: 0.24,
      imageUrl: '',
    },
    {
      id: '5',
      day: 20,
      title: 'Spring Garden',
      participants: 100,
      status: 'buy' as const,
      price: 0.24,
      imageUrl: '',
    },
    {
      id: '6',
      day: 19,
      title: 'Spring Garden',
      participants: 100,
      status: 'buy' as const,
      price: 0.24,
      imageUrl: '',
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleActionClick = (artwork: typeof artworks[0]) => {
    switch (artwork.status) {
      case 'painting':
        router.push('/canvas');
        break;
      case 'mint':
        console.log('Mint artwork:', artwork);
        break;
      case 'buy':
        console.log('Buy artwork:', artwork);
        break;
    }
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
      <div className="relative z-10 flex flex-wrap gap-2.5 items-start justify-center mt-10 w-full max-w-[1440px] max-md:max-w-full px-4 mx-auto">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="w-[350px]">
            {artwork.imageUrl ? (
              <Image
                src={artwork.imageUrl}
                alt={`Day ${artwork.day} - ${artwork.title}`}
                width={350}
                height={350}
                className="object-cover z-10 w-[350px] h-[350px] rounded"
              />
            ) : (
              <div className="w-[350px] h-[350px] rounded bg-neutral-700/50 flex items-center justify-center">
                <span className="text-neutral-500 text-sm">Artwork {artwork.day}</span>
              </div>
            )}
            <div className="flex flex-col px-4 pt-12 pb-4 w-full rounded-xl border border-solid bg-zinc-800 border-white border-opacity-10 -mt-12">
              <div className="self-start text-sm font-medium text-white">
                Day {artwork.day}｜{artwork.title}
              </div>
              <div className="flex gap-5 justify-between mt-1.5 w-full text-xs whitespace-nowrap">
                <div className="flex gap-3 self-start text-white">
                  <div className="flex gap-1 items-center">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <div>{artwork.participants}</div>
                  </div>
                  {artwork.status !== 'painting' && (
                    <div className="flex gap-1 items-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 320 512">
                        <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                      </svg>
                      <div>{artwork.price}ETH</div>
                    </div>
                  )}
                  {artwork.status === 'painting' && (
                    <div>Painting now...</div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(artwork);
                  }}
                  className={`flex flex-col justify-center px-6 py-3 font-semibold text-center rounded-3xl border-0 cursor-pointer transition-all hover:scale-105 max-md:px-5 ${
                    artwork.status === 'painting'
                      ? 'bg-violet-600 text-white hover:bg-violet-700'
                      : artwork.status === 'mint'
                      ? 'bg-[#1ee11f] text-[#161616] hover:bg-[#2fff30]'
                      : 'bg-white bg-opacity-10 border border-solid border-white border-opacity-50 text-white hover:bg-white hover:bg-opacity-20 hover:border-opacity-80'
                  }`}
                >
                  <div>
                    {artwork.status === 'painting' ? 'Paint' : artwork.status === 'mint' ? 'Mint' : 'Buy'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default GalleryPage;
