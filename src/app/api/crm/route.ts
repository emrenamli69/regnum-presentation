import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let url: string | undefined;
  
  try {
    const body = await request.json();
    url = body.url;
    const { credentials } = body;
    
    // Log the request details (without credentials)
    console.log('CRM API Request:', {
      timestamp: new Date().toISOString(),
      url: url,
      method: 'GET',
      hasCredentials: !!credentials
    });
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    // Attempt the fetch with retry logic
    let lastError: Error | null = null;
    let attempt = 0;
    const maxAttempts = 3;
    
    while (attempt < maxAttempts) {
      attempt++;
      
      try {
        if (!url) {
          throw new Error('URL is required');
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Accept': 'application/json',
            'User-Agent': 'Regnum-Employee-Assistant/1.0'
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        
        // Log response details
        console.log('CRM API Response:', {
          timestamp: new Date().toISOString(),
          status: response.status,
          statusText: response.statusText,
          attempt: attempt,
          duration: `${Date.now() - startTime}ms`
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'No error text available');
          throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
        
      } catch (fetchError) {
        lastError = fetchError as Error;
        
        // If it's an abort error or we've exhausted attempts, throw immediately
        if (fetchError instanceof Error && 
            (fetchError.name === 'AbortError' || attempt >= maxAttempts)) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
        
        // Log retry attempt
        console.log(`CRM API Retry attempt ${attempt}/${maxAttempts} after error:`, fetchError);
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    // If we get here, all retries failed
    throw lastError || new Error('All retry attempts failed');
    
  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      timestamp: new Date().toISOString(),
      url: url || 'URL not available',
      duration: `${Date.now() - startTime}ms`,
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: (error as Error & { cause?: unknown }).cause
      } : String(error)
    };
    
    console.error('CRM API route error - Full details:', errorDetails);
    
    // Determine if this is a network/timeout error
    const isNetworkError = error instanceof Error && 
      (error.name === 'AbortError' || 
       error.message.includes('fetch failed') ||
       error.message.includes('ECONNREFUSED') ||
       error.message.includes('ETIMEDOUT') ||
       error.message.includes('ENOTFOUND') ||
       error.message.includes('ENETUNREACH'));
    
    // Return more detailed error in development/staging
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    return NextResponse.json(
      { 
        error: 'Failed to process CRM request',
        ...(isDevelopment && {
          details: {
            message: error instanceof Error ? error.message : String(error),
            type: isNetworkError ? 'network_error' : 'request_error',
            url: url?.split('?')[0], // URL without query params
            timestamp: new Date().toISOString()
          }
        })
      },
      { status: isNetworkError ? 503 : 500 }
    );
  }
}