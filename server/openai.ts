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

// Helper function for fallback responses for common questions
function getFallbackResponse(question: string): ChatResponse | null {
  const lowercaseQuestion = question.toLowerCase();
  
  // Blood alcohol questions
  if (lowercaseQuestion.includes("blood alcohol") || 
      lowercaseQuestion.includes("drinking and driving") ||
      lowercaseQuestion.includes("dui") || 
      lowercaseQuestion.includes("alcohol")) {
    return {
      answer: "In most states in the US, the legal blood alcohol concentration (BAC) limit for drivers is 0.08%. However, this varies by country and there are often stricter limits for commercial drivers (typically 0.04%) and zero tolerance policies for drivers under 21 years old. Always check your local regulations as they may differ.",
      citation: "National Highway Traffic Safety Administration Guidelines",
      tags: ["DUI", "blood alcohol", "driving safety"]
    };
  }
  
  // School bus questions
  if (lowercaseQuestion.includes("school bus")) {
    return {
      answer: "When a school bus stops with its red lights flashing and stop arm extended, vehicles must stop in both directions (except on divided highways with separate roadways). Remain stopped until the bus resumes motion, the bus driver signals it's okay to proceed, or the red lights stop flashing. Failing to stop for a school bus can result in significant penalties including fines, license suspension, and points on your driving record.",
      citation: "Federal Highway Administration Guidelines on School Bus Safety",
      tags: ["school bus", "traffic rules", "safety"]
    };
  }
  
  // Pedestrian questions
  if (lowercaseQuestion.includes("pedestrian") || lowercaseQuestion.includes("yield to pedestrian")) {
    return {
      answer: "Drivers must yield to pedestrians in the following situations: 1) At marked or unmarked crosswalks, 2) When pedestrians are already in any portion of the roadway, 3) When making turns at intersections while pedestrians are crossing with the signal, 4) When entering a road from a driveway, alley, or private road, 5) At all school crossings with children present, 6) When encountering visually impaired pedestrians using a white cane or guide dog. Always reduce speed and be prepared to stop when approaching pedestrians.",
      citation: "Uniform Vehicle Code, Section 11-502",
      tags: ["pedestrians", "right of way", "crosswalks", "traffic safety"]
    };
  }
  
  // Roundabout questions
  if (lowercaseQuestion.includes("roundabout")) {
    return {
      answer: "When using a roundabout: 1) Slow down as you approach. 2) Yield to vehicles already in the roundabout and to pedestrians. 3) Enter when there is a safe gap in traffic. 4) Drive in a counterclockwise direction. 5) Use your right turn signal when preparing to exit. 6) Yield to pedestrians when exiting. If an emergency vehicle approaches, exit the roundabout first and then pull over to let it pass.",
      citation: "Federal Highway Administration, Roundabouts: An Informational Guide",
      tags: ["roundabout", "traffic circle", "right of way", "traffic flow"]
    };
  }
  
  // HOV lane questions
  if (lowercaseQuestion.includes("hov") || lowercaseQuestion.includes("carpool lane") || lowercaseQuestion.includes("diamond lane")) {
    return {
      answer: "HOV (High Occupancy Vehicle) lanes, also known as carpool or diamond lanes, typically require a minimum of 2 or 3 occupants per vehicle, depending on local regulations. Permitted users usually include: carpools, vanpools, buses, motorcycles, and in some areas, clean-air vehicles with special permits. Operating hours vary - some are only during peak commute times while others are 24/7. Crossing solid double lines to enter or exit HOV lanes is generally prohibited. Penalties for improper use can include significant fines that increase with multiple violations.",
      citation: "Federal Highway Administration, HOV Lane Operations Guidelines",
      tags: ["HOV", "carpool", "traffic regulations", "commuting"]
    };
  }
  
  // Return null if no matching question was found
  return null;
}

export async function generateChatResponse(question: string): Promise<ChatResponse> {
  // First check if we have a fallback response for this question
  const fallbackResponse = getFallbackResponse(question);
  
  // If we don't have a fallback ready and the API key is available, try the OpenAI API
  if (!fallbackResponse && process.env.OPENAI_API_KEY) {
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
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      
      // If we have a fallback for this question, use it instead of error messages
      if (fallbackResponse) {
        return fallbackResponse;
      }
      
      // Otherwise, show appropriate error messages based on the error type
      if (error.code === "insufficient_quota") {
        return {
          answer: "I'm experiencing some technical difficulties. The API key has exceeded its quota. Please check your OpenAI account billing details or try again later.",
          citation: "Error: API quota exceeded",
          tags: ["error", "api-quota"]
        };
      } else if (error.status === 429) {
        return {
          answer: "I'm receiving too many requests right now. Please wait a moment and try again later.",
          citation: "Error: Rate limit exceeded",
          tags: ["error", "rate-limit"]
        };
      } else {
        return {
          answer: "I'm sorry, I couldn't process your question at this time. Please try again later.",
          citation: "Error: " + (error.message || "Unknown error"),
          tags: ["error"]
        };
      }
    }
  }
  
  // If we have a fallback response or the API key isn't set, use the fallback
  if (fallbackResponse) {
    return fallbackResponse;
  }
  
  // For questions we don't have fallbacks for
  return {
    answer: "I don't have specific information about that topic yet. Please try asking about school buses, pedestrian right of way, roundabouts, HOV lanes, or blood alcohol limits for drivers.",
    citation: "DriveWise AI Knowledge Base",
    tags: ["information", "driving rules"]
  };
}
