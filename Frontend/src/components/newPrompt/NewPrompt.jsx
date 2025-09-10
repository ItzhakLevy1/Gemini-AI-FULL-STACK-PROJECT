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
  });

  const endRef = useRef(null);

  // Scroll to bottom whenever messages or image change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, img.dbData]);

  // Handler for button click
  const handleGenerate = async (text) => {
    // Add the user's message to chat
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const result = await generateContent(text); // Call Gemini API

      // Add Gemini's answer to chat
      setMessages((prev) => [...prev, { role: "assistant", content: result }]);

      console.log("Gemini says: ", result);
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

  return (
    <>
      {img.isLoading && <div>Loading...</div>}

      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}

      {/* Render full chat history */}
      <div className="chat">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <Markdown>{msg.content}</Markdown>
          </div>
        ))}
      </div>

      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
