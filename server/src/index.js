import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const api_key = process.env.REACT_APP_API_KEY;
const api_secret = process.env.REACT_APP_API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userID = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = serverClient.createToken(userID);
    res.json({ token, userID, firstName, lastName, username, hashedPassword });
  } catch (error) {
    console.error(error);
    res.json({ error: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: username });
    if (users.length === 0) return res.json({ message: "User not found" });

    const token = serverClient.createToken(users[0].id);
    const validPassword = await bcrypt.compare(
      password,
      users[0].hashedPassword
    );

    if (validPassword) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userID: users[0].id,
      });
    }
  } catch (error) {
    res.json({ error: "Something went wrong"});
  }
});

app.listen(5174, () => {
  console.log("Server is running on port 5174");
});
