/**
 * 画布网格组件 - 显示所有画布的网格布局
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { useAllCanvas } from '../../lib/hooks/useAllCanvas';
import type { Canvas } from '../../lib/services/canvasService';

interface CanvasGridProps {
  onCanvasSelect?: (canvas: Canvas) => void;
}

export function CanvasGrid({ onCanvasSelect }: CanvasGridProps) {
  const { canvasList, isLoading, error } = useAllCanvas();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-neutral-800 rounded-lg p-4 animate-pulse">
            <div className="w-full h-48 bg-neutral-700 rounded mb-4"></div>
            <div className="h-4 bg-neutral-700 rounded mb-2"></div>
            <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-2">Failed to load canvases</div>
        <div className="text-gray-400 text-sm">{error.message}</div>
      </div>
    );
  }

  if (canvasList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No canvases available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {canvasList.map((canvas) => (
        <div
          key={canvas.canvas_id}
          className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-neutral-600 transition-colors cursor-pointer"
          onClick={() => onCanvasSelect?.(canvas)}
        >
          {/* 画布预览 */}
          <div className="relative w-full h-48 bg-neutral-700">
            {canvas.image_url || canvas.metadata_uri ? (
              <Image
                src={canvas.image_url || canvas.metadata_uri}
                alt={`Canvas ${canvas.canvas_id}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500">
                Canvas {canvas.canvas_id}
              </div>
            )}
          </div>

          {/* 画布信息 */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-medium">Canvas #{canvas.canvas_id}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                canvas.finalized 
                  ? 'bg-green-600/20 text-green-400' 
                  : 'bg-blue-600/20 text-blue-400'
              }`}>
                {canvas.finalized ? 'Finalized' : 'Active'}
              </span>
            </div>
            
            <div className="text-sm text-gray-400 mb-2">
              {new Date(canvas.day_timestamp * 1000).toLocaleDateString()}
            </div>
            
            <div className="text-sm text-gray-300">
              Raised: {(parseFloat(canvas.total_raised_wei) / 1e18).toFixed(4)} ETH
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CanvasGrid;