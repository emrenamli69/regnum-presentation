import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_DIFY_API_URL = process.env.NEXT_PUBLIC_DIFY_API_URL || '';
const DEFAULT_DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get agent config from headers if provided
    const agentConfigHeader = request.headers.get('X-Agent-Config');
    let apiUrl = DEFAULT_DIFY_API_URL;
    let apiKey = DEFAULT_DIFY_API_KEY;
    
    if (agentConfigHeader) {
      try {
        const agentConfig = JSON.parse(agentConfigHeader);
        apiUrl = agentConfig.apiUrl || apiUrl;
        apiKey = agentConfig.apiKey || apiKey;
      } catch (e) {
        console.error('Failed to parse agent config:', e);
      }
    }
    
    const response = await fetch(`${apiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // For streaming responses
    if (body.response_mode === 'streaming') {
      // Create a TransformStream to handle SSE
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      const encoder = new TextEncoder();

      // Start reading the response
      const reader = response.body?.getReader();
      if (reader) {
        (async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              // Forward the chunk to the client
              await writer.write(value);
            }
          } catch (error) {
            console.error('Stream reading error:', error);
          } finally {
            writer.close();
          }
        })();
      }

      return new NextResponse(stream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // For blocking responses
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}