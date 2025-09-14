import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with your API key and safety settings
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
  const maxRetries = 3;

  while (attempts < maxRetries) {
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
      attempts++;
      console.error(`Attempt ${attempts}/${maxRetries} failed:`, error);

      // Check for various temporary errors
      const isTemporaryError =
        error.status === "UNAVAILABLE" ||
        error.status === "RESOURCE_EXHAUSTED" ||
        error.status === 503 || // HTTP 503 Service Unavailable
        error.message?.includes("503") ||
        error.message?.includes("overloaded") ||
        error.message?.includes("rate limit") ||
        error.message?.includes("Service Unavailable");

      if (isTemporaryError && attempts < maxRetries) {
        const delay = attempts * 3000; // 3s, 6s, 9s
        console.warn(
          `Service temporarily unavailable. Retrying in ${delay}ms... (${attempts}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // If it's not a temporary error or we've exceeded max retries
      console.error("Final error after all retries:", error);
      throw new Error(
        `Gemini API Error: ${
          error.message || "Service temporarily unavailable"
        }`
      );
    }
  }

  throw new Error(
    "Max retries exceeded - Gemini service is temporarily unavailable"
  );
};
