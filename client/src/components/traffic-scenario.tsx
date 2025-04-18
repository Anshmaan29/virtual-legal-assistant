import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types";

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-secondary-500 text-white">
        <h3 className="font-semibold">Scenario of the Day</h3>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <img 
            src={image}
            alt="Traffic intersection with multiple lanes and traffic lights" 
            className="w-full h-auto rounded-md"
          />
        </div>
        <h4 className="font-medium text-neutral-800">{title}</h4>
        <p className="text-sm text-neutral-600 mt-1">{description}</p>
        <Button
          variant="outline"
          className="mt-3 w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-700 py-2 rounded-md text-sm font-medium transition duration-150"
          onClick={handleScenarioClick}
          disabled={chatMutation.isPending}
        >
          Ask About This Scenario
        </Button>
      </div>
    </div>
  );
}
