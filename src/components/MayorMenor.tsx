"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"
import BotonJuego from './BotonJuego'
import Titulo from "./Titulo.tsx"
import CerrarSesion from "./CerrarSesion.tsx"

type Result = "win" | "lose" | "draw"

export default function MayorMenor() {
  const [currentNumber, setCurrentNumber] = useState<number>(0)
  const [nextNumber, setNextNumber] = useState<number | null>(null)
  const [score, setScore] = useState<number>(0)
  const [maxRounds] = useState<number>(5)
  const [round, setRound] = useState<number>(0)
  const [gameHistory, setGameHistory] = useState<Result[]>([])
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [gameResult, setGameResult] = useState<string>("")
  const [showNextNumber, setShowNextNumber] = useState<boolean>(false)

  // Generate a random number between 1 and 100
  const generateRandomNumber = (): number => {
    return Math.floor(Math.random() * 21) + 1
  }

  // Initialize the game
  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const initialNumber = generateRandomNumber()
    setCurrentNumber(initialNumber)
    setNextNumber(generateRandomNumber())
    setScore(0)
    setRound(0)
    // No resetear el historial de partidas
    // setGameHistory se mantiene con su valor actual
    setGameOver(false)
    setShowNextNumber(false)
  }

  const handleGuess = (isHigher: boolean) => {
    if (gameOver || nextNumber === null) return

    setShowNextNumber(true)

    const isCorrect = (isHigher && nextNumber > currentNumber) || (!isHigher && nextNumber < currentNumber)

    if (isCorrect) {
      setScore(score + 1)
    }

    // Wait a moment to show the next number before updating
    setTimeout(() => {
      const newRound = round + 1
      setRound(newRound)

      // Check if game is over
      if (newRound >= maxRounds) {
        setGameOver(true)
        // Determine game result
        const finalScore = isCorrect ? score + 1 : score
        let result: Result

        if (finalScore >= 3) {
          result = "win"
          setGameResult("¡Has ganado la partida!")
        } else if (finalScore === 2) {
          result = "draw"
          setGameResult("¡Has empatado la partida!")
        } else {
          result = "lose"
          setGameResult("Has perdido la partida")
        }
        // Add result to game history
        setGameHistory((prev) => [...prev, result])
      } else {
        setCurrentNumber(nextNumber)
        setNextNumber(generateRandomNumber())
        setShowNextNumber(false)
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Titulo />
      <BotonJuego />
      <div className="flex flex-col items-center w-full max-w-sm px-4 py-8">
        <div className="flex flex-col items-center w-full mb-8">
          <div className="bg-zinc-800 rounded-md w-24 h-24 flex items-center justify-center mb-6">
            <span className="text-4xl font-bold">{currentNumber}</span>
          </div>

          <div className="mb-6">
            <span className="text-xl">
              {score}/{maxRounds}
            </span>
          </div>

          {showNextNumber && (
            <div className="bg-zinc-800 rounded-md w-24 h-24 flex items-center justify-center mb-6">
              <span className="text-4xl font-bold">{nextNumber}</span>
            </div>
          )}

          {!gameOver && !showNextNumber && (
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => handleGuess(false)}
                className="bg-zinc-800 hover:bg-zinc-700 rounded-md w-12 h-12 flex items-center justify-center"
              >
                <ChevronDown className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleGuess(true)}
                className="bg-zinc-800 hover:bg-zinc-700 rounded-md w-12 h-12 flex items-center justify-center"
              >
                <ChevronUp className="h-6 w-6" />
              </button>
            </div>
          )}

          {gameOver && (
            <div className="flex flex-col items-center">
              <div className="text-xl mb-4 font-bold">{gameResult}</div>
              <button onClick={startNewGame} className="bg-zinc-800 hover:bg-zinc-700 rounded-md px-4 py-2">
                Jugar de nuevo
              </button>
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-xl mb-2 text-center">Historial</h2>
            <div className="flex gap-2">
              {gameHistory.map((result, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-sm mb-4",
                    result === "win" ? "bg-green-500" : result === "lose" ? "bg-red-500" : "bg-yellow-500",
                  )}
                >
                  {result === "win" ? "✓" : result === "lose" ? "✗" : "="}
                </div>
              ))}
            </div>
            <CerrarSesion />
          </div>
        </div>
      </div>
    </div>
  )
}
