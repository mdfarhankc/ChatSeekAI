import ChatInput from "./ChatInput";
import { Skeleton } from "../ui/skeleton";

export default function MessagesLoadingScreen() {
  const handleSendMessage = () => {};
  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative">
      <div className="overflow-y-auto space-y-3 px-4 py-2 h-[80vh]">
        <div className="flex flex-col gap-4">
          {[...Array(7)].map((_, i) => {
            const isUser = i % 2 === 0;
            return (
              <div
                key={i}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar */}
                {!isUser && <Skeleton className="h-8 w-8 rounded-full" />}
                {/* Message bubble */}
                <Skeleton
                  className={`h-20 w-[60%] rounded-xl ${
                    isUser
                      ? "bg-black dark:bg-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                />
                {/* Avatar on right for user */}
                {isUser && <Skeleton className="h-8 w-8 rounded-full" />}
              </div>
            );
          })}
        </div>
      </div>
      {/* Input at bottom */}
      <ChatInput onSend={handleSendMessage} disabled={true} />
    </div>
  );
}
