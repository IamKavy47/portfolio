import { useState } from "react"
import Window from "./Window"
import { Calendar as CalendarUI } from "@/components/ui/calendar"

interface CalendarProps {
  onClose: () => void
  onFocus: () => void
}

export default function Calendar({ onClose, onFocus }: CalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Window title="Calendar" onClose={onClose} onFocus={onFocus} initialSize={{ width: 400, height: 450 }}>
      <div className="p-4 bg-white">
        <CalendarUI mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        {date && <p className="mt-4 text-center">Selected date: {date.toLocaleDateString()}</p>}
      </div>
    </Window>
  )
}

