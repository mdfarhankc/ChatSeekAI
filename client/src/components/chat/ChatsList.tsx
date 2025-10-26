import { SidebarMenu } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import ChatItem from "./ChatItem";
import type { Chat } from "@/types";

interface ChatsListProps {
  chats: Array<Chat>;
  isLoading: boolean;
  currentChatId: string | null;
  onSelectChat: (currentChatId: string) => void;
}

export default function ChatsList({
  chats,
  isLoading,
  currentChatId,
  onSelectChat,
}: ChatsListProps) {
  return (
    <SidebarMenu>
      {isLoading ? (
        // Loader skeletons
        <div className="flex flex-col gap-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      ) : chats.length === 0 ? (
        <div className="px-2 py-8 text-center text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
          No chats yet. Start a new conversation!
        </div>
      ) : (
        chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            currentChatId={currentChatId}
            onSelectChat={() => onSelectChat(chat.id)}
          />
        ))
      )}
    </SidebarMenu>
  );
}
