
import { GoogleGenAI, Modality } from "@google/genai";

export async function generateSpeech(text: string): Promise<string | null> {
  // Assume process.env.API_KEY is available
  if (!process.env.API_KEY || !text) {
    // Return null if there's no key or no text to generate
    return null;
  }

  // Add a prefix to guide the voice style to a gentle, southern Vietnamese teacher's voice.
  const styledText = `Nói với giọng đọc của một cô giáo miền Nam thật dịu dàng và dễ thương: ${text}`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: styledText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              // The voice style is primarily guided by the prompt text. 'Kore' is used as the base prebuilt voice.
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    return null;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
}
