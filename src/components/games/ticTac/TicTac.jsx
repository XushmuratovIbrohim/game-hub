import { useState, useEffect } from "react";

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const winner = calculateWinner(board);

    useEffect(() => {
        if (!isXNext && !winner) {
            const timeout = setTimeout(() => {
                makeComputerMove();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [isXNext, winner]);

    const handleClick = (index) => {
        if (board[index] || winner || !isXNext) return;

        const newBoard = board.slice();
        newBoard[index] = "X";
        setBoard(newBoard);
        setIsXNext(false);
    };

    const makeComputerMove = () => {
        const availableMoves = board
            .map((value, index) => (value === null ? index : null))
            .filter((val) => val !== null);

        if (availableMoves.length === 0) return;

        const randomMove =
            availableMoves[Math.floor(Math.random() * availableMoves.length)];
        const newBoard = board.slice();
        newBoard[randomMove] = "O";
        setBoard(newBoard);
        setIsXNext(true);
    };

    const renderSquare = (index) => {
        return (
            <button className="square" onClick={() => handleClick(index)}>
                {board[index]}
            </button>
        );
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
    };

    const status = winner
        ? `Winner: ${winner}`
        : `Next player: ${isXNext ? "X" : "O"}`;

    return (
        <div className="game">
            <div className="game-board">
                <div className="board-row">
                    {renderSquare(0)}
                    {renderSquare(1)}
                    {renderSquare(2)}
                </div>
                <div className="board-row">
                    {renderSquare(3)}
                    {renderSquare(4)}
                    {renderSquare(5)}
                </div>
                <div className="board-row">
                    {renderSquare(6)}
                    {renderSquare(7)}
                    {renderSquare(8)}
                </div>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={resetGame}>Reset</button>
            </div>
        </div>
    );
};

const calculateWinner = (board) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
};

export default TicTacToe;
