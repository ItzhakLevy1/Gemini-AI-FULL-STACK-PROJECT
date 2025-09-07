import React, { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import { IKImage } from "imagekitio-react";
import Upload from "../upload/Upload";
import { generateContent } from "../../../lib/gemini"; // Import function from gemini.js

const NewPropmt = () => {
  const [response, setResponse] = useState(""); // State to hold Gemini's response

  // Local state to track the upload status and response
  const [img, setImg] = useState({
    isLoading: false, // Whether an upload is in progress
    error: "", // Error message if upload fails
    dbData: {}, // Response from ImageKit after successful upload
  });

  const endRef = useRef(null);

  // Automatically scroll chat to the bottom when the component mounts
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handler for button click
  const handleGenerate = async () => {
    const prompt = "Write a story about AI and magic"; // Example prompt
    try {
      const result = await generateContent(prompt); // Call Gemini API
      setResponse(result); // Update state with the response
    } catch (error) {
      setResponse("Error generating content");
    }
  };

  return (
    <>
      {/* Show loading state during file upload */}
      {img.isLoading && <div>Loading...</div>}

      {/* Display uploaded image if available */}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]} // Resize image on-the-fly
        />
      )}

      <button onClick={handleGenerate}>TEST AI</button>
      {/* Chat UI */}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm">
        {/* Upload button is handled by the Upload component */}
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPropmt;
