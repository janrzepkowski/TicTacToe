import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";

function App() {
  const api_key = "process.env.REACT_APP_API_KEY";
  const client = StreamChat.getInstance(api_key);
  const cookies = new Cookies();
  const token = cookies.get("token");

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userID"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        console.log(user);
      });
  }

  return (
    <div className="App">
      <SignUp />
      <Login />
    </div>
  );
}

export default App;
