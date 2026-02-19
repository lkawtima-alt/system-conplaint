import { GoogleGenAI } from "@google/genai";
import { Complaint } from "../types";

const generateSummary = async (complaint: Complaint): Promise<string> => {
  // FIX: Per coding guidelines, API key must be from process.env.API_KEY.
  // This change also resolves the TypeScript error for 'import.meta.env' not being found.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // FIX: Updated error message to not instruct user, as per guidelines.
    return Promise.resolve("API key is not configured.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      You are a helpful assistant for the Provincial Electricity Authority (PEA) of Thailand.
      Analyze the following customer complaint and provide a concise summary and a recommended course of action for the PEA staff.
      Format the output in Markdown.

      **Complaint Details:**
      - **CA Number:** ${complaint.caNumber}
      - **Category:** ${complaint.category}
      - **Customer Name:** ${complaint.fullName}
      - **Location:** ${complaint.location}
      - **Description:** ${complaint.description}

      **Your Task:**
      1.  **Summary:** Briefly summarize the core issue in one or two sentences.
      2.  **Priority Level:** Assign a priority level (Low, Medium, High, Critical) based on the nature of the complaint.
      3.  **Recommended Actions:** Provide a clear, step-by-step list of actions for the PEA team to resolve this issue.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });

    if (response.text) {
        return response.text;
    } else {
        return "Could not generate a summary. The model returned an empty response.";
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `An error occurred while generating the summary: ${error instanceof Error ? error.message : String(error)}. Make sure your API key is valid and has the Gemini API enabled.`;
  }
};

export const geminiService = {
  generateSummary,
};
