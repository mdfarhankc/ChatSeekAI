import { useStreamMessage } from "@/hooks/useMessages";
import ChatInput from "./ChatInput";
import { useCreateChat } from "@/hooks/useChats";
import { useState } from "react";

interface NoChatScreenProps {
  onNewChatCreated: (newChatId: string) => void;
}

export default function NoChatScreen({ onNewChatCreated }: NoChatScreenProps) {
  const { createChat } = useCreateChat();
  const { streamMessage } = useStreamMessage();
  const [sending, setSending] = useState(false);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setSending(true);
    // Use first 10 characters of message as the chat title
    const title = message.length > 30 ? message.slice(0, 10) + "..." : message;
    createChat(
      { title, model: "llama3" },
      {
        onSuccess: async (newChat) => {
          onNewChatCreated(newChat.id);
          await streamMessage(newChat.id, message);
          setSending(false);
        },
        onError: () => setSending(false),
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Centered message */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3">Welcome to ChatSeekAI</h2>
          <p className="text-secondary-foreground mb-4">
            Start a new conversation to begin chatting. Type a message below to
            get started instantly!
          </p>
        </div>
      </div>
      {/* Input at bottom */}
      <div className=" pb-4">
        <ChatInput onSend={handleSendMessage} disabled={sending} />
      </div>
    </div>
  );
}
