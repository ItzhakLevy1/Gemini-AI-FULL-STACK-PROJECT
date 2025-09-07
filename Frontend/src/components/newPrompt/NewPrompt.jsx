import React, { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import { IKImage } from "imagekitio-react";

import Upload from "../upload/Upload";

const NewPropmt = () => {
  // Local state to track the upload status and response
  const [img, setImg] = useState({
    isLoading: false, // Whether an upload is in progress
    error: "",        // Error message if upload fails
    dbData: {},       // Response from ImageKit after successful upload
  });

  const endRef = useRef(null);

  // Automatically scroll chat to the bottom when the component mounts
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

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
