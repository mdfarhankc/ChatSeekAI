import type { Chat } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useDeleteChat } from "@/hooks/useChats";

interface ChatItemProps {
  chat: Chat;
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export default function ChatItem({
  chat,
  currentChatId,
  onSelectChat,
}: ChatItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteChat } = useDeleteChat();

  const handleEditChat = () => {
    console.log("Edit chat:", chat);
  };

  const handleDeleteChat = () => {
    console.log("Delete chat:", chat);
    deleteChat(chat.id);
    setShowDeleteDialog(false);
  };
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

        <>
          {/* Dropdown appears only on hover */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity group-data-[collapsible=icon]:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditChat}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The chat and its messages will
                  be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteChat}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      </div>
    </SidebarMenuItem>
  );
}
