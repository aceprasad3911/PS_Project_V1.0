import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { useQuery } from "@tanstack/react-query";
import { Message } from "@shared/schema";

export default function Chat() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ps-red"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex bg-ps-gray">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        
        <main className="flex-1 flex flex-col p-6 min-h-0">
          <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h1 className="text-2xl font-bold text-ps-black flex items-center">
                <i className="fas fa-robot text-ps-red mr-3"></i>
                Slingshot AI Assistant
              </h1>
              <p className="text-ps-accent mt-1">
                Your AI-powered development companion
              </p>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
              <ChatMessages messages={messages} />
              <div className="flex-shrink-0">
                <ChatInput />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
