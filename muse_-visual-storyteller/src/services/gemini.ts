import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface StoryResponse {
  openingParagraph: string;
  mood: string;
  sceneDescription: string;
  captions: string[];
  musicRecommendations: string[];
}

export async function analyzeImageAndGenerateStory(base64Image: string, mimeType: string): Promise<StoryResponse> {
  const model = "gemini-3-pro-preview";
  
  const prompt = `Analyze this image and provide:
  1. A mood (1-3 words).
  2. A detailed scene description.
  3. A creative opening paragraph (ghostwritten) for a story set in this world.
  4. 3 social media captions.
  5. 3 music recommendations (genre or specific mood) to enhance social media searches.
  
  Return the response in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          openingParagraph: { type: Type.STRING },
          mood: { type: Type.STRING },
          sceneDescription: { type: Type.STRING },
          captions: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          musicRecommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["openingParagraph", "mood", "sceneDescription", "captions", "musicRecommendations"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateSpeech(text: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this story opening expressively: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Failed to generate audio");
  return base64Audio;
}

export async function chatWithGemini(message: string, context: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: `You are a creative writing assistant. You are helping the user explore the story world generated from their image. 
      Context of the current story: ${context}. 
      Be encouraging, imaginative, and helpful.`,
    },
    history: history
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
