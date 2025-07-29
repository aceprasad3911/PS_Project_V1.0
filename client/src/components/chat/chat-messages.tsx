import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@shared/schema";
import { Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessagesProps {
  // messages prop is now optional, as we fetch from API
  messages?: Message[];
}

export function ChatMessages({ messages: propMessages = [] }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [wsMessages, setWsMessages] = useState<any[]>([]);

  // Fetch messages from API
  const { data: apiMessagesRaw = [], refetch } = useQuery({
    queryKey: ["/api/messages"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/messages");
      // Robustly extract array of messages from API response
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [apiMessagesRaw, wsMessages]);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat_message") {
        setWsMessages((prev) => [...prev, data]);
        // Optionally refetch messages from API for real-time sync
        refetch();
      }
    };

    return () => {
      socket.close();
    };
  }, [refetch]);

  // Combine API messages, prop messages, and websocket messages
  const combinedMessages = [...propMessages, ...apiMessagesRaw, ...wsMessages];
  // Filter out duplicates by content+role (or use id if available)
  const uniqueMessages = Array.from(
    new Map(
      combinedMessages.map((msg) => [msg.content + msg.role, msg])
    ).values()
  );
  const allMessages = uniqueMessages.sort(
    (a, b) =>
      new Date(a.createdAt || a.timestamp).getTime() -
      new Date(b.createdAt || b.timestamp).getTime()
  );

  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          {allMessages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Start a conversation with your AI assistant</p>
            </div>
          ) : (
            allMessages.map((message, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant" ? "bg-ps-red" : "bg-gray-300"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "assistant"
                        ? "bg-gray-100 text-ps-black"
                        : "bg-ps-red text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-ps-accent mt-1">
                    {new Date(message.createdAt || message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
