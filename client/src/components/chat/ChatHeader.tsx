import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Chat } from "@/types";
import { Menu, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";
import OllamaModelsDropdown from "./OllamaModelsDropdown";

interface ChatHeaderProps {
  currentChat: Chat | undefined;
}

export default function ChatHeader({ currentChat }: ChatHeaderProps) {
  const handleEditChat = () => {
    if (!currentChat) return;
    // TODO: open edit modal or rename input here
    console.log("Edit chat:", currentChat);
  };

  const handleDeleteChat = () => {
    if (!currentChat) return;
    // TODO: confirm deletion and remove chat via hook or API
    console.log("Delete chat:", currentChat);
  };
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
      {/* Left side: Menu + Title */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <div className="flex items-center gap-3">
          <OllamaModelsDropdown />
          {currentChat && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex flex-col leading-tight">
                <h1 className="text-base font-semibold truncate max-w-[200px]">
                  {currentChat.title}
                </h1>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side: Dropdown */}
      <div className="flex items-center gap-2">
        {currentChat && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditChat}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteChat}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
