import React, { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import { IKImage } from "imagekitio-react";
import Upload from "../upload/Upload";
import { generateContentStream } from "../../../lib/gemini";
import Markdown from "react-markdown";
import ThreeDot from "react-loading-indicators/ThreeDot";

// Component for the main chat interface
const NewPrompt = () => {
  // State to store the chat history (both user and assistant messages)
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Local state to manage the image upload status
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const LoadingDots = () => (
    <ThreeDot
      /* style={{ fontSize: "8px" }} */
      color="#2179feff"
      size="small"
    />
  );

  // useRef to create a reference to the end of the chat, used for auto-scrolling
  const endRef = useRef(null);

  // useEffect hook to handle auto-scrolling to the bottom of the chat
  useEffect(() => {
    // This effect runs every time the 'messages' state changes
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler for generating content from Gemini in a streaming fashion
  const handleGenerate = async (text) => {
    // Set the loading state to true
    setIsLoading(true);

    // 1. Add the user's message to the chat history
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    // 2. Add an empty assistant message to serve as a placeholder for the streamed response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    // 3. Create a complete message history for the Gemini API call
    const currentMessages = [...messages, userMessage];

    // 4. Map the chat history to the format required by the Gemini API
    const geminiHistory = currentMessages.map((msg) => {
      // Handle image messages
      if (msg.type === "image" && msg.filePath) {
        return {
          role: msg.role === "user" ? "user" : "model",
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: msg.filePath,
              },
            },
          ],
        };
      } else {
        // Handle text messages
        return {
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        };
      }
    });

    try {
      // 5. Call the streaming function and update the state with each incoming chunk
      await generateContentStream(geminiHistory, (chunkText) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          // Ensure we are updating the last message, which should be the empty assistant placeholder
          if (newMessages[lastIndex]?.role === "assistant") {
            newMessages[lastIndex] = {
              role: "assistant",
              content: chunkText,
            };
          }
          setIsLoading(false);
          return newMessages;
        });

        // 6. Request a scroll to the bottom after the state has been updated
        requestAnimationFrame(() => {
          console.log("Trying to scroll...");

          // Get the correct chat container (the messages one, not the widget)
          const chatDiv = document.querySelector(".chat");
          if (chatDiv) {
            console.log("Found chat div:", chatDiv);
            console.log("Current scrollTop:", chatDiv.scrollTop);
            console.log("ScrollHeight:", chatDiv.scrollHeight);
            console.log("ClientHeight:", chatDiv.clientHeight);

            // Scroll to bottom
            chatDiv.scrollTop = chatDiv.scrollHeight;

            console.log("After scroll - scrollTop:", chatDiv.scrollTop);
          }
          // The useEffect hook also handles this, but a direct call can be a good fallback
          if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        });
      });
    } catch (error) {
      // 7. Handle errors by updating the last message with an error message
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex]?.role === "assistant") {
          newMessages[lastIndex] = {
            role: "assistant",
            content: "Error generating content",
          };
        }
        return newMessages;
      });
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return; // Prevent submission if input is empty
    handleGenerate(text); // Trigger the content generation
    e.target.reset(); // Clear the input field
  };

  // Handler for adding an uploaded image to the chat
  const handleImageUpload = (res) => {
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
    if (res && res.filePath) {
      setMessages((prev) => [
        ...prev,
        { role: "user", type: "image", filePath: res.filePath },
      ]);
    }
  };

  // JSX rendering the chat interface
  return (
    <>
      {img.isLoading && <div>Loading...</div>}

      <div className="chat">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {/* Conditional rendering for image or text messages */}
            {msg.type === "image" && msg.filePath ? (
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                path={msg.filePath}
                width="380"
                transformation={[{ width: 380 }]}
              />
            ) : (
              // Use react-markdown to render markdown formatted text
              <Markdown>{msg.content}</Markdown>
            )}
          </div>
        ))}
        {/* Empty div for scrolling to the bottom */}
        <div className="endChat" ref={endRef}></div>
      </div>

      <form className="newForm" onSubmit={handleSubmit}>
        {/* The upload component for handling image uploads */}
        <Upload
          setImg={(updater) =>
            typeof updater === "function"
              ? (prev) => {
                  const next = updater(prev);
                  // Defensive: if dbData.filePath is empty string, reset to {}
                  if (next.dbData && next.dbData.filePath === "") {
                    next.dbData = {};
                  }
                  return next;
                }
              : updater
          }
          onImageUpload={handleImageUpload}
        />
        <input id="file" type="file" multiple={false} hidden />
        {isLoading ? (
          <>
            <LoadingDots /> <input type="text" name="text" />{" "}
          </>
        ) : (
          <input type="text" name="text" placeholder="Ask anything" />
        )}

        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;

/* 
File Summary
This React component, NewPrompt, serves as the main chat interface for an AI application. 
It manages the full conversation history, handling both text and image messages. 
The core logic resides in handleGenerate, which initiates a streaming request to the Gemini API via the generateContentStream function. 
As new chunks of the AI's response arrive, the component's state is updated, causing the UI to re-render the content in real-time. 
It also includes an auto-scrolling feature to ensure the latest messages are always visible and handles image uploads, 
integrating them into the chat history for multimodal conversations.
*/
