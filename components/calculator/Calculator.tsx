import { useState } from "react"
import Window from "./Window"

interface CalculatorProps {
  onClose: () => void
  onFocus: () => void
}

export default function Calculator({ onClose, onFocus }: CalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)

  const handleNumberClick = (num: string) => {
    setDisplay((prev) => (prev === "0" ? num : prev + num))
  }

  const handleOperationClick = (op: string) => {
    setPrevValue(Number.parseFloat(display))
    setOperation(op)
    setDisplay("0")
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
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPrevValue(null)
    setOperation(null)
  }

  const buttons = ["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="]

  return (
    <Window title="Calculator" onClose={onClose} onFocus={onFocus} initialSize={{ width: 300, height: 400 }}>
      <div className="h-full flex flex-col bg-transparent rounded-lg">
        <div className="text-white text-right pr-4 mb-2 rounded text-7xl flex-none">{display}</div>
        <div className="flex-1 grid grid-cols-4 gap-[1.5px]">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if ("0123456789.".includes(btn)) handleNumberClick(btn)
                else if ("+-×÷".includes(btn)) handleOperationClick(btn)
                else if (btn === "=") handleEquals()
                else if (btn === "C") handleClear()
              }}
              className={` text-white text-3xl flex items-center justify-center
                ${btn === "0" ? "col-span-2" : ""}
                ${["÷", "×", "-", "+", "="].includes(btn) ? "bg-[#FF9f09]" : "bg-[#737474]"}
                hover:bg-opacity-80`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </Window>
  )
}

