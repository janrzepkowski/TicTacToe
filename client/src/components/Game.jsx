import React, { useState, useEffect } from "react";
import TicTacToe from "./TicTacToe";

function Game({ channel, opponentName }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  useEffect(() => {
    const handleUserWatchingStart = (e) => {
      setPlayersJoined(e.watcher_count === 2);
    };

    channel.on("user.watching.start", handleUserWatchingStart);
    
    return () => {
      channel.off("user.watching.start", handleUserWatchingStart);
    };
  }, [channel]);

  if (!playersJoined) {
    return <div>Waiting for {opponentName} to join...</div>;
  }

  return (
    <div>
      <TicTacToe channel={channel} />
    </div>
  );
}

export default Game;
