import React from "react";
import { useState } from "react";
import { useChatContext } from "stream-chat-react";

function JoinGame() {
  const [oppponent, setOpponent] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: oppponent } });

    if (response.users.length === 0) {
      alert("User not found");
      return;
    }

    const newChannel = client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);

  };

  return (
    <>
      {channel ? (
        <h1>Game Started</h1>
      ) : (
        <div className="joingame">
          <h4>Create Game</h4>
          <input
            type="text"
            placeholder="Username of opponent"
            onChange={(e) => {
              setOpponent(e.target.value);
            }}
          />
          <button onClick={createChannel}> Join Game </button>
        </div>
        )
}
    </>
  );
}

export default JoinGame;
