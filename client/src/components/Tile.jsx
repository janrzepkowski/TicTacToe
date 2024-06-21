function Tile({ className, value, onClick, player }) {
  let hoverClass = null;
  if (value === null && player !== null) {
    hoverClass = `${player.toLowerCase()}-hover`;
  }

  return (
    <div className={`tile ${className} ${hoverClass}`} onClick={onClick}>
      {value}
    </div>
  );
}

export default Tile;
