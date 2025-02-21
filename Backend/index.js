import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3001;

const app = express();

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

console.log("imagekit ::: ", imagekit);
// console.log("urlEndpoint", urlEndpoint);
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
