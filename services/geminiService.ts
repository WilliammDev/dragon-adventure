
import { GoogleGenAI, Modality } from "@google/genai";

export async function generateSpeech(text: string): Promise<string> {
  // Assume process.env.API_KEY is available
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    // Return a silent audio to prevent errors, or handle appropriately
    return ""; 
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              // 'Kore' has a friendly, youthful quality suitable for the character
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    return "";
  } catch (error) {
    console.error("Error generating speech:", error);
    return "";
  }
}
