import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState } from "react";
import JoinGame from "./components/JoinGame";

function App() {
  const api_key = "tsrbrfnejzsf";
  const client = StreamChat.getInstance(api_key);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userID");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("username");
    cookies.remove("hashedPassword");
    client.disconnectUser();
    setIsAuth(false);
    setIsLoading(false);
  };

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
        setIsAuth(true);
      });
  }

  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button onClick={logOut} className="logout-button">
            {" "}
            Log Out{" "}
          </button>
        </Chat>
      ) : isLoading ? (
        <div className="waitroom">
          <div>Waiting for connection with the server...</div>
          <div className="dot-spin"></div>
        </div>
      ) : (
        <div className="auth-container">
          <SignUp setIsAuth={setIsAuth} setIsLoading={setIsLoading} />
          <Login setIsAuth={setIsAuth} setIsLoading={setIsLoading} />
        </div>
      )}
    </div>
  );
}

export default App;
