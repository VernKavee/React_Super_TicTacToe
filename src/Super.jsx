import { useState, useEffect } from "react";
import TicTacToe from "./TicTacToe";
import CalculateWinner from "./CalculateWinner";

function Super() {
  const [table, setTable] = useState(Array(9).fill(null)); // Each table
  const [tableDisabled, setTableDisabled] = useState(Array(9).fill(false)); // For enabled the table
  const [xIsNext, setXIsNext] = useState(true); // x start th sequent
  const [toDisabled, setToDisabled] = useState(null);
  const [resetKey, setResetKey] = useState(0); // For reset the game

  const xWins = table.filter((t) => t === "X").length;
  const oWins = table.filter((t) => t === "O").length;
  const draws = table.filter((t) => t === "D").length;

  // For disalbe board
  function handleTableDisabled(i) {
    console.log(`handle ${i} : ${toDisabled}`);
    const nextDisabledTable = Array(9).fill(true);

    // Case 1: Game finished (i === null)
    if (i === null) {
      console.log(nextDisabledTable);
      setTableDisabled(nextDisabledTable); // all true = disable all
      return;
    }

    // Case 2: Sent to a finished board
    if (table[i] !== null) {
      // Enable all boards that are not finished (i.e., still null)
      for (let j = 0; j < 9; j++) {
        if (table[j] === null) {
          // If this board is still active(null)
          nextDisabledTable[j] = false; // enable this board
        }
      }
      setTableDisabled(nextDisabledTable);
      return;
    }

    // Case 3: Normal play — only enable the selected board
    if (table[i] === null) nextDisabledTable[i] = false;
    setTableDisabled(nextDisabledTable);
  }

  // For store who is winning or draw in each board
  function handleTableStatus(i, winner) {
    const nextTable = table.slice(); // create a copy of the current table state

    // Prevent overwriting an already won board
    if (table[i] || CalculateWinner(nextTable)) {
      return null;
    }

    // Mark the winner for board i
    nextTable[i] = winner;

    // Update state
    setTable(nextTable);

    // Log the updated value
    console.log("Updated table:", nextTable);
  }

  function handleToDisabled(i) {
    setToDisabled((prev) => null);
    setTimeout(() => {
      setToDisabled((prev) => i);
      console.log("Set to:", i);
    }, 0);
  }

  useEffect(() => {
    console.log(`this is ${toDisabled}`);
    if (toDisabled !== null) {
      handleTableDisabled(toDisabled);
    }
  }, [toDisabled]);

  const winner = CalculateWinner(table);
  const isDraw = !winner && table.every(Boolean);

  useEffect(() => {
    if (winner || isDraw) {
      handleTableDisabled(null); // disabled all(have winner or draw)
    }
  }, [winner, isDraw]);

  let tiebreakWinner = null;

  if (isDraw) {
    if (xWins > oWins) {
      tiebreakWinner = "X";
    } else if (oWins > xWins) {
      tiebreakWinner = "O";
    } else {
      tiebreakWinner = "D"; // True draw even after tiebreak
    }
  }

  // Text for the player
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    if (tiebreakWinner === "D") {
      status = "Draw (equal wins)";
    } else {
      status = "Winner by tiebreak: " + tiebreakWinner;
    }
  } else {
    status = "Current Player: " + (xIsNext ? "X" : "O");
  }

  // Reset game function
  function resetGame() {
    // clear the Super tictactoe game state
    setTable((prev) => Array(9).fill(null));
    setTableDisabled((prev) => Array(9).fill(false));
    setXIsNext((prev) => true);
    setToDisabled((prev) => null);

    // clear the state of the game inside by sends a signal
    setResetKey((prev) => prev + 1);

    console.log("Reset Game Ended.");
    console.log(table);
  }

  return (
    <>
      <p className="status">
        Score — X: {xWins}, O: {oWins}, Draws: {draws}
        <br />
        {status}
      </p>

      <div className="control-container">
        <button className="reset-button" onClick={() => resetGame()}>
          Reset
        </button>
      </div>

      <div className="board-container">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <TicTacToe
              key={i}
              id={i}
              xIsNext={xIsNext}
              setXIsNext={setXIsNext}
              disabled={tableDisabled[i]}
              handleTableDisabled={handleTableDisabled}
              handleTableStatus={handleTableStatus}
              table={table}
              handleToDisabled={handleToDisabled}
              resetKey={resetKey}
            />
          ))}
      </div>
    </>
  );
}

export default Super;
