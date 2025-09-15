import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with your API key and safety settings
const ai = new GoogleGenAI({
  // Retrieve the API key from environment variables for security
  apiKey: import.meta.env.VITE_GEMINI_PUBLIC_KEY,
  // Set safety settings to block harmful content at a low threshold
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
  ],
});

// Original function for non-streaming content generation with retry logic
export const generateContent = async (prompt) => {
  let attempts = 0;
  const maxRetries = 3;

  // Loop to handle retries for temporary errors
  while (attempts < maxRetries) {
    try {
      // Call Gemini's generateContent API with the specified model and prompt
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Specify the model version
        contents: prompt, // The user's input
      });

      // Log the full response and the extracted text
      console.log("Full response:", response);
      console.log("Gemini says: ", response.text);

      // Return the generated text so it can be used in other components
      return response.text;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts}/${maxRetries} failed:`, error);

      // Check if the error is a temporary, retryable service error
      const isTemporaryError =
        error.status === "UNAVAILABLE" ||
        error.status === "RESOURCE_EXHAUSTED" ||
        error.status === 503 || // HTTP 503 Service Unavailable
        error.message?.includes("503") ||
        error.message?.includes("overloaded") ||
        error.message?.includes("rate limit") ||
        error.message?.includes("Service Unavailable");

      // If it's a temporary error and we haven't exceeded max retries
      if (isTemporaryError && attempts < maxRetries) {
        // Calculate exponential backoff delay (3s, 6s, 9s)
        const delay = attempts * 3000;
        console.warn(
          `Service temporarily unavailable. Retrying in ${delay}ms... (${attempts}/${maxRetries})`
        );
        // Wait for the specified delay before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue; // Continue the while loop for a new attempt
      }

      // If the error is not temporary or max retries are exceeded, throw a final error
      console.error("Final error after all retries:", error);
      throw new Error(
        `Gemini API Error: ${
          error.message || "Service temporarily unavailable"
        }`
      );
    }
  }

  // This line is reached only if the loop finishes without a successful response
  throw new Error(
    "Max retries exceeded - Gemini service is temporarily unavailable"
  );
};

// NEW: Minimal streaming function to handle real-time content updates
export const generateContentStream = async (prompt, onChunk) => {
  try {
    console.log("Starting streaming...", prompt);

    // Call the generateContentStream API for a live, chunked response
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash", // Specify the model version
      contents: prompt, // The user's input
    });

    let fullText = ""; // Variable to accumulate all chunks
    let chunkCount = 0;

    // Loop through each chunk of the streamed response
    for await (const chunk of response) {
      chunkCount++;
      console.log(`Chunk ${chunkCount}:`, chunk.text);

      // If there is text in the chunk and a callback function is provided
      if (chunk.text && onChunk) {
        fullText += chunk.text; // Append the new chunk to the full text
        console.log("Full text so far:", fullText);
        onChunk(fullText); // Call the callback with the full accumulated text
      }
    }

    console.log("Streaming complete. Total chunks:", chunkCount);
  } catch (error) {
    console.error("Streaming error:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/*  
Code Summary - This file provides a robust JavaScript API for interacting with the Google Gemini AI. It includes two key functions:

generateContent : A standard, non-streaming function that sends a prompt and waits for the complete response. 
It's designed with built-in retry logic and an exponential backoff strategy to handle common temporary network or service errors (like 503 errors or rate limits), 
making it highly reliable.

generateContentStream : A more modern, streaming function that returns the AI's response in real-time, chunk by chunk. 
This is ideal for building interactive user interfaces where the text appears as it's being generated, providing a better user experience. 
It uses an `onChunk` callback to deliver the accumulated text with each new piece of data.

Both functions are configured with a specific model (`gemini-2.5-flash`) and safety settings to block harassment and hate speech, ensuring responsible use of the AI. 
*/
