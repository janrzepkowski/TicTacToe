import React, { useState, useEffect } from "react";
import Board from "./Board";
import Result from "./Result";
import GameState from "./GameState";
import Reset from "./Reset";
import Cookies from "universal-cookie";
import { useChatContext } from "stream-chat-react";

const PLAYER_X = "X";
const PLAYER_O = "O";

const WINNING_COMBINATIONS = [
  { combo: [0, 1, 2], class: "strike-row-1" },
  { combo: [3, 4, 5], class: "strike-row-2" },
  { combo: [6, 7, 8], class: "strike-row-3" },
  { combo: [0, 3, 6], class: "strike-column-1" },
  { combo: [1, 4, 7], class: "strike-column-2" },
  { combo: [2, 5, 8], class: "strike-column-3" },
  { combo: [0, 4, 8], class: "strike-diagonal-1" },
  { combo: [2, 4, 6], class: "strike-diagonal-2" },
];

function checkWinner(tiles, setStrikeClass) {
  for (const { combo, class: strikeClass } of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      setStrikeClass(strikeClass);
      return tiles[a] === PLAYER_X ? GameState.xWin : GameState.oWin;
    }
  }

  if (tiles.every((tile) => tile !== null)) {
    return GameState.draw;
  }

  return GameState.inProgress;
}

function TicTacToe({ channel }) {
  const cookies = new Cookies();
  const [startingPlayer, setStartingPlayer] = useState(PLAYER_X);
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(startingPlayer);
  const [strikeClass, setStrikeClass] = useState("");
  const [gameState, setGameState] = useState(GameState.inProgress);

  const { client } = useChatContext();

  useEffect(() => {
    const result = checkWinner(tiles, setStrikeClass);
    setGameState(result);
  }, [tiles]);

  useEffect(() => {
    const handleEvent = (event) => {
      const { type, data, user } = event;

      if (type === "game-move" && user.id !== client.userID) {
        const { clicked, player } = data;
        const newTiles = [...tiles];
        newTiles[clicked] = player;
        setTiles(newTiles);
        setPlayer(player === PLAYER_X ? PLAYER_O : PLAYER_X);
      }

      if (type === "reset") {
        setTiles(Array(9).fill(null));
        setStrikeClass("");
        setGameState(GameState.inProgress);
        setStartingPlayer(PLAYER_X);
        setPlayer(PLAYER_X);
      }

      if (type === "game-over") {
        setTiles(Array(9).fill(null));
        setStrikeClass("");
        setGameState(GameState.inProgress);
        setStartingPlayer(PLAYER_X);
        setPlayer(PLAYER_X);
      }
    };

    channel.on(handleEvent);

    return () => channel.off(handleEvent);
  }, [channel, client.userID, tiles]);

  const handleTileClick = async (index) => {
    if (
      tiles[index] !== null ||
      gameState !== GameState.inProgress ||
      !isMyTurn()
    ) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = player;
    setTiles(newTiles);

    const nextPlayer = player === PLAYER_X ? PLAYER_O : PLAYER_X;
    setPlayer(nextPlayer);

    const result = checkWinner(newTiles, setStrikeClass);
    setGameState(result);

    await channel.sendEvent({
      type: "game-move",
      data: {
        clicked: index,
        player: player,
      },
    });
  };

  const handleReset = async () => {
    await channel.sendEvent({ type: "reset" });

    setTiles(Array(9).fill(null));
    setStrikeClass("");
    setGameState(GameState.inProgress);
    setStartingPlayer(PLAYER_X);
    setPlayer(PLAYER_X);
  };

  const isMyTurn = () => {
    const userID = cookies.get("userID");
    const members = channel.state.members;
    const memberIDs = Object.keys(members);
    if (memberIDs.length === 2) {
      const myPlayerRole = memberIDs[0] === userID ? PLAYER_X : PLAYER_O;
      return player === myPlayerRole;
    }
    return false;
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <Board
        player={player}
        tiles={tiles}
        onTileClick={handleTileClick}
        strikeClass={strikeClass}
      />
      <Result gameState={gameState} />
      <Reset gameState={gameState} onReset={handleReset} />
    </div>
  );
}

export default TicTacToe;
