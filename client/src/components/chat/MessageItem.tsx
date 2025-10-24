import React from "react";
import type { Message } from "@/types";
import MessageContent from "./MessageContent";
import { cn } from "@/lib/utils";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat-bubble";

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const variant = message.role === "user" ? "sent" : "received";

  return (
    <ChatBubble
      key={message.id}
      variant={variant}
      className={cn(variant === "sent" ? "ms-auto" : "mr-auto")}
    >
      <ChatBubbleAvatar fallback={variant === "sent" ? "US" : "AI"} />
      <ChatBubbleMessage>
        <MessageContent content={message.content} />
      </ChatBubbleMessage>
    </ChatBubble>
  );
};
