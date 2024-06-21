import { useState, useEffect } from "react";
import Board from "./Board";
import Result from "./Result";
import State from "./GameState";
import Reset from "./Reset";
import Cookies from "universal-cookie";

const PLAYER_X = "X";
const PLAYER_O = "O";

const WINNING_COMBINATIONS = [
  // Rows
  { combo: [0, 1, 2], class: "strike-row-1" },
  { combo: [3, 4, 5], class: "strike-row-2" },
  { combo: [6, 7, 8], class: "strike-row-3" },
  // Columns
  { combo: [0, 3, 6], class: "strike-column-1" },
  { combo: [1, 4, 7], class: "strike-column-2" },
  { combo: [2, 5, 8], class: "strike-column-3" },
  // Diagonals
  { combo: [0, 4, 8], class: "strike-diagonal-1" },
  { combo: [2, 4, 6], class: "strike-diagonal-2" },
];

function checkWinner(tiles, setStrikeClass) {
  for (const { combo, class: strikeClass } of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      setStrikeClass(strikeClass);
      return tiles[a] === PLAYER_X ? State.xWin : State.oWin;
    }
  }

  if (tiles.every((tile) => tile !== null)) {
    return State.draw;
  }

  return State.inProgress;
}

function TicTacToe({ channel }) {
  const cookies = new Cookies();
  const [startingPlayer, setStartingPlayer] = useState(PLAYER_X);
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(startingPlayer);
  const [strikeClass, setStrikeClass] = useState("");
  const [gameState, setGameState] = useState(State.inProgress);

  useEffect(() => {
    const result = checkWinner(tiles, setStrikeClass);
    setGameState(result);
  }, [tiles]);

  useEffect(() => {
    const handleMessage = (event) => {
      const { tiles, player, gameState, strikeClass } = event.message.data;
      setTiles(tiles);
      setPlayer(player);
      setGameState(gameState);
      setStrikeClass(strikeClass);
    };

    channel.on("message.new", handleMessage);
    return () => channel.off("message.new", handleMessage);
  }, [channel]);

  const handleTileClick = async (index) => {
    if (tiles[index] !== null || gameState !== State.inProgress || !isMyTurn()) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = player;
    setTiles(newTiles);

    const nextPlayer = player === PLAYER_X ? PLAYER_O : PLAYER_X;
    setPlayer(nextPlayer);

    const result = checkWinner(newTiles, setStrikeClass);
    setGameState(result);

    await channel.sendMessage({
      text: "update",
      data: {
        tiles: newTiles,
        player: nextPlayer,
        gameState: result,
        strikeClass: result !== State.inProgress ? strikeClass : "",
      },
    });
  };

  const handleReset = async () => {
    const newTiles = Array(9).fill(null);
    const newPlayer = startingPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;

    setTiles(newTiles);
    setStrikeClass("");
    setGameState(State.inProgress);
    setStartingPlayer(newPlayer);
    setPlayer(newPlayer);

    await channel.sendMessage({
      text: "reset",
      data: {
        tiles: newTiles,
        player: newPlayer,
        gameState: State.inProgress,
        strikeClass: "",
      },
    });
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
