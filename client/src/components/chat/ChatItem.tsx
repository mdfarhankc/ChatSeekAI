import type { Chat } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface ChatItemProps {
  chat: Chat;
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onEditChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function ChatItem({
  chat,
  currentChatId,
  onSelectChat,
  onEditChat,
  onDeleteChat,
}: ChatItemProps) {
  return (
    <SidebarMenuItem>
      <div className="group relative flex items-center gap-2 w-full">
        <SidebarMenuButton
          onClick={() => onSelectChat(chat.id)}
          isActive={currentChatId === chat.id}
          tooltip={chat.title}
          className="flex-1 p-5 text-left"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
            <div className="font-medium truncate">{chat.title}</div>
          </div>
        </SidebarMenuButton>

        {/* Dropdown appears only on hover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditChat?.(chat.id)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteChat?.(chat.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarMenuItem>
  );
}
