'use client';

import { useEffect, useRef, useState } from 'react';

interface ColorWheelProps {
  size?: number;
  onChange?: (color: string) => void;
  onChangeComplete?: (color: string) => void;
}

export default function ColorWheel({ 
  size = 300, 
  onChange,
  onChangeComplete 
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // 绘制完整的色环
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 90) * Math.PI / 180;
      const endAngle = (angle - 89) * Math.PI / 180;

      // 创建径向渐变
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 添加外边框
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [size]);

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const getColorAtPosition = (x: number, y: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const centerX = size / 2;
    const centerY = size / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = size / 2 - 10;

    // 检查是否在圆形范围内
    if (distance > radius) return null;

    // 直接从 canvas 读取像素颜色
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;

    return rgbToHex(r, g, b);
  };

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = getColorAtPosition(x, y);
    if (color) {
      if (onChange) {
        onChange(color);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleInteraction(e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleInteraction(e);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const color = getColorAtPosition(x, y);
      if (color && onChangeComplete) {
        onChangeComplete(color);
      }
      setIsDragging(false);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="cursor-crosshair rounded-full"
      style={{ touchAction: 'none', display: 'block' }}
    />
  );
}
