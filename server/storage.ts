import { users, type User, type InsertUser, type ChatMessage, type InsertChatMessage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

// Interface for chat messages as stored in memory (simplified from schema)
interface StoredChatMessage {
  id: number;
  question: string;
  answer: string;
  timestamp: Date;
  citation?: string | null;
  tags?: string[] | null;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat message methods
  getRecentMessages(limit: number): Promise<StoredChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<StoredChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, StoredChatMessage>;
  private userCurrentId: number;
  private chatMessageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.userCurrentId = 1;
    this.chatMessageCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Chat message methods
  async getRecentMessages(limit: number): Promise<StoredChatMessage[]> {
    // Get all messages, sort by timestamp descending, and limit to the requested number
    return Array.from(this.chatMessages.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<StoredChatMessage> {
    const id = this.chatMessageCurrentId++;
    const timestamp = new Date();
    
    // Create the chat message with the correct types
    const message: StoredChatMessage = {
      id,
      question: insertMessage.question,
      answer: insertMessage.answer,
      timestamp,
      citation: insertMessage.citation || null,
      tags: insertMessage.tags || null
    };
    
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
