import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Test what environment variables are actually being read
  const username = process.env.NEXT_PUBLIC_CRM_ASSISTANT_USERNAME || '';
  const password = process.env.NEXT_PUBLIC_CRM_ASSISTANT_PASSWORD || '';
  
  // Test direct auth with your Postman-working credentials
  const testCredentials = btoa(`${username}:${password}`);
  
  // Compare with what Postman uses
  // In Postman, you're probably using: gustave:v>F\^{E?VT@`\mf5RV!7M(]\B6H
  
  return NextResponse.json({
    debug: {
      username: username,
      passwordLength: password.length,
      passwordFirst5: password.substring(0, 5),
      passwordLast5: password.slice(-5),
      hasBackslash: password.includes('\\'),
      hasBacktick: password.includes('`'),
      encodedCredsLength: testCredentials.length,
      encodedCredsFirst20: testCredentials.substring(0, 20),
      // Try decoding to verify
      decodedCheck: (() => {
        try {
          const decoded = atob(testCredentials);
          return {
            success: true,
            parts: decoded.split(':').length,
            usernameMatch: decoded.split(':')[0] === 'gustave'
          };
        } catch (e) {
          return { success: false, error: (e as Error).message };
        }
      })(),
      // Test making actual request
      testUrl: process.env.NEXT_PUBLIC_CRM_ASSISTANT_API_URL
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Test with hardcoded credentials that work in Postman
    const { testPassword } = await request.json();
    
    const username = 'gustave';
    const password = testPassword || process.env.NEXT_PUBLIC_CRM_ASSISTANT_PASSWORD || '';
    const url = `${process.env.NEXT_PUBLIC_CRM_ASSISTANT_API_URL}?question=test`;
    
    const credentials = btoa(`${username}:${password}`);
    
    console.log('Testing with:', {
      username,
      passwordLength: password.length,
      url: url.split('?')[0]
    });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
      }
    });
    
    const responseText = await response.text();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseLength: responseText.length,
      responsePreview: responseText.substring(0, 200)
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}