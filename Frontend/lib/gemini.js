import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with your API key and safety settings
// The API key is loaded from your environment variables (Vite: import.meta.env)
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_PUBLIC_KEY,
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
  ],
});

// Function to send a text prompt to Gemini and get a response
export const generateContent = async (prompt) => {
  let attempts = 0;
  while (attempts < 3) {
    try {
      // Call Gemini's generateContent API with the given prompt
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Model version to use
        contents: prompt, // User prompt
      });

      console.log("Full response:", response);
      console.log("Gemini says: ", response.text);

      // Return the text so it can be used in other components
      return response.text;
    } catch (error) {
      if (error.status === "UNAVAILABLE") {
        attempts++;
        console.warn(`Model overloaded, retrying... (${attempts})`);
        await new Promise((res) => setTimeout(res, 2000));
      } else {
        throw error;
      }
    }
  }
};