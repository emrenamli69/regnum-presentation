import * as React from "react"
import { Minus, Plus, MessageSquare } from "lucide-react"
import Image from "next/image"

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

// Chat history sample data
const data = {
  navMain: [
    {
      title: "Today",
      url: "#",
      items: [
        {
          title: "How to implement authentication",
          url: "#",
          isActive: true,
        },
        {
          title: "React best practices discussion",
          url: "#",
        },
        {
          title: "Database optimization tips",
          url: "#",
        },
      ],
    },
    {
      title: "Yesterday",
      url: "#",
      items: [
        {
          title: "TypeScript configuration help",
          url: "#",
        },
        {
          title: "API design patterns",
          url: "#",
        },
        {
          title: "Debugging production issues",
          url: "#",
        },
      ],
    },
    {
      title: "Previous 7 Days",
      url: "#",
      items: [
        {
          title: "Machine learning basics",
          url: "#",
        },
        {
          title: "Docker compose setup",
          url: "#",
        },
        {
          title: "GraphQL vs REST comparison",
          url: "#",
        },
        {
          title: "CSS Grid layout examples",
          url: "#",
        },
      ],
    },
    {
      title: "Previous 30 Days",
      url: "#",
      items: [
        {
          title: "Microservices architecture",
          url: "#",
        },
        {
          title: "WebSocket implementation",
          url: "#",
        },
        {
          title: "Testing strategies",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center py-4">
              <Image
                src="/REGNUM_LOGO_COLOR_R.svg"
                alt="Regnum Logo"
                width={120}
                height={80}
                className="w-auto h-16"
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
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
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                            >
                              <a href={item.url}>
                                <MessageSquare className="size-3 mr-2" />
                                <span className="truncate">{item.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
