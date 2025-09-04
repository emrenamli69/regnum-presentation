import { ChartData } from './crm';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  conversation_id?: string;
  metadata?: MessageMetadata;
  isStreaming?: boolean;
  dataIncluded?: boolean;
  chartData?: ChartData;
  chartLoading?: boolean;
}

export interface MessageMetadata {
  usage?: Usage;
  retriever_resources?: RetrieverResource[];
}

export interface Usage {
  prompt_tokens: number;
  prompt_unit_price: string;
  prompt_price_unit: string;
  prompt_price: string;
  completion_tokens: number;
  completion_unit_price: string;
  completion_price_unit: string;
  completion_price: string;
  total_tokens: number;
  total_price: string;
  currency: string;
  latency: number;
}

export interface RetrieverResource {
  position: number;
  dataset_id: string;
  dataset_name: string;
  document_id: string;
  document_name: string;
  segment_id: string;
  score: number;
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: number;
  updated_at: number;
}

export interface ChatRequest {
  query: string;
  inputs?: Record<string, any>;
  response_mode?: 'streaming' | 'blocking';
  user: string;
  conversation_id?: string;
  files?: FileInput[];
  auto_generate_name?: boolean;
}

export interface FileInput {
  type: 'document' | 'image' | 'audio' | 'video' | 'custom';
  transfer_method: 'remote_url' | 'local_file';
  url?: string;
  upload_file_id?: string;
}

export interface StreamEvent {
  event: 'message' | 'message_end' | 'agent_message' | 'agent_thought' | 'message_file' | 'message_replace' | 'error' | 'ping';
  message_id?: string;
  conversation_id?: string;
  answer?: string;
  created_at?: number;
  task_id?: string;
  metadata?: MessageMetadata;
  status?: number;
  code?: string;
  message?: string;
}

export interface ChatCompletionResponse {
  event: string;
  task_id: string;
  id: string;
  message_id: string;
  conversation_id: string;
  mode: string;
  answer: string;
  metadata: MessageMetadata;
  created_at: number;
}