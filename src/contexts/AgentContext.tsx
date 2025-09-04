"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AgentConfig, agents, defaultAgent, getAgentById } from '@/config/agents';

interface AgentContextType {
  currentAgent: AgentConfig;
  selectAgent: (agentId: string) => void;
  availableAgents: AgentConfig[];
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [currentAgent, setCurrentAgent] = useState<AgentConfig>(defaultAgent);

  // Load selected agent from localStorage on mount
  useEffect(() => {
    const storedAgentId = localStorage.getItem('selected_agent_id');
    if (storedAgentId) {
      const agent = getAgentById(storedAgentId);
      if (agent) {
        setCurrentAgent(agent);
      }
    }
  }, []);

  const selectAgent = useCallback((agentId: string) => {
    const agent = getAgentById(agentId);
    if (agent) {
      setCurrentAgent(agent);
      localStorage.setItem('selected_agent_id', agentId);
      // Dispatch a custom event so other components can react to agent change
      window.dispatchEvent(new CustomEvent('agent-changed', { detail: { agent } }));
    }
  }, []);

  return (
    <AgentContext.Provider
      value={{
        currentAgent,
        selectAgent,
        availableAgents: agents,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}