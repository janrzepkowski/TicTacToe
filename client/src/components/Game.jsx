import React, { useState } from "react";
import TicTacToe from "./TicTacToe";

function Game({ channel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  channel.on("user.watching.start", (e) => {
    setPlayersJoined(e.watcher_count === 2);
  });

  if (!playersJoined) {
    return <div>Waiting for other player to join...</div>;
  }

  return (
    <div>
      <TicTacToe channel={channel} />
    </div>
  );
}

export default Game;
