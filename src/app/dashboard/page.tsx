import { AppSidebar } from "@/components/app-sidebar"
import { Feature291 } from "@/components/chat-interface"
import { ChatProvider } from "@/hooks/useChat"
import { AgentProvider } from "@/contexts/AgentContext"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Dashboard() {
  return (
    <AgentProvider>
      <ChatProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] relative">
              <Feature291 />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ChatProvider>
    </AgentProvider>
  )
}