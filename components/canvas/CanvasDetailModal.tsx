/**
 * 画布详情弹窗组件
 * 显示画布信息和购买按钮
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { useCurrentCanvas } from '../../lib/hooks/useCurrentCanvas';
import CanvasPurchaseButton from './CanvasPurchaseButton';

interface CanvasDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CanvasDetailModal({ isOpen, onClose }: CanvasDetailModalProps) {
  const { canvas, isLoading, refetch } = useCurrentCanvas();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className="relative bg-neutral-900 rounded-xl border border-neutral-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="text-white text-lg">Loading canvas...</div>
          </div>
        ) : canvas ? (
          <div className="p-8">
            {/* 标题 */}
            <h2 className="text-3xl font-bold text-white mb-6">
              Today's Canvas
            </h2>

            {/* 画布预览 */}
            <div className="relative w-full aspect-square bg-neutral-800 rounded-lg overflow-hidden mb-6">
              {canvas.metadata_uri && (
                <Image
                  src={canvas.metadata_uri}
                  alt="Canvas preview"
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* 画布信息 */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-neutral-700">
                <span className="text-gray-400">Canvas ID</span>
                <span className="text-white font-mono">{canvas.canvas_id}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-neutral-700">
                <span className="text-gray-400">Date</span>
                <span className="text-white">
                  {new Date(canvas.day_timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-neutral-700">
                <span className="text-gray-400">Total Raised</span>
                <span className="text-white">
                  {(parseFloat(canvas.total_raised_wei) / 1e18).toFixed(4)} ETH
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-neutral-700">
                <span className="text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  canvas.finalized 
                    ? 'bg-green-600/20 text-green-400' 
                    : 'bg-blue-600/20 text-blue-400'
                }`}>
                  {canvas.finalized ? 'Finalized' : 'Active'}
                </span>
              </div>
            </div>

            {/* 购买按钮 */}
            <div className="flex justify-center">
              <CanvasPurchaseButton
                canvasId={BigInt(canvas.canvas_id)}
                onSuccess={() => {
                  refetch();
                  setTimeout(() => onClose(), 2000);
                }}
              />
            </div>

            {/* 说明文字 */}
            <div className="mt-6 p-4 bg-neutral-800 rounded-lg">
              <p className="text-sm text-gray-400 leading-relaxed">
                Purchase this canvas NFT to support the collaborative artwork. 
                Each canvas is limited to 100 editions, and you can only purchase 
                one per wallet. Revenue will be distributed to all contributors 
                based on their participation.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-lg">No canvas available</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CanvasDetailModal;
