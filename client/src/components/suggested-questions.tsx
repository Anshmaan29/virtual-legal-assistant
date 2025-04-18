import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@/types";

interface SuggestedQuestionsProps {
  questions: string[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function SuggestedQuestions({ questions, setMessages }: SuggestedQuestionsProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary-500 text-white">
        <h3 className="font-semibold">Suggested Questions</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {questions.map((question, index) => (
            <li key={index}>
              <button 
                className="text-left w-full text-primary-700 hover:text-primary-900 flex items-center py-2 px-3 rounded-md hover:bg-primary-50"
                onClick={() => handleQuestionClick(question)}
                disabled={chatMutation.isPending}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
