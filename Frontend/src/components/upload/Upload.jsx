import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";

// Config values pulled from environment variables
const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

// Function to fetch authentication parameters from the backend
// These are required for secure client-side uploads
const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/upload");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

const Upload = ({ setImg }) => {
  const ikUpleadRef = useRef(null);

  // Handlers for different upload states
  const onError = (err) => {
    console.log("Error: ", err);
  };

  const onSuccess = (res) => {
    console.log("Success: ", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress: ", progress);
  };

  const onUploadStart = (evt) => {
    console.log("Start: ", evt);
    setImg((prev) => ({ ...prev, isLoading: true }));
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      {/* Hidden upload component */}
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUpleadRef}
      />

      {/* Custom label that triggers the hidden upload input */}
      <label onClick={() => ikUpleadRef.current.click()}>
        <img src="/attachment.png" alt="Upload attachment" />
      </label>
    </IKContext>
  );
};

export default Upload;
