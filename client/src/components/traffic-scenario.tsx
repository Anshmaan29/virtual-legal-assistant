import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types";
import { Loader2, MapPin, Calendar, Info } from "lucide-react";
import { useState } from "react";

interface TrafficScenarioProps {
  image: string;
  title: string;
  description: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function TrafficScenario({ 
  image, 
  title, 
  description,
  setMessages
}: TrafficScenarioProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const chatMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/chat", { question });
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Add user question to messages
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "user",
          content: variables,
          timestamp: new Date(),
        },
        {
          id: prev.length + 2,
          type: "bot",
          content: data.answer,
          citation: data.citation,
          tags: data.tags,
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleScenarioClick = () => {
    const question = `How do I navigate a complex multi-lane intersection with turn signals like the one shown in the scenario?`;
    chatMutation.mutate(question);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 card-hover">
      <div className="p-4 secondary-gradient text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <h3 className="font-semibold">Scenario of the Day</h3>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Today
          </span>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50">
        <div className="mb-4 relative overflow-hidden rounded-lg" 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src={image}
            alt="Traffic intersection with multiple lanes and traffic lights" 
            className={`w-full h-auto rounded-lg transition-transform duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Info overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-4 text-white">
              <div className="flex items-center text-sm mb-1">
                <Info className="h-3.5 w-3.5 mr-1" />
                <span>Scenario details</span>
              </div>
              <p className="text-xs text-white/80">Complex intersection with multiple turn lanes and traffic signals</p>
            </div>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-800 text-lg gradient-text">{title}</h4>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        
        <Button
          className="mt-4 w-full py-2 animated-button primary-gradient text-white rounded-md text-sm font-medium"
          onClick={handleScenarioClick}
          disabled={chatMutation.isPending}
        >
          {chatMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>Ask About This Scenario</>
          )}
        </Button>
      </div>
    </div>
  );
}
