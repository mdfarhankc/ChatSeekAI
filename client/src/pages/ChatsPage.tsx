import AppSideBar from "@/components/chat/AppSideBar";
import ChatScreen from "@/components/chat/ChatScreen";
import NoChatScreen from "@/components/chat/NoChatScreen";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useChats } from "@/hooks/useChats";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function ChatsPage() {
  const navigate = useNavigate();
  const { id: chatIdFromUrl } = useParams<{ id: string }>();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const { chats } = useChats();

  useEffect(() => {
    if (chatIdFromUrl) {
      setCurrentChatId(chatIdFromUrl);
    } else {
      setCurrentChatId(null);
    }
  }, [chatIdFromUrl]);

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
    setCurrentChatId(chatId);
  };
  const handleNewChat = () => {
    navigate("/");
    setCurrentChatId(null);
  };

  const currentChat = chats?.items.find((chat) => chat.id === currentChatId);
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSideBar
        chats={chats?.items || []}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={() => {}}
      />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            {currentChat && (
              <>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold">{currentChat.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Model: {currentChat.model}
                  </p>
                </div>
              </>
            )}
          </header>
          {currentChatId && currentChat ? (
            <ChatScreen currentChatId={currentChatId} />
          ) : (
            <NoChatScreen onNewChatCreated={handleSelectChat} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
