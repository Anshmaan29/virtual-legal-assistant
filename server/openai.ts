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
  
  // Helmet laws in India
  if ((lowercaseQuestion.includes("helmet") || lowercaseQuestion.includes("without helmet")) && 
      lowercaseQuestion.includes("india")) {
    return {
      answer: "In India, riding a two-wheeler without a helmet is an offense under the Motor Vehicles Act. As per the amended Motor Vehicles Act of 2019, the fine for riding without a helmet is Rs. 1,000 (previously Rs. 100) and can also lead to disqualification of license for 3 months. The exact amount may vary slightly from state to state as some states have modified the penalties. All riders, including pillion riders, are required to wear helmets that meet the Bureau of Indian Standards (BIS) certification.",
      citation: "Motor Vehicles (Amendment) Act, 2019, Government of India",
      tags: ["helmet law", "india", "traffic fine", "motorcycle safety"]
    };
  }
  
  // Motorcycle accident
  if (lowercaseQuestion.includes("accident") && 
     (lowercaseQuestion.includes("motorcycle") || lowercaseQuestion.includes("bike"))) {
    return {
      answer: "If you've been in a motorcycle accident: 1) Ensure your safety first by moving to a safe location if possible. 2) Call emergency services (police and ambulance) immediately. 3) Exchange information with all parties involved, including contact details, insurance information, and vehicle details. 4) Document the scene with photos and gather witness information if available. 5) Seek medical attention even if injuries seem minor. 6) Report the accident to your insurance company promptly. 7) Consult with a legal professional if there are disputes about liability or significant injuries. Do not admit fault at the scene, as determining liability requires a full investigation.",
      citation: "National Highway Traffic Safety Administration Motorcycle Safety Guidelines",
      tags: ["motorcycle accident", "emergency procedures", "traffic incident", "insurance claims"]
    };
  }
  
  // Traffic police bribery
  if ((lowercaseQuestion.includes("police") || lowercaseQuestion.includes("officer") || lowercaseQuestion.includes("cop")) && 
      (lowercaseQuestion.includes("bribe") || lowercaseQuestion.includes("bribery") || lowercaseQuestion.includes("corrupt"))) {
    return {
      answer: "If a traffic officer is requesting a bribe: 1) Remain calm and polite. 2) Ask for a proper citation or ticket for any alleged violation. 3) Request to see the officer's identification and make note of their name and badge number. 4) Inform them you wish to handle the matter through official channels. 5) If possible, record the interaction or ensure witnesses are present. 6) Report the incident to the police department's internal affairs division, local anti-corruption bureau, or equivalent oversight agency. Many countries have dedicated hotlines for reporting police corruption. Never offer or pay bribes as this is illegal and perpetuates corruption. Instead, follow legal procedures to contest any citation if you believe it was issued improperly.",
      citation: "Transparency International Anti-Corruption Guidelines",
      tags: ["police corruption", "traffic enforcement", "legal rights", "reporting procedure"]
    };
  }
  
  // Rights when pulled over
  if (lowercaseQuestion.includes("rights") && 
     (lowercaseQuestion.includes("pulled over") || lowercaseQuestion.includes("stopped by police"))) {
    return {
      answer: "When pulled over by police, you generally have these rights: 1) The right to remain silent beyond providing license, registration, and insurance when requested. 2) The right to refuse searches of your vehicle (though police may have other grounds to search). 3) The right to record the interaction (but inform the officer you're recording). 4) The right to ask if you're free to leave. 5) The right to sign a ticket without admitting guilt. You should: remain calm, keep hands visible, follow instructions, and be polite but firm about your rights. Avoid sudden movements, arguing, or fleeing, which can escalate the situation. Remember that rights vary by country and jurisdiction, so familiarize yourself with local laws.",
      citation: "American Civil Liberties Union (ACLU) Know Your Rights Guidelines",
      tags: ["legal rights", "traffic stop", "police interaction", "driver responsibilities"]
    };
  }
  
  // Insurance claims after accident
  if (lowercaseQuestion.includes("insurance") && lowercaseQuestion.includes("accident")) {
    return {
      answer: "After a traffic accident, follow these steps for insurance claims: 1) Report the accident to your insurance company immediately, regardless of fault. 2) Provide all requested documentation, including police reports, photos of damages, medical reports, and repair estimates. 3) Be truthful and consistent in all statements. 4) Keep detailed records of all communication with insurance companies. 5) Understand your policy coverage before accepting settlements. 6) If the other party was at fault, their insurance should cover your damages, but your insurance company can help with this process. 7) Consider consulting an attorney for serious accidents or if the insurance company denies your claim. The claim process typically takes 2-6 weeks for property damage and potentially longer for injury claims.",
      citation: "Insurance Information Institute Guidelines",
      tags: ["insurance claims", "accident procedure", "vehicle damage", "policyholder rights"]
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
    answer: "I don't have specific information about that topic yet. Please try asking about: school buses, pedestrian right of way, roundabouts, HOV lanes, blood alcohol limits, helmet laws in India, motorcycle accidents, traffic police interactions, your rights when pulled over, or insurance claims after an accident.",
    citation: "DriveWise AI Knowledge Base",
    tags: ["information", "driving rules", "traffic regulations"]
  };
}
