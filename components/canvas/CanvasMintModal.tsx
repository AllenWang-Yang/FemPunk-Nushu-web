'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useCanvasPurchase } from '../../lib/hooks/useCanvasPurchase';
import type { Canvas } from '../../lib/services/canvasService';

interface CanvasMintModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvas: Canvas;
}

export function CanvasMintModal({ isOpen, onClose, canvas }: CanvasMintModalProps) {
  const { address } = useAccount();
  const [quantity, setQuantity] = useState(1);
  const { isPurchasing, isSuccess, error, purchaseCanvas, reset } = useCanvasPurchase();

  // Mock price - should be fetched from contract
  const canvasPrice = '0.001'; // ETH
  const totalPrice = (parseFloat(canvasPrice) * quantity).toFixed(4);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
        reset();
      }, 2000);
    }
  }, [isSuccess, onClose, reset]);

  const handlePurchase = async () => {
    if (!address) return;
    
    try {
      // For now, purchase one at a time
      for (let i = 0; i < quantity; i++) {
        await purchaseCanvas(canvas.canvas_id, canvas.metadata_uri);
      }
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#161616] border border-white/20 rounded-xl max-w-sm w-full p-4 relative max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white mb-1">Mint Canvas NFT</h2>
          <p className="text-white/70 text-xs">
            Collect this collaborative artwork
          </p>
        </div>

        {/* Canvas Preview */}
        <div className="mb-4">
          <div className="aspect-square rounded-lg overflow-hidden border border-white/20 mb-2">
            <img
              src={canvas.image_url}
              alt="Canvas preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/homepage/spring.png';
              }}
            />
          </div>
          <div className="text-center">
            <h3 className="text-white font-medium text-sm">Canvas #{canvas.canvas_id}</h3>
            <p className="text-white/60 text-xs">Collaborative Nvshu Art</p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Quantity
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              disabled={isPurchasing}
            >
              −
            </button>
            <span className="text-2xl font-bold text-white w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              disabled={isPurchasing}
            >
              +
            </button>
          </div>
        </div>

        {/* Price Info */}
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70">Price per NFT:</span>
            <span className="text-white font-medium">{canvasPrice} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Total:</span>
            <span className="text-white font-bold text-lg">{totalPrice} ETH</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error.message}</p>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm">
              ✅ Canvas NFT minted successfully!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
            disabled={isPurchasing}
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isPurchasing || !address}
            className="flex-1 px-4 py-3 bg-[#1ee11f] text-black font-semibold rounded-lg hover:bg-[#1bc91c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPurchasing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Minting...
              </div>
            ) : (
              `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`
            )}
          </button>
        </div>

        {/* Wallet Connection Notice */}
        {!address && (
          <p className="text-center text-white/60 text-sm mt-4">
            Please connect your wallet to mint
          </p>
        )}
      </div>
    </div>
  );
}