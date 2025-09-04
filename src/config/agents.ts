import { Bot, Briefcase } from "lucide-react";

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  apiUrl: string;
  apiKey: string;
  placeholder: string;
  welcomeMessage: string;
}

export const agents: AgentConfig[] = [
  {
    id: "employee-assistant",
    name: "Employee Assistant",
    description: "Your AI-powered workplace companion",
    icon: Bot,
    apiUrl: process.env.NEXT_PUBLIC_EMPLOYEE_ASSISTANT_API_URL || process.env.NEXT_PUBLIC_DIFY_API_URL || "",
    apiKey: process.env.NEXT_PUBLIC_EMPLOYEE_ASSISTANT_API_KEY || process.env.NEXT_PUBLIC_DIFY_API_KEY || "",
    placeholder: "Ask about company policies, HR questions, or workplace assistance...",
    welcomeMessage: "Hello! I'm your Employee Assistant. How can I help you with your workplace needs today?"
  },
  {
    id: "crm-assistant",
    name: "CRM Assistant",
    description: "Customer relationship management helper",
    icon: Briefcase,
    apiUrl: process.env.NEXT_PUBLIC_CRM_ASSISTANT_API_URL || "",
    apiKey: process.env.NEXT_PUBLIC_CRM_ASSISTANT_API_KEY || "",
    placeholder: "Ask about customers, sales, or CRM-related queries...",
    welcomeMessage: "Welcome! I'm your CRM Assistant. How can I help you manage customer relationships today?"
  }
];

export const getAgentById = (id: string): AgentConfig | undefined => {
  return agents.find(agent => agent.id === id);
};

export const defaultAgent = agents[0];