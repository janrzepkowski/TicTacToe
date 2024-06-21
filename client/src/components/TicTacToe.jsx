import { useState, useEffect } from "react";
import Board from "./Board";
import Result from "./Result";
import State from "./GameState";
import Reset from "./Reset";

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

function TicTacToe() {
  const [startingPlayer, setStartingPlayer] = useState(PLAYER_X);
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(startingPlayer);
  const [strikeClass, setStrikeClass] = useState("");
  const [gameState, setGameState] = useState(State.inProgress);

  useEffect(() => {
    const result = checkWinner(tiles, setStrikeClass);
    setGameState(result);
  }, [tiles]);

  const handleTileClick = (index) => {
    if (tiles[index] !== null || gameState !== State.inProgress) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = player;
    setTiles(newTiles);
    if (player === PLAYER_X) {
      setPlayer(PLAYER_O);
    } else {
      setPlayer(PLAYER_X);
    }
  };

  const handleReset = () => {
    setTiles(Array(9).fill(null));
    setStrikeClass("");
    setGameState(State.inProgress);
    if (startingPlayer === PLAYER_X) {
      setStartingPlayer(PLAYER_O);
      setPlayer(PLAYER_O);
    } else {
      setStartingPlayer(PLAYER_X);
      setPlayer(PLAYER_X);
    }
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
