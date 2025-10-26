import { ChevronUp, LogOut, MessageSquare, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import type { Chat } from "@/types";
import { useLogout, useCurrentUser } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ChatsList from "./ChatsList";

interface AppSidebarProps {
  chats: Array<Chat>;
  isChatsLoading: boolean;
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export default function AppSideBar({
  chats,
  isChatsLoading,
  currentChatId,
  onSelectChat,
  onNewChat,
}: AppSidebarProps) {
  const { data: authUser } = useCurrentUser();
  const { logout } = useLogout();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <MessageSquare className="h-6 w-6" />
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
            ChatSeekAI
          </span>
        </div>
        <Button onClick={onNewChat} className="w-full mt-2" size="sm">
          <Plus className="h-4 w-4 mr-2 group-data-[collapsible=icon]:mr-0" />
          <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <ChatsList
              chats={chats}
              isLoading={isChatsLoading}
              currentChatId={currentChatId}
              onSelectChat={onSelectChat}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex"
                >
                  <Avatar>
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-semibold text-wrap">
                      {authUser?.full_name ?? authUser?.username}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <SidebarMenuButton onClick={logout} tooltip="Logout">
                    <LogOut className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Logout
                    </span>
                  </SidebarMenuButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
