
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askFriend(question: string, options: string[]): Promise<string> {
  const prompt = `
    Kamu adalah seorang ahli agama Islam yang sedang ditelepon dalam kuis "Who Wants to Be a Millionaire".
    Pertanyaannya adalah: "${question}"
    Pilihannya adalah:
    A: ${options[0]}
    B: ${options[1]}
    C: ${options[2]}
    D: ${options[3]}

    Berikan jawaban singkat dan yakin seolah-olah kamu sedang di telepon, dalam bahasa Indonesia. 
    Kamu harus memilih salah satu dari A, B, C, atau D.
    Contoh: "Halo! Saya cukup yakin jawabannya adalah B. Itu adalah peristiwa yang penting dalam sejarah Islam."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Maaf, sepertinya sinyalnya buruk! Saya tidak bisa memberikan jawaban sekarang.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Maaf, sepertinya sinyalnya buruk! Saya tidak bisa memberikan jawaban sekarang.";
  }
}
