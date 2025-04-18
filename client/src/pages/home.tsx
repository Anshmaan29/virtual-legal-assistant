import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import TabNavigation from "@/components/tab-navigation";
import ChatInterface from "@/components/chat-interface";
import SuggestedQuestions from "@/components/suggested-questions";
import RecentQuestions from "@/components/recent-questions";
import TrafficScenario from "@/components/traffic-scenario";
import Footer from "@/components/footer";
import { ChatMessage } from "@/types";

// Define interfaces for API responses
interface RecentQuestion {
  id: number;
  question: string;
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      type: "bot",
      content: "Welcome to DriveWise AI! I'm here to help you with any questions about motor vehicle rules and regulations. What would you like to know?",
      timestamp: new Date(),
      tags: ["welcome", "introduction"]
    }
  ]);

  // Fetch recent messages
  const { data: recentMessages = [] } = useQuery<RecentQuestion[]>({
    queryKey: ['/api/messages'],
    staleTime: 60000, // 1 minute
  });

  // Fetch suggested questions
  const { data: suggestedQuestions = [] } = useQuery<string[]>({
    queryKey: ['/api/suggested-questions'],
    staleTime: Infinity, // These don't change often
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <TabNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <ChatInterface 
            messages={messages} 
            setMessages={setMessages} 
          />
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <SuggestedQuestions 
            questions={suggestedQuestions} 
            setMessages={setMessages}
          />
          <RecentQuestions 
            questions={recentMessages} 
            setMessages={setMessages}
          />
          <TrafficScenario 
            image="https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            title="Complex Intersection Navigation"
            description="How do you navigate this multi-lane intersection with turn signals? Ask the AI for help with this specific scenario."
            setMessages={setMessages}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
