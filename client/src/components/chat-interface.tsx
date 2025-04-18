import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Mic, MicOff, Share, Sparkles, CornerUpRight } from "lucide-react";
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
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          tags: data.tags || [],
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

  const toggleMicrophone = () => {
    if (isRecording) {
      // Stop recording (in real app, you'd have actual recording logic here)
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Voice input has been disabled.",
      });
    } else {
      // Start recording (in real app, you'd have actual recording logic here)
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak clearly to ask your question...",
      });
      
      // Simulate ending the recording after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        toast({
          title: "Voice recording completed",
          description: "Processing your question...",
        });
      }, 3000);
    }
  };

  const handleShare = () => {
    if (messages.length === 0) {
      toast({
        title: "Nothing to share",
        description: "Have a conversation first before sharing.",
      });
      return;
    }
    
    // In a real app, this would generate a shareable link
    toast({
      title: "Conversation shared!",
      description: "A link to this conversation has been copied to your clipboard.",
    });
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "Starting a fresh conversation.",
    });
  };

  return (
    <div className="w-full md:w-2/3 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="p-4 primary-gradient text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="font-semibold">Chat with DriveWise AI</h2>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 rounded-full p-2 h-8 w-8"
            onClick={handleShare}
          >
            <Share className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 rounded-full p-2 h-8 w-8"
            onClick={clearChat}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto h-[500px] flex flex-col space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Sparkles className="h-10 w-10 mb-3 text-blue-500" />
            <h3 className="text-lg font-medium mb-2">Welcome to DriveWise AI</h3>
            <p className="max-w-md text-sm">
              Ask me any questions about traffic rules, regulations, or driving scenarios.
              I'm here to help you understand the rules of the road!
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-neutral-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`mr-2 rounded-full p-2 ${isRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={toggleMicrophone}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Ask about motor vehicle rules and regulations..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <Button 
            type="submit"
            className="ml-3 animated-button bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-medium flex items-center"
            disabled={chatMutation.isPending || !question.trim()}
          >
            {chatMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <span>Send</span>
            )}
            {!chatMutation.isPending && (
              <CornerUpRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
