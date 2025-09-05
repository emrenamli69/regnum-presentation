import { AgentConfig } from '@/config/agents';

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
      // Debug: Log the credentials being used (without exposing the actual password)
      console.log('CRM Auth Debug:', {
        usernameLength: this.agentConfig.username?.length || 0,
        passwordLength: this.agentConfig.password?.length || 0,
        passwordFirst3: this.agentConfig.password?.substring(0, 3) || '',
        passwordLast3: this.agentConfig.password?.slice(-3) || '',
        hasBackslash: this.agentConfig.password?.includes('\\') || false,
        hasBacktick: this.agentConfig.password?.includes('`') || false
      });
      
      const credentials = btoa(`${this.agentConfig.username}:${this.agentConfig.password}`);
      
      // Use the node https endpoint which is more reliable
      const response = await fetch('/api/crm-node', {
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
        // Try to get error details from response
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.details?.message || errorData?.error || `HTTP error! status: ${response.status}`;
        
        console.error('CRM request failed:', {
          status: response.status,
          statusText: response.statusText,
          url: url.split('?')[0], // Log URL without query params
          errorDetails: errorData?.details,
          timestamp: new Date().toISOString()
        });
        
        throw new Error(errorMessage);
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