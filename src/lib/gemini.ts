import { GoogleGenAI } from "@google/genai";
import { StudySession } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getStudyAdvice(sessions: StudySession[]) {
  const prompt = `Analise minha agenda de estudos e me dê 3 dicas curtas e motivadoras para hoje.
  Agenda: ${sessions.map(s => `${s.title} (${s.subject}) - ${s.duration}min`).join(', ')}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é um mentor de estudos experiente e motivador. Suas respostas devem ser curtas, diretas e em português do Brasil.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao obter conselhos do Gemini:", error);
    return "Mantenha o foco! O segredo do sucesso é a constância.";
  }
}
