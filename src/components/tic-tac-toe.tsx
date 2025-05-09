import { useState, useEffect } from "react"
import BotonJuego from './BotonJuego';
import Titulo from "./Titulo.tsx";
import CerrarSesion from "./CerrarSesion.tsx";

type Player = "X" | "O" | null
type GameResult = "win" | "loss" | "draw"

interface GameHistory {
  result: GameResult
  date: Date
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [history, setHistory] = useState<GameHistory[]>([])
  const [status, setStatus] = useState<string>("")
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true)

  // El usuario siempre es X, la CPU siempre es O
  const userMark: Player = "X"
  const cpuMark: Player = "O"

  // Check for winner
  const calculateWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  // Check if board is full
  const isBoardFull = (squares: Player[]): boolean => {
    return squares.every((square) => square !== null)
  }

  // CPU move logic
  const getCPUMove = (currentBoard: Player[]): number => {
    // Available moves
    const availableMoves = currentBoard
      .map((square, index) => (square === null ? index : -1))
      .filter((index) => index !== -1)

    if (availableMoves.length === 0) return -1

    // Check if CPU can win in the next move
    for (const move of availableMoves) {
      const boardCopy = [...currentBoard]
      boardCopy[move] = cpuMark
      if (calculateWinner(boardCopy) === cpuMark) {
        return move
      }
    }

    // Check if player can win in the next move and block
    for (const move of availableMoves) {
      const boardCopy = [...currentBoard]
      boardCopy[move] = userMark
      if (calculateWinner(boardCopy) === userMark) {
        return move
      }
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4
    }

    // Take corners if available
    const corners = [0, 2, 6, 8].filter((corner) => availableMoves.includes(corner))
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)]
    }

    // Take random available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  // Make CPU move
  const makeCPUMove = () => {
    if (gameOver) return

    const cpuMove = getCPUMove(board)
    if (cpuMove === -1) return

    const newBoard = [...board]
    newBoard[cpuMove] = cpuMark
    setBoard(newBoard)
    setIsUserTurn(true) // Devolver el turno al usuario

    // Check for game end conditions after CPU move
    const winner = calculateWinner(newBoard)
    if (winner || isBoardFull(newBoard)) {
      setGameOver(true)

      let result: GameResult
      if (winner === userMark) {
        result = "win"
        setStatus("¡Has ganado!")
      } else if (winner === cpuMark) {
        result = "loss"
        setStatus("¡Has perdido!")
      } else {
        result = "draw"
        setStatus("¡Empate!")
      }

      setHistory([...history, { result, date: new Date() }])
    }
  }

  // Effect to make CPU move after user's move
  useEffect(() => {
    // Solo hacer el movimiento de la CPU cuando no sea el turno del usuario y el juego no haya terminado
    if (!isUserTurn && !gameOver) {
      // Add a small delay to make the CPU move feel more natural
      const timeoutId = setTimeout(() => {
        makeCPUMove()
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [isUserTurn, gameOver])

  // Handle user click on a square
  const handleClick = (index: number) => {
    // Si no es el turno del usuario, o la casilla está ocupada, o el juego terminó, no hacer nada
    if (!isUserTurn || board[index] || gameOver) return

    const newBoard = [...board]
    newBoard[index] = userMark
    setBoard(newBoard)
    setIsUserTurn(false) // Cambiar el turno a la CPU

    // Check for game end conditions after user move
    const winner = calculateWinner(newBoard)
    if (winner || isBoardFull(newBoard)) {
      setGameOver(true)

      let result: GameResult
      if (winner === userMark) {
        result = "win"
        setStatus("¡Has ganado!")
      } else if (winner === cpuMark) {
        result = "loss"
        setStatus("¡Has perdido!")
      } else {
        result = "draw"
        setStatus("¡Empate!")
      }

      setHistory([...history, { result, date: new Date() }])
    }
  }

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setGameOver(false)
    setStatus("")
    setIsUserTurn(true) // El usuario siempre comienza
  }

  // Render a square
  const renderSquare = (index: number) => {
    return (
      <button
        className="w-full h-full flex items-center justify-center text-2xl font-bold"
        onClick={() => handleClick(index)}
        aria-label={`Square ${index}`}
      >
        {board[index] === userMark && <span className="text-green-500">X</span>}
        {board[index] === cpuMark && <span className="text-red-500">O</span>}
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Titulo />
      <BotonJuego />
      <div className="w-full max-w-[240px] px-4 py-8"> {/* Cambiado de max-w-sm a max-w-[240px] */}
        {/* Game Status */}
        {status && (
          <div className="text-center mb-4">
            <p>{status}</p>
          </div>
        )}

        {/* Game Board */}
        <div className="relative aspect-square mb-12">
          {/* Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {/* Vertical Lines */}
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white"></div>
            {/* Horizontal Lines */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white"></div>
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white"></div>
          </div>

          {/* Game Squares */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array(9)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="border-none">
                  {renderSquare(index)}
                </div>
              ))}
          </div>
        </div>

        {/* History Section */}
        <div className="text-center mt-8">
          <h2 className="text-xl mb-4">Historial</h2>
          <div className="flex gap-2">
            {history.slice(-3).map((game, index) => (
              <div key={index} className="w-6 h-6 flex items-center justify-center">
                {game.result === "win" && <div className="text-green-500">✓</div>}
                {game.result === "loss" && <div className="text-red-500">✗</div>}
                {game.result === "draw" && <div className="text-gray-500">□</div>}
              </div>
            ))}
          </div>
          {/* Reset Button (visible at any time) */}
        <button
          onClick={resetGame}
          className="mt-6 p-2 w-fit border border-[#F8F9FA] rounded-md hover:bg-[#F8F9FA] hover:text-[#181616] transition-colors justify-center"
        >
          Jugar de Nuevo
        </button>
        <CerrarSesion />
        </div>
      </div>
    </div>
  )
}
