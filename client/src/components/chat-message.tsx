import { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.type === "bot";
  
  return (
    <div className={`flex items-start ${isBot ? "" : "justify-end"}`}>
      {isBot && (
        <div className="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      <div className={`${isBot ? "bg-neutral-100" : "bg-primary-500 text-white"} rounded-lg p-3 max-w-[80%]`}>
        <p className={isBot ? "text-neutral-800" : ""}>{message.content}</p>
        
        {isBot && message.citation && (
          <div className="mt-2 pt-2 border-t border-neutral-200">
            <p className="text-xs font-mono text-neutral-600">Citation: {message.citation}</p>
          </div>
        )}
        
        {isBot && message.tags && message.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.tags.map((tag, index) => (
              <span key={index} className="bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 bg-neutral-200 rounded-full p-2 ml-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
