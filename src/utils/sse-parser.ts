import { StreamEvent } from '@/types/chat';

export class SSEParser {
  private buffer: string = '';

  /**
   * Parse SSE data and extract events
   */
  parseSSE(chunk: string): StreamEvent[] {
    this.buffer += chunk;
    const events: StreamEvent[] = [];
    
    // Split by double newline to get complete events
    const parts = this.buffer.split('\n\n');
    
    // Keep the last part in buffer if it's incomplete
    this.buffer = parts.pop() || '';
    
    for (const part of parts) {
      if (part.trim() === '') continue;
      
      // Extract data from SSE format
      const lines = part.split('\n');
      let dataLine = '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          dataLine = line.slice(6); // Remove 'data: ' prefix
          break;
        }
      }
      
      if (dataLine) {
        try {
          const event = JSON.parse(dataLine) as StreamEvent;
          events.push(event);
        } catch (error) {
          console.error('Failed to parse SSE event:', error, dataLine);
        }
      }
    }
    
    return events;
  }
  
  /**
   * Reset the buffer
   */
  reset() {
    this.buffer = '';
  }
}

/**
 * Create a streaming response handler
 */
export async function handleStreamResponse(
  response: Response,
  onEvent: (event: StreamEvent) => void,
  onError?: (error: Error) => void
): Promise<void> {
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    onError?.(error);
    throw error;
  }
  
  const reader = response.body?.getReader();
  if (!reader) {
    const error = new Error('Response body is not readable');
    onError?.(error);
    throw error;
  }
  
  const decoder = new TextDecoder();
  const parser = new SSEParser();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const events = parser.parseSSE(chunk);
      
      for (const event of events) {
        // Handle different event types
        if (event.event === 'error') {
          const error = new Error(event.message || 'Stream error');
          onError?.(error);
          throw error;
        }
        
        onEvent(event);
        
        // If we receive message_end, we're done
        if (event.event === 'message_end') {
          return;
        }
      }
    }
  } catch (error) {
    onError?.(error as Error);
    throw error;
  } finally {
    reader.releaseLock();
    parser.reset();
  }
}