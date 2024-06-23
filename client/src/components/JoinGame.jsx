import React from "react";
import { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame() {
  const [opponent, setOpponent] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: opponent } });

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
        <Channel channel={channel} Input={CustomInput}>
          <Game
            channel={channel}
            opponentName={opponent}
            setChannel={setChannel}
          />
        </Channel>
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
      )}
    </>
  );
}

export default JoinGame;
