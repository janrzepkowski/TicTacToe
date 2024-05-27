import React, { useState } from "react";

function SignUp() {
  const [user, setUser] = useState(null);

  const signUp = () => {};

  return (
    <div className="signUp">
      <label>Sign Up</label>
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}

export default SignUp;
