import { useState, useEffect } from "react";
import Square from "./Square";
import CalculateWinner from "./CalculateWinner";

function TicTacToe({
  id,
  xIsNext,
  setXIsNext,
  disabled,
  handleTableStatus,
  handleToDisabled,
  resetKey,
}) {
  const boardIndex = id;
  const [squares, setSquare] = useState(Array(9).fill(null));

  const winner = CalculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  function handleClick(i) {
    const nextSquares = squares.slice();

    // Check if this square is already click or not
    if (squares[i] || CalculateWinner(squares) || disabled) {
      return null;
    }

    // Check which is going to be next.
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    const nextWinner = CalculateWinner(nextSquares);
    if (nextWinner) {
      console.log("Winner is:", nextWinner);
      handleTableStatus(boardIndex, nextWinner);
    }

    const nextIsDraw = !nextWinner && nextSquares.every(Boolean);
    if (nextIsDraw) {
      console.log("Draw on board:", boardIndex);
      handleTableStatus(boardIndex, "D");
    }

    setSquare(nextSquares);
    setXIsNext((prev) => !prev); // Flip the next one to go.
    handleToDisabled(i);
  }

  useEffect(() => {
    setSquare(Array(9).fill(null)); // clear board
  }, [resetKey]);

  return (
    <div className={`tic-tac-toe ${!disabled ? "active" : ""}`}>
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          disabled={disabled}
          onSquareClick={() => handleClick(i)}
        />
      ))}
      {/* Add the overlay for winner or draw */}
      {(winner || isDraw) && (
        <div className="board-overlay">{winner || "D"}</div>
      )}
    </div>
  );
}

export default TicTacToe;
