/**
 * API 配置文件
 * 统一管理后端 URL 和 API 相关配置
 */

// 后端服务 URL - 统一使用代理
export const BACKEND_URL = '';

// API 超时配置（毫秒）
export const API_TIMEOUT = 10000; // 10秒

// API 请求头配置
export const API_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// API 端点配置
export const API_ENDPOINTS = {
  // 颜色相关
  colors: {
    owner: (address: string) => `${BACKEND_URL}/api/colors/owner/${address}`,
    reward: `${BACKEND_URL}/api/colors/reward`,
  },
  // 兑换码相关
  redemption: {
    validate: `${BACKEND_URL}/api/redemption/validate`,
  },
} as const;

/**
 * 创建带超时的 fetch 请求
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort('Request timeout');
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 处理不同类型的错误
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request was aborted: ${error.message || 'timeout'}`);
      }
      throw error;
    }
    
    throw new Error('Unknown error occurred during fetch');
  }
}
