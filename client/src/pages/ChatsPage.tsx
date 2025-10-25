import AppSideBar from "@/components/chat/AppSideBar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatScreen from "@/components/chat/ChatScreen";
import NoChatScreen from "@/components/chat/NoChatScreen";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useChats } from "@/hooks/useChats";
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
      <SidebarInset className="md:peer-data-[variant=inset]:m-0">
        <div className="flex-1 flex flex-col">
          <ChatHeader currentChat={currentChat} />
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
