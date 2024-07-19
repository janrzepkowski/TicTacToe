import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function Login({ setIsAuth, setIsLoading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const cookies = new Cookies();

  const login = () => {
    setIsLoading(true);
    Axios.post("https://tictactoe-y8j3.onrender.com/login", {
      username,
      password,
    })
      .then((res) => {
        if (res.data.token) {
          const { token, userID, firstName, lastName, username } = res.data;
          cookies.set("token", token);
          cookies.set("userID", userID);
          cookies.set("firstName", firstName);
          cookies.set("lastName", lastName);
          cookies.set("username", username);
          setIsAuth(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="login">
      <label>Login</label>

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
