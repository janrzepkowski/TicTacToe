import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const app = express();
const api_key = process.env.REACT_APP_API_KEY;
const api_secret = process.env.REACT_APP_API_SECRET;
const serverClient = new StreamChat.getInstance(api_key, api_secret);

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userID = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = serverClient.createToken(userID);
    res.json({ token, firstName, lastName, username, hashedPassword });
  } catch (error) {
    console.error(error);
    res.json({ error: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const token = serverClient.createToken(username);
  res.status(200).json({ token, username });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
