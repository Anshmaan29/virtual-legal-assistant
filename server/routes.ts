import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get recent chat messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getRecentMessages(10);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent messages" });
    }
  });

  // Send a question to the AI and get a response
  app.post("/api/chat", async (req, res) => {
    const schema = z.object({
      question: z.string().min(1, "Question is required"),
    });

    try {
      const { question } = schema.parse(req.body);
      
      // Generate AI response
      const aiResponse = await generateChatResponse(question);
      
      // Store the message and response
      const storedMessage = await storage.createChatMessage({
        question,
        answer: aiResponse.answer,
        citation: aiResponse.citation,
        tags: aiResponse.tags,
      });
      
      res.json(storedMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        console.error("Error in chat endpoint:", error);
        res.status(500).json({ message: "Failed to generate response" });
      }
    }
  });

  // Get suggested questions
  app.get("/api/suggested-questions", async (req, res) => {
    try {
      // In a real app, these could be dynamically generated or stored in the database
      const suggestedQuestions = [
        "What are the rules for passing a school bus?",
        "When must I yield to pedestrians?",
        "What are the rules for using a roundabout?",
        "When can I use the HOV lane?",
        "What are the blood alcohol limits for drivers?"
      ];
      
      res.json(suggestedQuestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggested questions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
