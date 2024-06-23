import React, { useState, useEffect } from "react";
import TicTacToe from "./TicTacToe";
import { Window, MessageList, MessageInput } from "stream-chat-react";

function Game({ channel, opponentName, setChannel }) {
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
      <Window>
        <MessageList
          disableDateSeparator
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={["react"]}
        />
        <MessageInput noFiles />
      </Window>
      <button
        onClick={async () => {
          await channel.stopWatching();
          setChannel(null);
        }}
      >
        Leave Game
      </button>
    </div>
  );
}

export default Game;
