export interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  citation?: string;
  tags?: string[];
}

export interface ApiChatMessage {
  id: number;
  question: string;
  answer: string;
  timestamp: string;
  citation?: string;
  tags?: string[];
}
