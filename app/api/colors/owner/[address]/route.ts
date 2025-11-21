import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS, API_HEADERS, fetchWithTimeout } from '@/lib/config/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const backendUrl = API_ENDPOINTS.colors.owner(address);
    console.log(`[API] Fetching colors for ${address} from ${backendUrl}`);

    const response = await fetchWithTimeout(
      backendUrl,
      {
        method: 'GET',
        headers: API_HEADERS,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[API] Backend error (${response.status}):`, errorData);
      
      try {
        const errorJson = JSON.parse(errorData);
        return NextResponse.json(
          { success: false, error: errorJson.error || 'Failed to fetch colors', colors: [] },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { success: false, error: 'Backend service unavailable', colors: [] },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log(`[API] Successfully fetched colors:`, data);
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] Error fetching colors:', errorMessage);
    
    // Return empty colors array instead of error to allow page to work
    return NextResponse.json(
      { 
        success: false, 
        error: 'Colors service temporarily unavailable', 
        colors: [] 
      },
      { status: 200 } // Return 200 so frontend doesn't break
    );
  }
}
