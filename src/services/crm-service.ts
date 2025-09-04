import { AgentConfig } from '@/config/agents';

export class CRMService {
  private agentConfig: AgentConfig;

  constructor(agentConfig: AgentConfig) {
    this.agentConfig = agentConfig;
  }

  /**
   * Send a message to the CRM webhook endpoint
   */
  async sendMessage(
    query: string,
    onComplete?: (response: string) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      // Encode the question as a URL parameter
      const encodedQuestion = encodeURIComponent(query);
      const url = `${this.agentConfig.apiUrl}?question=${encodedQuestion}`;
      
      // Create Basic Auth header
      const credentials = btoa(`${this.agentConfig.username}:${this.agentConfig.password}`);
      
      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          credentials
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (onComplete) {
        onComplete(data.response || data.message || JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to send message to CRM:', error);
      onError?.(error as Error);
      throw error;
    }
  }
}