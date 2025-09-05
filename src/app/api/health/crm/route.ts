import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    service: 'CRM Health Check',
    checks: {
      api_endpoint: { status: 'unknown', message: '' },
      network: { status: 'unknown', message: '' },
      auth: { status: 'unknown', message: '' }
    }
  };

  try {
    // Get CRM URL from request params or environment
    const url = request.nextUrl.searchParams.get('url');
    const username = request.nextUrl.searchParams.get('username');
    const password = request.nextUrl.searchParams.get('password');
    
    if (!url) {
      return NextResponse.json({
        ...healthCheck,
        status: 'error',
        message: 'URL parameter is required for health check',
        usage: '/api/health/crm?url=YOUR_CRM_URL&username=YOUR_USERNAME&password=YOUR_PASSWORD'
      }, { status: 400 });
    }

    // Test basic connectivity
    console.log(`Health check for CRM endpoint: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for health check
    
    try {
      // First, try without authentication to test basic connectivity
      const connectivityResponse = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      }).catch(async () => {
        // If HEAD fails, try GET
        return fetch(url, {
          method: 'GET',
          signal: controller.signal,
        });
      });
      
      clearTimeout(timeoutId);
      
      healthCheck.checks.network.status = 'ok';
      healthCheck.checks.network.message = `Successfully connected to ${new URL(url).hostname}`;
      
      // Check if authentication is needed
      if (connectivityResponse.status === 401 || connectivityResponse.status === 403) {
        healthCheck.checks.api_endpoint.status = 'info';
        healthCheck.checks.api_endpoint.message = 'Endpoint requires authentication';
        
        // If credentials provided, test with auth
        if (username && password) {
          const credentials = btoa(`${username}:${password}`);
          const authResponse = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${credentials}`,
              'Accept': 'application/json'
            }
          });
          
          if (authResponse.ok) {
            healthCheck.checks.auth.status = 'ok';
            healthCheck.checks.auth.message = 'Authentication successful';
            healthCheck.checks.api_endpoint.status = 'ok';
            healthCheck.checks.api_endpoint.message = `Endpoint responding with status ${authResponse.status}`;
          } else {
            healthCheck.checks.auth.status = 'error';
            healthCheck.checks.auth.message = `Authentication failed with status ${authResponse.status}`;
          }
        } else {
          healthCheck.checks.auth.status = 'warning';
          healthCheck.checks.auth.message = 'No credentials provided for testing';
        }
      } else if (connectivityResponse.ok) {
        healthCheck.checks.api_endpoint.status = 'ok';
        healthCheck.checks.api_endpoint.message = `Endpoint responding with status ${connectivityResponse.status}`;
        healthCheck.checks.auth.status = 'info';
        healthCheck.checks.auth.message = 'No authentication required or already authenticated';
      } else {
        healthCheck.checks.api_endpoint.status = 'error';
        healthCheck.checks.api_endpoint.message = `Endpoint returned status ${connectivityResponse.status}`;
      }
      
    } catch (fetchError) {
      const error = fetchError as Error;
      
      if (error.name === 'AbortError') {
        healthCheck.checks.network.status = 'error';
        healthCheck.checks.network.message = 'Connection timeout (10 seconds)';
      } else if (error.message.includes('ECONNREFUSED')) {
        healthCheck.checks.network.status = 'error';
        healthCheck.checks.network.message = 'Connection refused - endpoint may be down or blocked';
      } else if (error.message.includes('ENOTFOUND')) {
        healthCheck.checks.network.status = 'error';
        healthCheck.checks.network.message = 'DNS resolution failed - hostname not found';
      } else if (error.message.includes('ENETUNREACH')) {
        healthCheck.checks.network.status = 'error';
        healthCheck.checks.network.message = 'Network unreachable - check network connectivity';
      } else if (error.message.includes('self-signed') || error.message.includes('certificate')) {
        healthCheck.checks.network.status = 'warning';
        healthCheck.checks.network.message = 'SSL/TLS certificate issue detected';
      } else {
        healthCheck.checks.network.status = 'error';
        healthCheck.checks.network.message = error.message;
      }
    }
    
    // Determine overall status
    const hasError = Object.values(healthCheck.checks).some(check => check.status === 'error');
    const hasWarning = Object.values(healthCheck.checks).some(check => check.status === 'warning');
    
    return NextResponse.json({
      ...healthCheck,
      status: hasError ? 'error' : hasWarning ? 'warning' : 'ok',
      summary: hasError 
        ? 'Health check failed - see individual checks for details'
        : hasWarning 
        ? 'Health check passed with warnings'
        : 'All health checks passed'
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      ...healthCheck,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, username, password } = body;
    
    // Create URL with parameters
    const healthCheckUrl = new URL('/api/health/crm', request.url);
    if (url) healthCheckUrl.searchParams.set('url', url);
    if (username) healthCheckUrl.searchParams.set('username', username);
    if (password) healthCheckUrl.searchParams.set('password', password);
    
    // Call the GET handler
    const getRequest = new NextRequest(healthCheckUrl.toString());
    return GET(getRequest);
    
  } catch {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid request body'
    }, { status: 400 });
  }
}