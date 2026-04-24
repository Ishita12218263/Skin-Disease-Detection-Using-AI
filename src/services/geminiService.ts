import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  conditionName: string;
  confidenceScore: number;
  description: string;
  commonSymptoms: string[];
  recommendations: string[];
  urgencyLevel: "Low" | "Moderate" | "High";
}

export async function analyzeSkinCondition(imageBase64: string): Promise<AnalysisResult> {
  const prompt = `Analyze this image of a skin condition. 
  Identify the most likely condition, providing a description, common symptoms, confidence score (0-1), recommendations, and urgency.
  IMPORTANT: Always include a strong disclaimer that this is NOT a medical diagnosis and the user must consult a dermatologist.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conditionName: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          description: { type: Type.STRING },
          commonSymptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          urgencyLevel: {
            type: Type.STRING,
            enum: ["Low", "Moderate", "High"],
          },
        },
        required: ["conditionName", "confidenceScore", "description", "commonSymptoms", "recommendations", "urgencyLevel"],
      },
    },
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("No analysis received from AI.");
  }

  return JSON.parse(resultText) as AnalysisResult;
}
