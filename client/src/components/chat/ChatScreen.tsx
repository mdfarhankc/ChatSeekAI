import ChatInput from "@/components/chat/ChatInput";
import { MessageItem } from "@/components/chat/MessageItem";
import StreamingMessage from "@/components/chat/StreamingMessage";
import { useChatMessages, useStreamMessage } from "@/hooks/useMessages";
import { useEffect, useRef } from "react";

interface ChatScreenProps {
  currentChatId: string;
}

export default function ChatScreen({ currentChatId }: ChatScreenProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useChatMessages(currentChatId);
  const { streamMessage, isStreaming, streamingMessage } = useStreamMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.items, streamingMessage]);

  const handleSendMessage = async (message: string) => {
    await streamMessage(currentChatId, message);
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto">
      {/* Messages */}
      <div className="overflow-y-auto px-4 py-2 h-[80vh]">
        {messages?.items.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {isStreaming && <StreamingMessage content={streamingMessage} />}
        <div ref={messagesEndRef} />
      </div>
      {/* Input at bottom */}
      <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
    </div>
  );
}
