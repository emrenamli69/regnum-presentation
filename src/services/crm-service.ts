import { AgentConfig } from '@/config/agents';
import { CRMResponse } from '@/types/crm';

export interface CRMMessageResponse {
  answer: string;
  dataIncluded: boolean;
}

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
    onComplete?: (response: CRMMessageResponse) => void,
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
      
      // Handle array response format
      let parsedResponse: CRMMessageResponse;
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        const output = data[0].output;
        parsedResponse = {
          answer: output.answer || '',
          dataIncluded: output.data_included || false
        };
      } else if (data.output) {
        parsedResponse = {
          answer: data.output.answer || '',
          dataIncluded: data.output.data_included || false
        };
      } else {
        // Fallback for unexpected formats
        parsedResponse = {
          answer: JSON.stringify(data),
          dataIncluded: false
        };
      }
      
      if (onComplete) {
        onComplete(parsedResponse);
      }
    } catch (error) {
      console.error('Failed to send message to CRM:', error);
      onError?.(error as Error);
      throw error;
    }
  }
}