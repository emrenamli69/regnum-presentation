import { AppSidebar } from "@/components/app-sidebar"
import { Feature291 } from "@/components/chat-interface"
import { ChatProvider } from "@/hooks/useChat"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Home() {
  return (
    <ChatProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex flex-1 flex-col">
            <Feature291 />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ChatProvider>
  )
}