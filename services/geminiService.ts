
import { GoogleGenAI } from "@google/genai";
import { Document } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getSynthesizedAnswer = async (query: string, documents: Document[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const model = 'gemini-2.5-flash';

  const context = documents
    .map(doc => `Document: ${doc.name}\nContent:\n${doc.content}`)
    .join('\n\n---\n\n');

  const fullPrompt = `Using these documents, answer the user’s question succinctly. Provide a clear, synthesized answer based only on the information in the documents. If the answer cannot be found in the documents, state that clearly.\n\nDocuments:\n${context}\n\nQuestion: ${query}`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt
    });

    if (!response || !response.text) {
        throw new Error("Received an empty response from the API.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a response from the AI model. Please check your API key and network connection.");
  }
};
