"use client";

import React from 'react';
import { Message } from '@/types/chat';
import { User, Bot, ExternalLink, BarChart3, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { ChartDisplay } from './ChartDisplay';
import { useChat } from '@/hooks/useChat';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const { generateChart } = useChat();

  return (
    <div className={cn(
      "flex gap-3 py-4 px-4 group",
      isUser ? "bg-background" : "bg-muted/50"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        {isUser ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <span className="whitespace-pre-wrap break-words">{message.content}</span>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.isStreaming && message.content ? (
              <>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Add padding to paragraphs
                    p({children}) {
                      return <p className="my-3">{children}</p>;
                    },
                    // Customize code blocks
                    code({className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match;
                      
                      if (isInline) {
                        return (
                          <code className="px-1 py-0.5 rounded bg-muted text-sm" {...props}>
                            {children}
                          </code>
                        );
                      }
                      
                      return (
                        <div className="relative">
                          <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      );
                    },
                    // Customize links to render as buttons
                    a({href}) {
                      return (
                        <Button
                          variant="outline"
                          size="sm"
                          className="inline-flex items-center gap-1 my-1"
                          onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
                        >
                          Link
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      );
                    },
                    // Customize lists for better spacing
                    ul({children}) {
                      return <ul className="list-disc pl-5 space-y-1">{children}</ul>;
                    },
                    ol({children}) {
                      return <ol className="list-decimal pl-5 space-y-1">{children}</ol>;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse" />
              </>
            ) : message.content ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Add padding to paragraphs
                  p({children}) {
                    return <p className="my-3">{children}</p>;
                  },
                  // Customize code blocks
                  code({className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    
                    if (isInline) {
                      return (
                        <code className="px-1 py-0.5 rounded bg-muted text-sm" {...props}>
                          {children}
                        </code>
                      );
                    }
                    
                    return (
                      <div className="relative">
                        <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  },
                  // Customize links to render as buttons
                  a({href}) {
                    return (
                      <Button
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center gap-1 my-1"
                        onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
                      >
                        Link
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    );
                  },
                  // Customize lists for better spacing
                  ul({children}) {
                    return <ul className="list-disc pl-5 space-y-1">{children}</ul>;
                  },
                  ol({children}) {
                    return <ol className="list-decimal pl-5 space-y-1">{children}</ol>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : null}
          </div>
        )}
        
        {/* Chart button and display for CRM assistant messages */}
        {!isUser && message.dataIncluded && (
          <div className="mt-4 space-y-4">
            {!message.chartData && (
              <Button
                onClick={() => generateChart(message.id)}
                disabled={message.chartLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {message.chartLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating chart...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    Make a chart (Beta!)
                  </>
                )}
              </Button>
            )}
            
            {message.chartData && (
              <ChartDisplay chartData={message.chartData} className="mt-4" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}