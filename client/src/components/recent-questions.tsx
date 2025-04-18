import { formatDistanceToNow } from "date-fns";
import { History, Clock, RotateCcw } from "lucide-react";
import { truncateText } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface RecentQuestion {
  id: number;
  question: string;
  timestamp: string;
}

interface RecentQuestionsProps {
  questions: RecentQuestion[];
  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function RecentQuestions({ questions, setMessages }: RecentQuestionsProps) {
  const { toast } = useToast();
  
  const chatMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/chat", { question });
      return response.json();
    },
    onSuccess: (data, variables) => {
      if (!setMessages) return;
      
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
      
      toast({
        title: "Question asked again",
        description: "We've repeated your previous question.",
      });
    },
  });

  const handleQuestionClick = (question: string) => {
    if (!setMessages) {
      // If no setMessages prop, just show a toast
      toast({
        title: "Question history",
        description: "This feature shows your previous questions. Ask the question again to see the answer.",
      });
      return;
    }
    
    chatMutation.mutate(question);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="p-4 primary-gradient text-white">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <h3 className="font-semibold">Recent Questions</h3>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50">
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No recent questions yet.</p>
            <p className="text-gray-400 text-xs mt-1">
              Your question history will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {questions.map((question) => (
              <li key={question.id} className="card-hover">
                <button 
                  onClick={() => handleQuestionClick(question.question)}
                  disabled={chatMutation.isPending}
                  className="text-left w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">
                      {truncateText(question.question, 60)}
                    </span>
                    <RotateCcw className="h-3.5 w-3.5 text-gray-400 hover:text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Asked {formatDistanceToNow(new Date(question.timestamp))} ago
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
