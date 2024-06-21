import GameState from "./GameState";

function Reset({ gameState, onReset }) {
  if (gameState !== GameState.inProgress) {
    return (
      <button onClick={onReset} className="reset-button">
        Play again
      </button>
    );
  }
  return <></>;
}

export default Reset;
