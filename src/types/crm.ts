// CRM Response Types
export interface CRMResponse {
  output: {
    answer: string;
    data_included: boolean;
  };
}

// Chart Generation Types
export interface ChartGenerationRequest {
  query: {
    analysis: string;
  };
  body: Record<string, any>;
}

export interface ChartDataset {
  label: string;
  data: number[];
  type: 'bar' | 'line' | 'area' | 'scatter';
  color: string;
  unit: string;
}

export interface ChartAxes {
  x: {
    label: string;
    type: 'category' | 'numeric' | 'time';
  };
  y: {
    label: string;
    type: 'category' | 'numeric';
  };
}

export interface ChartStatistic {
  metric: string;
  value: number;
  unit: string;
  change?: {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'stable';
  };
}

export interface ChartMetadata {
  analysisId?: string;
  timestamp?: string;
  title: string;
  description: string;
  queryInfo?: {
    database?: string;
    table?: string;
    rowCount?: number;
    timeRange?: {
      start: string;
      end: string;
    };
  };
}

export interface ChartRecommendation {
  primary: 'bar' | 'line' | 'combo' | 'pie' | 'area' | 'scatter';
  alternatives: string[];
  reasoning: string;
}

export interface ChartData {
  metadata: ChartMetadata;
  data: {
    datasets: ChartDataset[];
    labels: string[];
    axes: ChartAxes;
  };
  statistics?: {
    summary: ChartStatistic[];
  };
  chartRecommendation?: ChartRecommendation;
  insights?: Array<{
    type: string;
    severity: string;
    title: string;
    description: string;
    dataPoints?: number[];
    confidence?: number;
  }>;
}

export interface ChartGenerationResponse {
  output: ChartData;
}