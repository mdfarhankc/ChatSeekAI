import MessageContent from "./MessageContent";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat-bubble";

interface StreamingMessageProps {
  content: string;
}

export default function StreamingMessage({ content }: StreamingMessageProps) {
  return (
    <ChatBubble variant={"received"} className={"mr-auto"}>
      <ChatBubbleAvatar fallback={"AI"} />

      {content ? (
        <ChatBubbleMessage>
          <MessageContent content={content} />
        </ChatBubbleMessage>
      ) : (
        <ChatBubbleMessage isLoading={true}>...</ChatBubbleMessage>
      )}
    </ChatBubble>
  );
}
