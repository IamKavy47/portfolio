"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface IOSCalculatorProps {
  onClose: () => void
}

export default function IOSCalculator({ onClose }: IOSCalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const toggleSign = () => {
    setDisplay(String(-Number.parseFloat(display)))
  }

  const inputPercent = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(value / 100))
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue)
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = (op: string, first: number, second: number) => {
    switch (op) {
      case "+":
        return first + second
      case "-":
        return first - second
      case "×":
        return first * second
      case "÷":
        return first / second
      default:
        return second
    }
  }

  const handleEquals = () => {
    if (firstOperand === null || operator === null) {
      return
    }

    const inputValue = Number.parseFloat(display)
    const result = performCalculation(operator, firstOperand, inputValue)

    setDisplay(String(result))
    setFirstOperand(result)
    setOperator(null)
    setWaitingForSecondOperand(true)
  }

  const buttons = [
    { text: "AC", type: "function", action: clearDisplay },
    { text: "+/-", type: "function", action: toggleSign },
    { text: "%", type: "function", action: inputPercent },
    { text: "÷", type: "operator", action: () => handleOperator("÷") },
    { text: "7", type: "digit", action: () => inputDigit("7") },
    { text: "8", type: "digit", action: () => inputDigit("8") },
    { text: "9", type: "digit", action: () => inputDigit("9") },
    { text: "×", type: "operator", action: () => handleOperator("×") },
    { text: "4", type: "digit", action: () => inputDigit("4") },
    { text: "5", type: "digit", action: () => inputDigit("5") },
    { text: "6", type: "digit", action: () => inputDigit("6") },
    { text: "-", type: "operator", action: () => handleOperator("-") },
    { text: "1", type: "digit", action: () => inputDigit("1") },
    { text: "2", type: "digit", action: () => inputDigit("2") },
    { text: "3", type: "digit", action: () => inputDigit("3") },
    { text: "+", type: "operator", action: () => handleOperator("+") },
    { text: "0", type: "digit", action: () => inputDigit("0"), wide: true },
    { text: ".", type: "digit", action: inputDecimal },
    { text: "=", type: "operator", action: handleEquals },
  ]

  return (
    <div className="h-full w-full bg-black text-white flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <button onClick={onClose} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Calculator</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-end justify-end p-6">
          <div className="text-right text-6xl font-light truncate">{display}</div>
        </div>

        <div className="grid grid-cols-4 gap-2 p-2">
          {buttons.map((button, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              className={`
                rounded-full h-20 flex items-center justify-center text-2xl font-medium
                ${button.type === "function" ? "bg-gray-500 text-black" : ""}
                ${button.type === "operator" ? "bg-orange-500" : ""}
                ${button.type === "digit" ? "bg-gray-800" : ""}
                ${button.wide ? "col-span-2 justify-start pl-7" : ""}
              `}
              onClick={button.action}
            >
              {button.text}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

