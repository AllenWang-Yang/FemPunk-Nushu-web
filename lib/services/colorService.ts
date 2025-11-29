/**
 * 颜色服务 - 处理颜色相关的后端API调用
 */

import { BACKEND_URL, fetchWithTimeout } from '../config/api';

export interface Color {
  id: number;
  color_id: number;
  color_code: string;
  owner_address: string | null;
  metadata_uri: string;
  price_wei: string;
  tx_hash: string | null;
  status: number;
  created_ts: number;
  updated_ts: number;
}

export interface RecordPurchaseParams {
  color_id: number;
  buyer_address: string;
  tx_hash: string;
  price_wei: string;
}

export interface RewardColorParams {
  address: string;
  color_id: number;
}

/**
 * 根据颜色代码查找颜色
 */
export async function getColorByCode(colorCode: string): Promise<Color | null> {
  try {
    const response = await fetchWithTimeout(`/api/colors`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch colors: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch colors');
    }
    
    const colors = data.colors || [];
    return colors.find((color: Color) => color.color_code === colorCode) || null;
  } catch (error) {
    console.error('Error fetching color by code:', error);
    return null;
  }
}

/**
 * 获取所有颜色列表
 */
export async function getAllColors(): Promise<Color[]> {
  try {
    const response = await fetchWithTimeout(`/api/colors`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch colors: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch colors');
    }
    
    return data.colors || [];
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}

/**
 * 记录颜色购买
 */
export async function recordColorPurchase(params: RecordPurchaseParams): Promise<void> {
  try {
    const response = await fetchWithTimeout(`/api/colors/recordPurchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to record purchase: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to record purchase');
    }
  } catch (error) {
    console.error('Error recording color purchase:', error);
    throw error;
  }
}

/**
 * 获取用户拥有的颜色
 */
export async function getUserColors(address: string): Promise<Color[]> {
  try {
    const response = await fetchWithTimeout(`/api/colors/owner/${address}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user colors: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch user colors');
    }
    
    return data.colors || [];
  } catch (error) {
    console.error('Error fetching user colors:', error);
    return [];
  }
}

/**
 * 奖励颜色给用户（通过邀请码）
 */
export async function rewardColor(params: RewardColorParams): Promise<{ txHash: string; color_code: string }> {
  try {
    const response = await fetchWithTimeout(`/api/colors/reward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to reward color: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to reward color');
    }
    
    return {
      txHash: data.txHash,
      color_code: data.color_code,
    };
  } catch (error) {
    console.error('Error rewarding color:', error);
    throw error;
  }
}