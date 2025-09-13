import React, { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import { IKImage } from "imagekitio-react";
import Upload from "../upload/Upload";
import { generateContent } from "../../../lib/gemini";
import Markdown from "react-markdown";

const NewPrompt = () => {
  const [messages, setMessages] = useState([]); // State for full chat history

  // Local state to track the upload status and response
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const endRef = useRef(null);

  // Scroll to bottom whenever messages or image change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, img.dbData]);

  // Handler for button click - FIXED VERSION
  const handleGenerate = async (text) => {
    // First, add the user's message to chat
    const userMessage = { role: "user", content: text };

    setMessages((prev) => [...prev, userMessage]);

    // Build the complete message history including the new user message
    const currentMessages = [...messages, userMessage];

    // Build Gemini history array from current messages
    const geminiHistory = currentMessages.map((msg) => {
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
        return {
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        };
      }
    });

    // Now make the API call and add AI response
    try {
      const result = await generateContent(geminiHistory);
      setMessages((prev) => [...prev, { role: "assistant", content: result }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error generating content" },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    handleGenerate(text);
    e.target.reset(); // Clear input after sending
  };

  // Handler to add an image message to chat history
  const handleImageUpload = (res) => {
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
    if (res && res.filePath) {
      setMessages((prev) => [
        ...prev,
        { role: "user", type: "image", filePath: res.filePath },
      ]);
    }
  };

  return (
    <>
      {img.isLoading && <div>Loading...</div>}

      {/* Render full chat history, including image messages */}
      <div className="chat">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.type === "image" && msg.filePath ? (
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                path={msg.filePath}
                width="380"
                transformation={[{ width: 380 }]}
              />
            ) : (
              <Markdown>{msg.content}</Markdown>
            )}
          </div>
        ))}
      </div>

      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit}>
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
        <input type="text" name="text" placeholder="Ask anything" />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
