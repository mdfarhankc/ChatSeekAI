import ChatInput from "@/components/chat/ChatInput";
import { MessageItem } from "@/components/chat/MessageItem";
import StreamingMessage from "@/components/chat/StreamingMessage";
import { useChatMessages, useStreamMessage } from "@/hooks/useMessages";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface ChatScreenProps {
  currentChatId: string;
}

export default function ChatScreen({ currentChatId }: ChatScreenProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useChatMessages(currentChatId);
  const { streamMessage, isStreaming, streamingMessage } = useStreamMessage();
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Handle scroll behavior
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 80; // px from bottom to still count as "at bottom"
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        threshold;
      setIsAtBottom(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll only if user is near the bottom
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isAtBottom, messages?.items, streamingMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message: string) => {
    await streamMessage(currentChatId, message);
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative">
      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto space-y-3 px-4 py-2 h-[80vh]"
      >
        {messages?.items.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {isStreaming && <StreamingMessage content={streamingMessage} />}
        <div ref={messagesEndRef} />
      </div>
      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <Button
          onClick={scrollToBottom}
          size={"icon"}
          className="absolute bottom-20 right-[50%] z-10 p-2 border rounded-full shadow-lg transition-all bg-gray-900 hover:bg-gray-700 text-white"
          title="Scroll to latest message"
        >
          <ArrowDown className="w-5 h-5" />
        </Button>
      )}
      {/* Input at bottom */}
      <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
    </div>
  );
}
