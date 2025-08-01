import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Message } from "@shared/schema";

export function ChatPanel() {
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="font-semibold text-ps-black flex items-center">
          <Bot className="w-5 h-5 text-ps-red mr-2" />
          AI Assistant
        </h3>
        <p className="text-sm text-ps-accent">Slingshot AI is ready to help</p>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <ChatMessages messages={messages} />
        <div className="flex-shrink-0">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
