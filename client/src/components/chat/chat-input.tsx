import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/messages", {
        content,
        role: "user",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "I can help you with that! Let me generate the code for you.",
          "That's a great question. Let me analyze your project and provide a solution.",
          "I'll create a component that meets your requirements. Give me a moment.",
          "Based on your project context, I recommend the following approach...",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        apiRequest("POST", "/api/messages", {
          content: randomResponse,
          role: "assistant",
        }).then(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
        });
      }, 1000);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const quickActions = [
    "Generate Code",
    "Review PR",
    "Create Tests",
    "Debug Issue"
  ];

  return (
    <div className="p-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3 mb-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Slingshot AI anything..."
          className="flex-1"
          disabled={sendMessageMutation.isPending}
        />
        <Button 
          type="submit" 
          size="icon"
          className="bg-ps-red hover:bg-red-700"
          disabled={sendMessageMutation.isPending || !message.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
      
      <div className="flex items-center space-x-2">
        {quickActions.map((action) => (
          <Button
            key={action}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setMessage(action)}
          >
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
}
