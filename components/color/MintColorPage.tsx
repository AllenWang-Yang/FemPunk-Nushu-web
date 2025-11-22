"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { WalletModal } from "../wallet/WalletModal";
import { useWalletModal } from "../../lib/hooks/useWalletModal";
import ColorWheel from "./ColorWheel";

function MintColorPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const {
    modalState,
    openModal: openWalletModal,
    closeModal: closeWalletModal,
  } = useWalletModal();
  const [invitationCode, setInvitationCode] = React.useState("");
  const [selectedColor, setSelectedColor] = React.useState("#AD4AFF");

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleConnectWallet = () => {
    if (!isConnected) {
      openWalletModal();
    }
  };

  const handleMintColor = () => {
    if (!isConnected) {
      openWalletModal();
      return;
    }
    console.log("Minting color:", selectedColor);
  };

  const handleFreeReceive = () => {
    if (!isConnected) {
      openWalletModal();
      return;
    }
    if (invitationCode.trim()) {
      console.log("Redeeming invitation code:", invitationCode);
    }
  };

  const userColors = [
    { id: 1, hex: "#592386" },
    { id: 2, hex: "#237286" },
    { id: 3, hex: "#FFE1E1" },
    { id: 4, hex: "#F1674F" },
  ];

  return (
    <>
      <div className="overflow-x-hidden relative w-full bg-[#161616] min-h-[1024px] max-md:min-h-[800px]">
        {/* Background Image - Same as homepage */}
        <div className="fixed inset-0 w-full h-screen pointer-events-none z-0">
          <img
            src="/images/homepage/top_bg.png"
            alt=""
            className="absolute left-0 top-0 w-full h-auto object-cover"
            style={{ objectPosition: "center top" }}
          />
          {/* Gradient overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#161616]/30 to-[#161616]/80" />
        </div>
        {/* Navigation Bar - Matches paint page design */}
        <nav
          className="relative left-0 top-0 w-full h-24 z-[100]"
          style={{ position: "relative" }}
        >
          <div className="relative w-full h-full flex items-center justify-between px-7 max-w-[1440px] mx-auto">
            {/* Left side: Logo and navigation menu */}
            <div className="flex items-center gap-14">
              {/* Logo */}
              <button
                onClick={() => handleNavigation("/")}
                className="relative w-[168px] h-[51.902px] flex items-center overflow-hidden bg-transparent border-none cursor-pointer transition-opacity hover:opacity-80 p-0"
              >
                <img
                  src="/images/homepage/fempunk_logo.png"
                  alt="FemPunk Logo"
                  className="h-full w-auto"
                />
              </button>

              {/* Navigation Links */}
              <nav className="flex items-center gap-14">
                <button
                  onClick={() => handleNavigation("/canvas")}
                  className="font-['Montserrat',sans-serif] font-normal text-[18px] leading-normal uppercase text-white bg-transparent border-none cursor-pointer transition-all hover:text-[#1ee11f] hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
                >
                  PAINT
                </button>
                <button
                  onClick={() => handleNavigation("/color")}
                  className="font-['Montserrat',sans-serif] font-extrabold text-[18px] leading-normal uppercase text-[#1ee11f] bg-transparent border-none cursor-pointer transition-all hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
                >
                  COLOR
                </button>
                <button
                  onClick={() => handleNavigation("/gallery")}
                  className="font-['Montserrat',sans-serif] font-normal text-[18px] leading-normal uppercase text-white bg-transparent border-none cursor-pointer transition-all hover:text-[#1ee11f] hover:bg-[rgba(30,225,31,0.1)] px-3 py-2 rounded"
                >
                  GALLERY
                </button>
              </nav>
            </div>

            {/* Right side: Connect wallet button */}
            <button
              onClick={handleConnectWallet}
              className="flex items-center justify-center gap-2.5 w-40 h-10 bg-black/60 border border-white/30 rounded-[10px] font-['Montserrat',sans-serif] font-normal text-base text-white cursor-pointer transition-all hover:bg-black/80 hover:border-white/80 hover:-translate-y-px px-3"
            >
              <img
                src="/images/homepage/wallet.png"
                alt=""
                className="w-5 h-5 flex-shrink-0"
              />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                {isConnected
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : "Connect"}
              </span>
            </button>
          </div>
        </nav>
        <div className="relative z-10">
          <div className="absolute top-8 text-2xl font-medium text-right text-white h-[29px] right-[487px] w-[147px] max-md:static max-md:mx-auto max-md:mt-8 max-md:mb-6 max-md:w-auto max-md:text-center max-sm:mx-auto max-sm:mt-6 max-sm:mb-5 max-sm:text-xl">
            Mint a Color
          </div>
        </div>
        <div className="relative z-10">
          <div className="absolute h-[382px] left-[354px] top-[130px] w-[382px] max-md:left-2/4 max-md:-translate-x-2/4 max-md:h-[300px] max-md:top-[180px] max-md:w-[300px] max-sm:h-[250px] max-sm:top-[140px] max-sm:w-[250px]">
            <ColorWheel
              size={382}
              onChange={setSelectedColor}
              onChangeComplete={setSelectedColor}
            />
          </div>
          <div>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="selected-color-circle"
              style={{
                width: "40px",
                height: "40px",
                position: "absolute",
                left: "810px",
                top: "184px",
              }}
            >
              <circle
                cx="20"
                cy="20"
                r="19.5"
                fill={selectedColor}
                stroke="white"
              />
            </svg>
          </div>
          <div className="absolute rounded-xl border border-solid border-white border-opacity-30 h-[46px] left-[866px] top-[181px] w-[121px] max-md:left-2/4 max-md:ml-14 max-md:-translate-x-2/4 max-md:top-[497px] max-sm:ml-10 max-sm:h-10 max-sm:top-[407px] max-sm:w-[100px]">
            <div className="absolute top-3 left-4 text-base text-white h-[22px] w-[70px] max-sm:top-2.5 max-sm:left-3 max-sm:text-sm">
              {selectedColor}
            </div>
          </div>
          <div className="absolute h-5 text-base font-medium text-center text-white left-[810px] top-[248px] w-[45px] max-md:left-2/4 max-md:ml-0 max-md:-translate-x-2/4 max-md:top-[563px] max-sm:ml-0 max-sm:text-sm max-sm:top-[467px]">
            Price:
          </div>
          <div className="absolute h-5 text-base text-center text-white left-[865px] top-[248px] w-[89px] max-md:left-2/4 max-md:ml-0 max-md:-translate-x-2/4 max-md:top-[563px] max-sm:ml-0 max-sm:text-sm max-sm:top-[467px]">
            0.0001 ETH
          </div>
          <div className="absolute text-xs text-center line-through h-[15px] left-[865px] text-white text-opacity-50 top-[272px] w-[70px] max-md:left-2/4 max-md:ml-0 max-md:-translate-x-2/4 max-md:top-[587px] max-sm:ml-0 max-sm:text-xs max-sm:top-[487px]">
            0.0006 ETH
          </div>
          <button
            onClick={handleMintColor}
            className="absolute h-12 bg-violet-600 rounded-3xl cursor-pointer left-[806px] top-[311px] w-[280px] max-md:left-2/4 max-md:-translate-x-2/4 max-md:top-[626px] max-sm:h-11 max-sm:top-[516px] max-sm:w-[250px] hover:bg-violet-700 transition-colors"
          >
            <div className="absolute top-3.5 h-5 text-base font-semibold text-center text-white left-[97px] w-[86px] max-sm:top-3 max-sm:text-sm max-sm:left-[82px]">
              Mint Color
            </div>
          </button>
          <div>
            <svg
              width="280"
              height="22"
              viewBox="0 0 280 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="divider"
              style={{
                width: "280px",
                height: "22px",
                position: "absolute",
                left: "806px",
                top: "383px",
              }}
            >
              <text
                fill="#5E5E5E"
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
                fontFamily="PingFang SC"
                fontSize="16"
                letterSpacing="0em"
              >
                <tspan x="132.391" y="16.76">
                  or
                </tspan>
              </text>
              <path d="M0 13H120" stroke="white" strokeOpacity="0.1" />
              <path d="M160 13L279.999 12.5062" stroke="white" strokeOpacity="0.1" />
            </svg>
          </div>
          <div className="absolute text-xs text-green-500 h-[17px] left-[806px] top-[421px] w-[196px] max-md:left-2/4 max-md:text-center max-md:-translate-x-2/4 max-md:top-[736px] max-md:w-[280px] max-sm:text-xs max-sm:top-[618px] max-sm:w-[250px]">
            You can get a random color NFT！
          </div>
          <div className="absolute h-10 left-[806px] top-[450px] w-[280px] max-md:left-2/4 max-md:-translate-x-2/4 max-md:top-[765px] max-sm:h-9 max-sm:top-[647px] max-sm:w-[250px]">
            <div className="absolute top-0 left-0 h-10 rounded-xl border border-solid border-white border-opacity-30 w-[280px] max-sm:h-9 max-sm:w-[250px]">
              <input
                type="text"
                placeholder="Enter Invitation Code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                className="absolute top-3 left-4 text-xs h-[17px] text-neutral-400 w-[118px] max-sm:top-2.5 max-sm:text-xs bg-transparent border-none outline-none placeholder-neutral-400"
              />
            </div>
            <button
              onClick={handleFreeReceive}
              className="absolute top-0 right-0 h-10 bg-green-500 rounded-xl cursor-pointer w-[100px] max-sm:h-9 max-sm:w-[90px] hover:bg-green-600 transition-colors"
            >
              <div className="absolute left-1 text-xs font-semibold text-center h-[15px] text-neutral-900 top-[13px] w-[92px] max-sm:text-xs max-sm:top-[11px] max-sm:w-[82px]">
                Free to receive
              </div>
            </button>
          </div>
          <div className="absolute rounded-xl border border-solid bg-zinc-800 border-white border-opacity-10 h-[140px] left-[354px] top-[536px] w-[732px] max-md:left-2/4 max-md:-translate-x-2/4 max-md:max-w-[600px] max-md:top-[825px] max-md:w-[90%] max-sm:h-[120px] max-sm:top-[703px] max-sm:w-[95%]">
            <div className="absolute top-4 left-4 text-2xl font-medium text-white h-[29px] w-[126px] max-sm:top-3 max-sm:left-3 max-sm:text-xl">
              Your Color
            </div>
            {userColors.map((color, index) => (
              <div
                key={color.id}
                className="absolute h-[63px] top-[61px] w-[51px] max-sm:h-[55px] max-sm:top-[53px] max-sm:w-[45px]"
                style={{ left: `${16 + index * 75}px` }}
              >
                <div>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="color-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      position: "absolute",
                      left: "5px",
                      top: "0",
                    }}
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="19.5"
                      fill={color.hex}
                      stroke="white"
                    />
                  </svg>
                </div>
                <div className="absolute left-0 top-12 text-xs text-center h-[15px] text-white text-opacity-50 w-[51px] max-sm:text-xs max-sm:top-[42px] max-sm:w-[45px]">
                  {color.hex}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WalletModal isOpen={modalState.isOpen} onClose={closeWalletModal} />
    </>
  );
}

export default MintColorPage;
