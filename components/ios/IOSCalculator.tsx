"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"

interface IOSCalculatorProps {
  onClose: () => void
}

export default function IOSCalculator({ onClose }: IOSCalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [isNewNumber, setIsNewNumber] = useState(true)

  const handleNumberClick = (num: string) => {
    if (isNewNumber) {
      setDisplay(num)
      setIsNewNumber(false)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperationClick = (op: string) => {
    setPrevValue(Number.parseFloat(display))
    setOperation(op)
    setIsNewNumber(true)
  }

  const handleEquals = () => {
    if (prevValue !== null && operation) {
      const current = Number.parseFloat(display)
      let result: number
      switch (operation) {
        case "+":
          result = prevValue + current
          break
        case "-":
          result = prevValue - current
          break
        case "×":
          result = prevValue * current
          break
        case "÷":
          result = prevValue / current
          break
        default:
          return
      }
      setDisplay(result.toString())
      setPrevValue(null)
      setOperation(null)
      setIsNewNumber(true)
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPrevValue(null)
    setOperation(null)
    setIsNewNumber(true)
  }

  const buttons = [
    { text: "C", type: "function" },
    { text: "±", type: "function" },
    { text: "%", type: "function" },
    { text: "÷", type: "operation" },
    { text: "7", type: "number" },
    { text: "8", type: "number" },
    { text: "9", type: "number" },
    { text: "×", type: "operation" },
    { text: "4", type: "number" },
    { text: "5", type: "number" },
    { text: "6", type: "number" },
    { text: "-", type: "operation" },
    { text: "1", type: "number" },
    { text: "2", type: "number" },
    { text: "3", type: "number" },
    { text: "+", type: "operation" },
    { text: "0", type: "number", wide: true },
    { text: ".", type: "number" },
    { text: "=", type: "operation" },
  ]

  return (
    <div className="h-full flex flex-col bg-black text-white">
      <header className="px-4 py-2 flex items-center justify-between">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Calculator</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 flex flex-col justify-end p-4">
        <div className="text-right mb-4">
          <span className="text-6xl font-light">{display}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((button) => (
            <button
              key={button.text}
              onClick={() => {
                if (button.type === "number") handleNumberClick(button.text)
                else if (button.type === "operation") {
                  button.text === "=" ? handleEquals() : handleOperationClick(button.text)
                } else if (button.text === "C") handleClear()
              }}
              className={`
                ${button.wide ? "col-span-2" : ""}
                ${button.type === "function" ? "bg-[#A5A5A5] text-black" : ""}
                ${button.type === "operation" ? "bg-[#FF9F0A] text-white" : ""}
                ${button.type === "number" ? "bg-[#333333] text-white" : ""}
                h-16 rounded-full text-2xl font-medium
                active:opacity-70 transition-opacity
                flex items-center justify-center
              `}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

