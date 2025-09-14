import React, { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import { IKImage } from "imagekitio-react";
import Upload from "../upload/Upload";
import { generateContentStream } from "../../../lib/gemini";
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

  // Scroll to bottom whenever messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler for button click - STREAMING VERSION
  const handleGenerate = async (text) => {
    // First, add the user's message to chat
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    // Add empty assistant message that will be updated
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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

    try {
      // Use streaming - update the last message with each chunk
      await generateContentStream(geminiHistory, (chunkText) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex]?.role === "assistant") {
            newMessages[lastIndex] = {
              role: "assistant",
              content: chunkText,
            };
          }
          return newMessages;
        });

        // Force scroll after state update
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

          // Also try the endRef approach
          if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        });
      });
    } catch (error) {
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
        <div className="endChat" ref={endRef}></div>{" "}
        {/* Move this INSIDE the chat div */}
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
