import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const HEALTHU_SYSTEM_PROMPT = `You are "Healthu", a highly advanced and compassionate medical AI assistant integrated into the MedVault platform.
Your goal is to help patients understand their health data, provide general medical information, and offer wellness advice.

IMPORTANT GUIDELINES:
1. You MUST NOT provide definitive diagnoses or prescribe medication.
2. ALWAYS include a disclaimer that you are an AI and the user should consult a human doctor for serious medical concerns.
3. Use a tone that is professional, empathetic, and clear.
4. Keep responses concise and formatted using Markdown for readability.
5. If the user asks about MedVault features, explain that it's a secure, decentralized health storage platform.

CONSTRAINTS:
- No medical advice for life-threatening emergencies (Advise calling emergency services immediately).
- No specific medication dosages.
- Focus on preventative health and explaining medical terms.`;

export async function chatWithHealthu(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: HEALTHU_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Healthu Error:", error);
    return "I'm sorry, I'm having trouble connecting to my neural network right now. Please try again in a moment.";
  }
}
