import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/chat-message";
import { ChatMessage as ChatMessageType } from "@/types";

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
}

export default function ChatInterface({ messages, setMessages }: ChatInterfaceProps) {
  const [question, setQuestion] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const chatMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/chat", { question });
      return response.json();
    },
    onSuccess: (data) => {
      // Add bot response to messages
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          content: data.answer,
          citation: data.citation,
          tags: data.tags,
          timestamp: new Date(),
        },
      ]);

      // Invalidate the messages query to refresh recent messages
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "user",
        content: question,
        timestamp: new Date(),
      },
    ]);
    
    // Send to API
    chatMutation.mutate(question);
    
    // Clear input
    setQuestion("");
  };

  return (
    <div className="w-full md:w-2/3 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary-500 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h2 className="font-semibold">Chat with DriveWise AI</h2>
        </div>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto h-[500px] flex flex-col space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      
      <div className="border-t border-neutral-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Ask about motor vehicle rules and regulations..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <Button 
            type="submit"
            className="ml-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-3 font-medium flex items-center transition duration-150"
            disabled={chatMutation.isPending}
          >
            {chatMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <span>Ask</span>
            )}
            {!chatMutation.isPending && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
