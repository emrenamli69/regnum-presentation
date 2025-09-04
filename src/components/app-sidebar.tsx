"use client";

import * as React from "react"
import { Minus, Plus, MessageSquare, PlusCircle } from "lucide-react"
import Image from "next/image"
import { useChat } from "@/hooks/useChat"
import { useAgent } from "@/contexts/AgentContext"

import { SearchForm } from "@/components/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { conversations, currentConversation, selectConversation, createNewConversation } = useChat();
  const { currentAgent, selectAgent, availableAgents } = useAgent();
  
  // Group conversations by time period
  const groupConversations = () => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    
    const groups = {
      today: [] as typeof conversations,
      yesterday: [] as typeof conversations,
      previousWeek: [] as typeof conversations,
      previousMonth: [] as typeof conversations,
      older: [] as typeof conversations,
    };
    
    conversations.forEach(conv => {
      const timestamp = conv.updated_at || conv.created_at;
      if (timestamp > oneDayAgo) {
        groups.today.push(conv);
      } else if (timestamp > twoDaysAgo) {
        groups.yesterday.push(conv);
      } else if (timestamp > sevenDaysAgo) {
        groups.previousWeek.push(conv);
      } else if (timestamp > thirtyDaysAgo) {
        groups.previousMonth.push(conv);
      } else {
        groups.older.push(conv);
      }
    });
    
    const navMain = [];
    
    if (groups.today.length > 0) {
      navMain.push({
        title: "Today",
        items: groups.today.map(conv => ({
          title: conv.title,
          id: conv.id,
          isActive: currentConversation?.id === conv.id,
        })),
      });
    }
    
    if (groups.yesterday.length > 0) {
      navMain.push({
        title: "Yesterday",
        items: groups.yesterday.map(conv => ({
          title: conv.title,
          id: conv.id,
          isActive: currentConversation?.id === conv.id,
        })),
      });
    }
    
    if (groups.previousWeek.length > 0) {
      navMain.push({
        title: "Previous 7 Days",
        items: groups.previousWeek.map(conv => ({
          title: conv.title,
          id: conv.id,
          isActive: currentConversation?.id === conv.id,
        })),
      });
    }
    
    if (groups.previousMonth.length > 0) {
      navMain.push({
        title: "Previous 30 Days",
        items: groups.previousMonth.map(conv => ({
          title: conv.title,
          id: conv.id,
          isActive: currentConversation?.id === conv.id,
        })),
      });
    }
    
    if (groups.older.length > 0) {
      navMain.push({
        title: "Older",
        items: groups.older.map(conv => ({
          title: conv.title,
          id: conv.id,
          isActive: currentConversation?.id === conv.id,
        })),
      });
    }
    
    return navMain;
  };
  
  const navMain = groupConversations();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center py-2">
              <Image
                src="/REGNUM_LOGO_COLOR_R.svg"
                alt="Regnum Logo"
                width={120}
                height={80}
                className="w-auto h-32"
              />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="px-3 py-2">
              <Select value={currentAgent.id} onValueChange={selectAgent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an agent">
                    <div className="flex items-center gap-2">
                      <currentAgent.icon className="size-4" />
                      <span>{currentAgent.name}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-2">
                        <agent.icon className="size-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-xs text-muted-foreground">{agent.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={createNewConversation}
              className="w-full justify-center"
            >
              <PlusCircle className="size-4 mr-2" />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No conversations yet. Start a new chat!
              </div>
            ) : (
              navMain.map((item, index) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 0}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.title}{" "}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subItem.isActive}
                              >
                                <a 
                                  href="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    selectConversation(subItem.id);
                                  }}
                                >
                                  <MessageSquare className="size-3 mr-2" />
                                  <span className="truncate">{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}