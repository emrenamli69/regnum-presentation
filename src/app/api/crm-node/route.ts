import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { URL } from 'url';

function httpsGet(url: string, headers: Record<string, string>): Promise<any> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: headers,
      timeout: 30000,
      // Force IPv4
      family: 4
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, credentials } = body;
    
    console.log('Node HTTPS CRM Request to:', url);
    const startTime = Date.now();
    
    const result = await httpsGet(url, {
      'Authorization': `Basic ${credentials}`,
      'Accept': 'application/json',
      'User-Agent': 'Regnum-Employee-Assistant/1.0'
    });
    
    console.log('Node HTTPS CRM Response:', {
      status: result.status,
      duration: `${Date.now() - startTime}ms`
    });
    
    if (result.status !== 200) {
      throw new Error(`HTTP ${result.status}: ${JSON.stringify(result.data)}`);
    }
    
    return NextResponse.json(result.data);
    
  } catch (error) {
    console.error('Node HTTPS CRM Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process CRM request',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}