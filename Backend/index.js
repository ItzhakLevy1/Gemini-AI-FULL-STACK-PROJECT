import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 3001;
const app = express();

// Enable CORS so that the frontend (React client) can call the backend API
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Only allow requests from this client URL
  })
);

// Initialize the ImageKit SDK with credentials from .env
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// API endpoint to return authentication parameters
// These are required for securely uploading files directly from the frontend
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Start the backend server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
