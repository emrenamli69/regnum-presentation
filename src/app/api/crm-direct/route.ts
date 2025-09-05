import { NextRequest, NextResponse } from 'next/server';

// Direct test without retries or complex logic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, credentials } = body;
    
    console.log('Direct CRM test - starting fetch to:', url);
    
    // Use native fetch with minimal options
    const startTime = Date.now();
    
    // Simple fetch without abort controller
    const fetchPromise = fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      }
    });
    
    // Add a timeout using Promise.race
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Custom timeout after 45 seconds')), 45000);
    });
    
    try {
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      console.log('Direct CRM test - response received:', {
        status: response.status,
        duration: `${Date.now() - startTime}ms`
      });
      
      const data = await response.json();
      return NextResponse.json(data);
      
    } catch (raceError) {
      console.error('Direct CRM test - race error:', raceError);
      throw raceError;
    }
    
  } catch (error) {
    console.error('Direct CRM test - error:', error);
    
    // Check if it's a DNS or network error
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { 
        error: 'Direct fetch failed',
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Test endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'CRM Direct endpoint is ready',
    test_url: '/api/crm-direct',
    method: 'POST',
    body_format: {
      url: 'https://your-crm-url',
      credentials: 'base64-encoded-credentials'
    }
  });
}