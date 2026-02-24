// app/api/resend/connect/route.ts
// Validate Resend API key and create secure session

import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/store/session-store';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Validate API key by making a test call to Resend
    const resend = new Resend(apiKey);
    
    try {
      // Try to get account information to validate the key
      const response = await fetch('https://api.resend.com/account', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }

      const accountData = await response.json();

      // API key is valid, create secure session
      const sessionId = createSession(apiKey);

      // Return session ID in httpOnly cookie and response
      const responseData = NextResponse.json(
        {
          success: true,
          sessionId,
          account: {
            from_email: accountData.from_email,
            quota: accountData.quota,
          },
        },
        { status: 200 }
      );

      // Set secure httpOnly cookie
      responseData.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
      });

      return responseData;
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to validate API key' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
