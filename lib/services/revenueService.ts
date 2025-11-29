/**
 * 收益服务 - 处理收益相关的后端API调用
 */

import { BACKEND_URL, fetchWithTimeout } from '../config/api';

export interface RevenueShare {
  id: number;
  settlement_id: number;
  contributor: string;
  canvas_id: string;
  contributions: number;
  reward_wei: string;
  claimed: number;
  claimed_tx: string | null;
}

export interface RecordClaimParams {
  contributor: string;
  canvas_id: string;
  tx_hash: string;
}

export interface GetCanvasRevenueParams {
  contributor: string;
  cavans_id: string; // 注意：API文档中是 cavans_id（拼写错误）
}

/**
 * 获取画布收益
 */
export async function getCanvasRevenue(params: GetCanvasRevenueParams): Promise<RevenueShare[]> {
  try {
    const response = await fetchWithTimeout(`/api/revenue/getCanvasRevenue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get canvas revenue: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get canvas revenue');
    }
    
    return data.revenue || [];
  } catch (error) {
    console.error('Error getting canvas revenue:', error);
    throw error;
  }
}

/**
 * 记录收益提取
 */
export async function recordRevenueClaim(params: RecordClaimParams): Promise<{
  canvas_id: string;
  contributor: string;
  reward_wei: string;
  tx_hash: string;
}> {
  try {
    const response = await fetchWithTimeout(`/api/revenue/recordClaim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to record revenue claim: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to record revenue claim');
    }
    
    return {
      canvas_id: data.canvas_id,
      contributor: data.contributor,
      reward_wei: data.reward_wei,
      tx_hash: data.tx_hash,
    };
  } catch (error) {
    console.error('Error recording revenue claim:', error);
    throw error;
  }
}