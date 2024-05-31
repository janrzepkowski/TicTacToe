import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";

const app = express();
const api_key = process.env.REACT_APP_API_KEY;
const api_secret = process.env.REACT_APP_API_SECRET;
const serverClient = new StreamChat.getInstance(api_key, api_secret);

app.use(cors());
app.use(express.json());

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
