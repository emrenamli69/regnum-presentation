import { ChartData, ChartGenerationRequest } from '@/types/crm';

export class ChartService {
  
  async generateChart(analysis: string): Promise<ChartData | null> {
    try {
      const request: ChartGenerationRequest = {
        query: {
          analysis
        },
        body: {}
      };

      console.log('Sending chart generation request:', JSON.stringify(request, null, 2));

      const response = await fetch('/api/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chart API error:', errorText);
        let errorDetails;
        try {
          errorDetails = JSON.parse(errorText);
        } catch {
          errorDetails = { message: errorText };
        }
        throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorDetails)}`);
      }

      const data = await response.json();
      console.log('Chart API response:', data);
      
      // Handle array response format
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        return data[0].output as ChartData;
      } else if (data.output) {
        return data.output as ChartData;
      }
      
      console.error('Unexpected chart response format:', data);
      return null;
    } catch (error) {
      console.error('Failed to generate chart:', error);
      throw error;
    }
  }
}

export const chartService = new ChartService();