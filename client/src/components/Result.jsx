import GameState from "./GameState";

function Result({ gameState }) {
  switch (gameState) {
    case GameState.inProgress:
      return <></>;
    case GameState.xWin:
      return <div className="result">Player X wins!</div>;
    case GameState.oWin:
      return <div className="result">Player O wins!</div>;
    case GameState.draw:
      return <div className="result">Draw!</div>;
    default:
      return <></>;
  }
}

export default Result;
