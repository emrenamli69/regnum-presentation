"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Message, Conversation, StreamEvent } from '@/types/chat';
import { difyService } from '@/services/dify';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  createNewConversation: () => void;
  selectConversation: (conversationId: string) => void;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('chat_conversations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        // Set the most recent conversation as current
        if (parsed.length > 0) {
          const recent = parsed[0];
          setCurrentConversation(recent);
          setMessages(recent.messages);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chat_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chat',
      messages: [],
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    
    setCurrentConversation(newConversation);
    setMessages([]);
    setConversations(prev => [newConversation, ...prev]);
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      setMessages(conversation.messages);
    }
  }, [conversations]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Create or ensure we have a current conversation
    let conversation = currentConversation;
    if (!conversation) {
      conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        messages: [],
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      setCurrentConversation(conversation);
    }

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content,
      timestamp: Date.now(),
      conversation_id: conversation.id,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      conversation_id: conversation.id,
      isStreaming: true,
    };

    setMessages([...updatedMessages, assistantMessage]);

    let accumulatedContent = '';
    let conversationId: string | undefined = undefined;
    let messageId: string | undefined = undefined;
    let isFirstChunk = true;

    try {
      await difyService.sendMessage(
        content,
        conversation.id.startsWith('conv_') ? undefined : conversation.id,
        (event: StreamEvent) => {
          // Handle different event types
          if (event.event === 'message' || event.event === 'agent_message') {
            // For agent_message, multiple events are sent with partial content
            // We need to accumulate all of them
            if (event.event === 'agent_message' && event.answer) {
              // Accumulate the content from multiple agent_message events
              accumulatedContent += event.answer;
              conversationId = event.conversation_id;
              messageId = event.message_id;
              setCurrentTaskId(event.task_id || null);
              
              // Update the assistant message immediately to show streaming
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'assistant') {
                  lastMessage.content = accumulatedContent;
                  lastMessage.id = messageId || lastMessage.id;
                  lastMessage.isStreaming = true; // Keep streaming indicator on
                }
                return newMessages;
              });
            } else if (event.event === 'message' && event.answer) {
              // Regular streaming mode (character by character)
              accumulatedContent += event.answer;
              conversationId = event.conversation_id;
              messageId = event.message_id;
              setCurrentTaskId(event.task_id || null);
              
              // Update the assistant message
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'assistant') {
                  lastMessage.content = accumulatedContent;
                  lastMessage.id = messageId || lastMessage.id;
                }
                return newMessages;
              });
            }
          } else if (event.event === 'message_end') {
            // Streaming completed
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.isStreaming = false;
                lastMessage.metadata = event.metadata;
              }
              return newMessages;
            });
            setCurrentTaskId(null);

            // Update conversation with Dify's conversation ID
            if (conversationId && conversation) {
              const updatedConversation = {
                ...conversation,
                id: conversationId,
                updated_at: Date.now(),
                messages: [...updatedMessages, {
                  ...assistantMessage,
                  id: messageId || assistantMessage.id,
                  content: accumulatedContent,
                  isStreaming: false,
                  metadata: event.metadata,
                }],
              };

              // Update title if it's still "New Chat"
              if (updatedConversation.title === 'New Chat' && content) {
                updatedConversation.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
              }

              setCurrentConversation(updatedConversation);
              
              // Update conversations list
              setConversations(prev => {
                const index = prev.findIndex(c => c.id === conversation.id || c.id === conversationId);
                if (index >= 0) {
                  const newConvs = [...prev];
                  newConvs[index] = updatedConversation;
                  return newConvs;
                } else {
                  return [updatedConversation, ...prev];
                }
              });
            }
          } else if (event.event === 'error') {
            setError(event.message || 'An error occurred');
            setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
          }
        },
        (error: Error) => {
          setError(error.message);
          setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
        }
      );
    } catch (error) {
      setError((error as Error).message);
      setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, messages, isLoading]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        isLoading,
        error,
        sendMessage,
        createNewConversation,
        selectConversation,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}