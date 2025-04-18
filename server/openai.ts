import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Base system prompt that defines the AI assistant's role and knowledge
const baseSystemPrompt = `
You are DriveWise AI, an expert assistant specializing in motor vehicle rules, regulations, and safe driving practices.
Your goal is to provide accurate, clear, and helpful information to users about driving rules, traffic laws, vehicle regulations, and safe driving practices.

Always cite your sources when providing information about specific rules or regulations.
If you don't know the exact answer or if rules vary by location, indicate this clearly.
Focus on being helpful rather than showing off knowledge - translate complex regulations into practical advice.

Format your responses with:
1. A direct, clear answer to the question
2. Additional relevant context or details when helpful
3. Citations to relevant traffic codes or regulations when applicable
4. Tags related to the topic (2-4 relevant tags)

Respond with JSON that follows this structure:
{
  "answer": "The complete answer with all necessary details",
  "citation": "Relevant citation if applicable (e.g., 'National Highway Traffic Safety Code §7.2.3')",
  "tags": ["tag1", "tag2", "tag3"]
}
`;

export type ChatResponse = {
  answer: string;
  citation?: string;
  tags: string[];
};

export async function generateChatResponse(question: string): Promise<ChatResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: baseSystemPrompt
        },
        { 
          role: "user", 
          content: question 
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    const parsedResponse = JSON.parse(content) as ChatResponse;
    
    return {
      answer: parsedResponse.answer || "I couldn't generate a proper response at this time.",
      citation: parsedResponse.citation,
      tags: parsedResponse.tags || []
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback response
    return {
      answer: "I'm sorry, I couldn't process your question at this time. Please try again later.",
      tags: ["error"]
    };
  }
}
