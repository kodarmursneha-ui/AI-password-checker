import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePasswordStrength = async (password: string): Promise<AnalysisResult> => {
  if (!password) {
    throw new Error("Password cannot be empty");
  }

  // System instruction to act as a security expert
  const systemInstruction = `You are a cybersecurity expert specializing in password entropy and strength analysis. 
  Analyze the provided password for its resistance to brute-force, dictionary, and rainbow table attacks.
  Estimate the entropy in bits based on the character set and length.
  Provide a realistic time-to-crack estimate assuming modern GPU cluster cracking speeds (e.g., 100 billion guesses/second).
  Identify common patterns (dates, keyboard walks, common words).
  Be strict. Common words or short passwords should have low scores.`;

  const prompt = `Analyze this password: "${password}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "A score from 0 to 100 representing overall strength.",
            },
            complexity: {
              type: Type.STRING,
              enum: ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"],
              description: "Categorical complexity rating.",
            },
            crackTime: {
              type: Type.STRING,
              description: "Estimated time to crack (e.g., 'Instant', '2 days', '5 million years').",
            },
            entropyBits: {
              type: Type.INTEGER,
              description: "Estimated entropy in bits.",
            },
            feedback: {
              type: Type.STRING,
              description: "A concise summary of the password's quality.",
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable improvements.",
            },
            patternsFound: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of identified weak patterns (e.g., 'common year', 'keyboard sequence').",
            },
          },
          required: ["score", "complexity", "crackTime", "entropyBits", "feedback", "suggestions", "patternsFound"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback for demo purposes if API fails or quota exceeded
    return {
      score: 0,
      complexity: 'Very Weak',
      crackTime: 'Unknown',
      entropyBits: 0,
      feedback: 'AI Analysis failed. Please try again.',
      suggestions: ['Check your internet connection', 'Try a different password'],
      patternsFound: []
    };
  }
};

export const generateStrongPassword = async (): Promise<string> => {
  // We can use AI to generate a memorable but strong password, 
  // or just use a local random generator. 
  // For "AI" flavor, let's ask Gemini for a "Memorable but high-entropy passphrase".
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a strong, high-entropy random password. It should be 16-20 characters long, include symbols, numbers, and mixed case. Return ONLY the password string, nothing else.",
    });
    return response.text?.trim() || "ErrorGeneratingPassword123!";
  } catch (e) {
     // Fallback to local generation if AI fails
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let result = "";
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
