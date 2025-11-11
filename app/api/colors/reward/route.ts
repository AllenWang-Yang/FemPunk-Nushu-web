import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, color_id } = body;
    
    console.log('Frontend API received:', { address, color_id });
    
    if (!address || !color_id) {
      return NextResponse.json(
        { error: 'Wallet address and color code are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/colors/reward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        color_id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      
      // 尝试解析错误信息
      try {
        const errorJson = JSON.parse(errorData);
        return NextResponse.json(
          { error: errorJson.error || 'Failed to mint color' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: 'Failed to mint color' },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error minting color:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}