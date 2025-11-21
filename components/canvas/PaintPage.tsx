"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useWalletModal } from '../../lib/hooks/useWalletModal';
import { WalletModal } from '../wallet/WalletModal';

/**
 * PaintPage Component
 *
 * @description
 * Main painting canvas page for the collaborative art project.
 * Displays the canvas interface with painting tools and daily Nvshu theme.
 *
 * @features
 * - Dark-themed UI matching the Figma design
 * - Navigation bar with logo and main menu items
 * - Large canvas area (910x910px)
 * - Right sidebar with:
 *   - Painting toolbar (zoom, brush controls, color management)
 *   - Info panel showing daily Nvshu character and theme
 *   - Educational content about Nvshu script
 *
 * @design
 * - Background: #161616 (dark)
 * - Navigation: Semi-transparent with border
 * - Canvas: Centered with background image
 * - Toolbar: Zinc-800 with icon buttons
 * - Info Panel: neutral-800 with structured sections
 */

export function PaintPage() {
  const router = useRouter();
  const { modalState, openModal, closeModal } = useWalletModal();

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
      {/*
        NAVIGATION BAR - Matches homepage design exactly
        - Semi-transparent dark background with subtle border
        - Contains logo (fempunk_logo.png), menu items (PAINT, COLOR, GALLERY, COLLECT)
        - Connect wallet button on the right
        - Uses Montserrat font family to match homepage
        - Fully responsive with flex-wrap for mobile
      */}
      <nav className="relative left-0 top-0 w-full h-24 z-[100]">
        <div className="relative w-full h-full flex items-center justify-between px-7 max-w-[1440px] mx-auto">
          {/* Left side: Logo and navigation menu */}
          <div className="flex items-center gap-14">
            {/* Logo - Using local fempunk_logo.png from public/images/homepage */}
            <button
              onClick={() => router.push("/")}
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
                onClick={() => router.push("/canvas")}
                className="font-['Montserrat',sans-serif] font-extrabold text-[18px] leading-normal uppercase text-[#1ee11f] bg-transparent border-none cursor-pointer transition-all hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                PAINT
              </button>
              <button
                onClick={() => router.push("/buy")}
                className="font-['Montserrat',sans-serif] font-normal text-[18px] leading-normal uppercase text-white bg-transparent border-none cursor-pointer transition-all hover:text-[#1ee11f] hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                COLOR
              </button>
              <button
                onClick={() => router.push("/gallery")}
                className="font-['Montserrat',sans-serif] font-normal text-[18px] leading-normal uppercase text-white bg-transparent border-none cursor-pointer transition-all hover:text-[#1ee11f] hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
              >
                GALLERY
              </button>
            </nav>
          </div>
          
          {/* Right side: Connect wallet button */}
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2.5 w-40 h-10 bg-black/60 border border-white/30 rounded-[10px] font-['Montserrat',sans-serif] font-normal text-base text-white cursor-pointer transition-all hover:bg-black/80 hover:border-white/80 hover:-translate-y-px px-3"
          >
            <Image
              src="/images/homepage/wallet.png"
              alt=""
              width={20}
              height={20}
              className="flex-shrink-0"
            />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
              Connect
            </span>
          </button>
        </div>
      </nav>

      {/*
        MAIN CONTENT AREA
        - Two-column layout: Canvas (66%) + Sidebar (34%)
        - Canvas positioned at X=8, Y=104 with size 910x910
        - Responsive: stacks vertically on mobile
      */}
      <div className="relative w-full pt-2 px-2 z-10">
        <div className="flex gap-5 max-md:flex-col">
          {/*
            LEFT COLUMN - CANVAS AREA (66% width)
            - Canvas: 910x910px positioned at X=8, Y=104
            - Background: dark with subtle pattern
            - Ready for painting functionality integration
          */}
          <div className="w-[66%] max-md:ml-0 max-md:w-full">
            <div className="flex relative flex-col items-start justify-start w-full">
              {/* Canvas Container - 910x910 */}
              <div className="relative w-[910px] h-[910px] bg-neutral-800/50 backdrop-blur-sm rounded-lg border border-neutral-700/50 overflow-hidden shadow-2xl">
                {/* 
                  TODO: Canvas element will be added here
                  - Size: 910x910px
                  - Features: zoom, pan, brush tools, color selection
                  - Integration with fabric.js or canvas API
                */}
                <canvas
                  id="paint-canvas"
                  width={910}
                  height={910}
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(45, 45, 45, 0.8) 100%)',
                    cursor: 'crosshair'
                  }}
                />
                
                {/* Overlay message for non-logged-in users */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center px-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Connect to Start Painting
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Mint colors and join the collaborative canvas
                    </p>
                    <button 
                      onClick={() => openModal()}
                      className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all transform hover:scale-105"
                    >
                      🌈 Connect Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*
            RIGHT COLUMN (34% width)
            - Split into two sub-columns: Toolbar (21%) + Info Panel (79%)
          */}
          <div className="ml-5 w-[34%] max-md:ml-0 max-md:w-full">
            <div className="grow max-md:mt-10 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col">
                {/*
                  TOOLBAR COLUMN
                  - Fixed width: 94px (90px + padding)
                  - Height: 540px as per Figma design
                  - Sticky positioning to follow scroll
                  - Contains all painting tools and controls
                  - Organized in sections separated by dividers
                */}
                <div className="w-[94px] flex-shrink-0 max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col items-center py-3 w-[94px] min-h-[680px] rounded-xl border border-solid bg-zinc-800/80 backdrop-blur-sm border-white border-opacity-10 sticky top-[120px] max-md:relative max-md:top-0 max-md:mt-8 max-md:w-full max-md:h-auto">
                    {/* Section 1: Move and Hand tools for canvas navigation */}
                    <div className="flex gap-5 justify-between w-[70px]">
                      <button className="hover:opacity-70 transition-opacity" title="Move Tool">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                      <button className="hover:opacity-70 transition-opacity" title="Hand Tool">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                        </svg>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="object-contain self-stretch mt-3 w-full h-px bg-white bg-opacity-10" />

                    {/* Section 2: Zoom controls for canvas scaling */}
                    <div className="flex gap-5 justify-between mt-3 w-[70px]">
                      <button className="hover:opacity-70 transition-opacity" title="Zoom Out">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                        </svg>
                      </button>
                      <button className="hover:opacity-70 transition-opacity" title="Zoom In">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="object-contain self-stretch mt-3 w-full h-px bg-white bg-opacity-10" />

                    {/* Section 3: Brush size controls with increment/decrement */}
                    <div className="flex gap-3 items-center mt-4 text-xs text-center text-white whitespace-nowrap w-[66px]">
                      <button className="hover:opacity-70 transition-opacity" title="Decrease Brush Size">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                        </svg>
                      </button>
                      <div className="self-stretch">1px</div>
                      <button className="hover:opacity-70 transition-opacity" title="Increase Brush Size">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/*
                      Section 4: Color Management
                      - Shows "My Color" label
                      - Displays color preview (locked until minted)
                      - Mint Color button to purchase colors
                    */}
                    <div className="flex flex-col self-stretch px-2.5 mt-4 text-white">
                      <div className="object-contain w-full h-px bg-white bg-opacity-10" />
                      <div className="mt-2.5 text-xs">
                        My Color
                      </div>
                      {/* Color preview - locked state */}
                      <div className="mt-2.5 w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center self-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <button 
                        onClick={() => openModal()}
                        className="w-[74px] self-center px-2.5 py-1.5 mt-2.5 text-xs font-semibold text-center bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors"
                      >
                        Mint Color
                      </button>
                    </div>

                    {/* Divider with flexible spacing */}
                    <div className="object-contain self-stretch mt-auto mb-3 w-full h-px bg-white bg-opacity-10 max-md:mt-10" />

                    {/*
                      Section 5: Action Buttons
                      - Undo/Redo for canvas history
                      - Import image functionality
                      - Clear canvas
                      - Save artwork
                    */}
                    <div className="flex gap-2.5 mt-2.5">
                      <button className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors" title="Undo">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors" title="Redo">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex gap-2.5 mt-2.5">
                      <button className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors" title="Import Image">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors" title="Clear Canvas">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <button className="w-[74px] flex gap-2 items-center justify-center mt-2.5 px-3 py-2 bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors">
                      <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      <span className="text-xs font-semibold text-white">Save</span>
                    </button>
                  </div>
                </div>

                {/*
                  INFO PANEL COLUMN
                  - Fixed width: 362px as per Figma design
                  - Displays daily Nvshu character and theme
                  - Educational content about Nvshu script
                  - Countdown timer for canvas lock
                */}
                <div className="ml-5 w-[340px] flex-shrink-0 max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col pt-4 pb-80 w-full border border-solid bg-neutral-800/80 backdrop-blur-sm border-neutral-700 max-md:pb-24 max-md:mt-4">
                    {/*
                      SECTION 1: Nvshu of Today
                      - Shows the daily Nvshu character
                      - Includes translation
                      - Countdown timer showing when canvas locks
                    */}
                    <div className="flex flex-col px-4 font-medium text-white max-md:px-2.5">
                      <div className="flex justify-between items-center gap-2">
                        <div className="text-base">
                          Nvshu of Today
                        </div>
                        <div className="flex gap-2.5 justify-center items-center px-1 py-0.5 text-xs bg-black whitespace-nowrap">
                          <div>Canvas locks in 13:13:34</div>
                        </div>
                      </div>
                    </div>

                    {/* Nvshu Character - Placeholder for daily character */}
                    <div className="flex relative flex-col justify-center self-center px-4 py-3.5 mt-3.5 max-w-full w-[167px] h-[167px]">
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20 flex items-center justify-center">
                        {/* TODO: Replace with actual Nvshu character image */}
                        <div className="text-6xl">女</div>
                      </div>
                    </div>

                    {/* Translation */}
                    <div className="flex self-center mt-1.5 max-w-full text-xs leading-loose w-[150px]">
                      <div className="grow text-white">Nvshu Translate：</div>
                      <div className="font-medium text-green-500">Spring</div>
                    </div>

                    {/* Divider */}
                    <div className="object-contain mt-4 w-full h-px bg-white bg-opacity-10" />

                    {/*
                      SECTION 2: Theme of Today
                      - Displays the daily painting theme
                      - Shows current day count
                      - Highlighted in green (accent color)
                    */}
                    <div className="flex flex-col px-4 mt-4 font-medium text-white max-md:px-2.5">
                      <div className="flex justify-between items-center gap-2">
                        <div className="text-base">Theme of Today</div>
                        <div className="flex gap-2.5 justify-center items-center px-1 py-0.5 text-xs bg-black whitespace-nowrap">
                          <div>Day 24</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center items-center p-2 mt-3 mx-4 text-xs font-medium leading-loose text-green-500 bg-black max-md:mx-2.5">
                      <div className="w-full">
                        Spring Garden
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="object-contain mt-3 w-full h-px bg-white bg-opacity-10" />

                    {/*
                      SECTION 3: What is Nvshu
                      - Educational content explaining Nvshu script
                      - Cultural and historical context
                      - Emphasizes women's empowerment and creativity
                    */}
                    <div className="flex flex-col px-4 mt-4 w-full text-white max-md:px-2.5">
                      <div className="text-base font-medium">
                        What is Nvshu
                      </div>
                      <div className="flex justify-center items-center p-4 mt-3 text-xs leading-5 bg-black">
                        <div className="w-full">
                          Nvshu is a unique script created{" "}
                          <span className="font-semibold">by women</span> in{" "}
                          <span className="font-semibold">Jiangyong</span>{" "}
                          County, Hunan, China. Developed as a way for women to{" "}
                          <span className="font-semibold">
                            express their emotions
                          </span>
                          , write poems, and{" "}
                          <span className="font-semibold">communicate</span> with
                          one another in a patriarchal society, its{" "}
                          <span className="font-semibold">elegant</span>, slender
                          strokes embody grace and resilience. Today, Nvshu stands
                          as a powerful symbol of{" "}
                          <span className="font-semibold">
                            women&apos;s creativity,
                          </span>{" "}
                          connection, and cultural heritage.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        trigger="canvas"
      />
    </div>
  );
}

export default PaintPage;
