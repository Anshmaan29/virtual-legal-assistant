import { ChatMessage as ChatMessageType } from "@/types";
import { useState } from "react";
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.type === "bot";
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "The message has been copied to your clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the message to clipboard.",
          variant: "destructive",
        });
      });
  };
  
  const handleFeedback = (isPositive: boolean) => {
    setLiked(isPositive);
    toast({
      title: isPositive ? "Thank you for your feedback!" : "We're sorry about that",
      description: isPositive 
        ? "We're glad this answer was helpful."
        : "We'll use your feedback to improve our responses.",
    });
  };
  
  return (
    <div className={`flex items-start ${isBot ? "" : "justify-end"} group`}>
      {isBot && (
        <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      <div 
        className={`
          ${isBot 
            ? "bg-white border border-gray-200 shadow-sm" 
            : "secondary-gradient text-white shadow-md"
          } rounded-lg p-4 max-w-[85%] relative
        `}
      >
        {/* Time indicator */}
        <div className="text-xs text-gray-400 mb-1">
          {formatDate(new Date(message.timestamp))}
        </div>
        
        {/* Message content */}
        <p className={`${isBot ? "text-gray-800" : "text-white"} whitespace-pre-wrap`}>
          {message.content}
        </p>
        
        {/* Citation */}
        {isBot && message.citation && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs italic text-gray-500">Source: {message.citation}</p>
          </div>
        )}
        
        {/* Tags */}
        {isBot && message.tags && message.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.tags.map((tag, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Action buttons for bot messages */}
        {isBot && (
          <div className="mt-2 pt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <button 
                onClick={() => handleFeedback(true)}
                className={`text-xs px-2 py-1 rounded hover:bg-gray-100 ${liked === true ? 'text-green-600' : 'text-gray-500'}`}
              >
                <ThumbsUp className="h-3.5 w-3.5 inline-block mr-1" />
                Helpful
              </button>
              <button 
                onClick={() => handleFeedback(false)}
                className={`text-xs px-2 py-1 rounded hover:bg-gray-100 ${liked === false ? 'text-red-600' : 'text-gray-500'}`}
              >
                <ThumbsDown className="h-3.5 w-3.5 inline-block mr-1" />
                Not helpful
              </button>
            </div>
            <button 
              onClick={copyToClipboard}
              className="text-gray-500 hover:text-blue-600 p-1 rounded"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2 ml-3 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
