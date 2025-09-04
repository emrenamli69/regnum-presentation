import { ChatRequest, StreamEvent, ChatCompletionResponse } from '@/types/chat';
import { handleStreamResponse } from '@/utils/sse-parser';

export class DifyService {
  private userId: string;

  constructor() {
    // Generate or retrieve a unique user ID
    this.userId = this.getUserId();
  }

  /**
   * Get or generate a unique user ID
   */
  private getUserId(): string {
    if (typeof window === 'undefined') return 'server-user';
    
    let userId = localStorage.getItem('dify_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('dify_user_id', userId);
    }
    return userId;
  }

  /**
   * Send a chat message with streaming response
   */
  async sendMessage(
    query: string,
    conversationId?: string,
    onEvent?: (event: StreamEvent) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    const request: ChatRequest = {
      query,
      inputs: {},
      response_mode: 'streaming',
      user: this.userId,
      conversation_id: conversationId,
      auto_generate_name: true,
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (onEvent) {
        await handleStreamResponse(response, onEvent, onError);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      onError?.(error as Error);
      throw error;
    }
  }


  /**
   * Stop message generation
   */
  async stopGeneration(taskId: string): Promise<void> {
    try {
      const response = await fetch(`/api/chat/stop/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to stop generation:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const difyService = new DifyService();