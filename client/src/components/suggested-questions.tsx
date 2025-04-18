import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@/types";
import { useState } from "react";
import { Loader2, HelpCircle, Sparkles, ArrowRight } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function SuggestedQuestions({ questions, setMessages }: SuggestedQuestionsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
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

  const handleQuestionClick = (question: string) => {
    chatMutation.mutate(question);
  };
  
  // Generate random colors for question buttons
  const getQuestionColor = (index: number) => {
    const colors = [
      "from-blue-500 to-blue-700",
      "from-indigo-500 to-indigo-700",
      "from-purple-500 to-purple-700",
      "from-blue-600 to-indigo-600",
      "from-blue-500 to-purple-600"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="p-4 secondary-gradient text-white">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-semibold">Suggested Questions</h3>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50">
        <ul className="space-y-3">
          {questions.map((question, index) => (
            <li key={index} className="relative group card-hover">
              <button 
                className={`text-left w-full flex items-start py-3 px-4 rounded-lg border ${
                  chatMutation.isPending && chatMutation.variables === question 
                    ? "bg-indigo-50 border-indigo-200" 
                    : "bg-white border-gray-200 hover:border-indigo-200"
                }`}
                onClick={() => handleQuestionClick(question)}
                disabled={chatMutation.isPending}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`flex-shrink-0 p-1.5 rounded-full mr-3 bg-gradient-to-r ${getQuestionColor(index)}`}>
                  <HelpCircle className="h-4 w-4 text-white" />
                </div>
                
                <div className="flex-grow">
                  <p className="text-gray-800 font-medium">
                    {question}
                  </p>
                  
                  {/* Status indicator when loading */}
                  {chatMutation.isPending && chatMutation.variables === question && (
                    <div className="mt-2 text-xs text-indigo-600 flex items-center">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      <span>Getting answer...</span>
                    </div>
                  )}
                </div>
                
                {/* Arrow that appears on hover */}
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 transform transition-all duration-300 ${
                  hoveredIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}>
                  <ArrowRight className="h-4 w-4 text-indigo-500" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
