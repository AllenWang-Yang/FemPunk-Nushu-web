/**
 * 画布服务 - 处理画布相关的后端API调用
 */

import { BACKEND_URL, fetchWithTimeout } from '../config/api';

export interface Canvas {
  id?: number;
  canvas_id: string;
  day_timestamp: number;
  metadata_uri: string;
  image_url?: string;
  creator: string;
  total_raised_wei: string;
  finalized: number;
  status?: number;
  tx_hash?: string;
  created_ts?: number;
  updated_ts?: number;
}

export interface RecordCanvasPurchaseParams {
  canvas_id: string;
  buyer_address: string;
  tx_hash: string;
  amount_wei: string;
}

/**
 * 获取所有画布
 */
export async function getAllCanvas(): Promise<Canvas[]> {
  try {
    const response = await fetchWithTimeout(`/api/canvas`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch canvas: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch canvas');
    }
    
    // 确保返回数组格式
    return Array.isArray(data.canvas) ? data.canvas : (data.canvas ? [data.canvas] : []);
  } catch (error) {
    console.error('Error fetching all canvas:', error);
    throw error;
  }
}

/**
 * 根据日期获取画布
 */
export async function getCanvasByDay(dayTimestamp: number): Promise<Canvas> {
  try {
    const response = await fetchWithTimeout(`/api/canvas/${dayTimestamp}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch canvas: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch canvas');
    }
    
    return data.canvas;
  } catch (error) {
    console.error('Error fetching canvas by day:', error);
    throw error;
  }
}

/**
 * 根据ID获取画布
 */
export async function getCanvasById(canvasId: string): Promise<Canvas> {
  try {
    const response = await fetchWithTimeout(`/api/canvas/id/${canvasId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch canvas: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch canvas');
    }
    
    return data.canvas;
  } catch (error) {
    console.error('Error fetching canvas by id:', error);
    throw error;
  }
}

/**
 * 记录画布购买
 */
export async function recordCanvasPurchase(params: RecordCanvasPurchaseParams): Promise<void> {
  try {
    const response = await fetchWithTimeout(`/api/canvas/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to record canvas purchase: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to record canvas purchase');
    }
  } catch (error) {
    console.error('Error recording canvas purchase:', error);
    throw error;
  }
}

/**
 * 获取用户贡献的画布
 */
export async function getUserContributedCanvas(userAddress: string): Promise<Canvas[]> {
  try {
    const response = await fetchWithTimeout(`/api/contributions/contributor/${userAddress}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user canvas: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch user canvas');
    }
    
    return Array.isArray(data.canvases) ? data.canvases : [];
  } catch (error) {
    console.error('Error fetching user canvas:', error);
    throw error;
  }
}

/**
 * 创建画布（管理员）
 */
export async function createCanvas(params: {
  day_timestamp: number;
  metadata_uri: string;
  supply: number;
  creator?: string;
}): Promise<{ canvasId: string }> {
  try {
    const response = await fetchWithTimeout(`/api/canvas/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create canvas: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create canvas');
    }
    
    return { canvasId: data.canvasId };
  } catch (error) {
    console.error('Error creating canvas:', error);
    throw error;
  }
}
