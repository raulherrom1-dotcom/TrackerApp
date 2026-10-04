import { Check } from 'lucide-react'
import { addDays, toDateString } from '../../utils/date'

const DAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

interface DayRowProps {
  weekStart: Date
  trainedDates: Set<string>
}

export function DayRow({ weekStart, trainedDates }: DayRowProps) {
  const today = toDateString(new Date())

  return (
    <div className="flex justify-between">
      {DAY_LETTERS.map((letter, i) => {
        const date = toDateString(addDays(weekStart, i))
        const trained = trainedDates.has(date)
        const isToday = date === today
        return (
          <div key={date} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                trained
                  ? 'bg-accent text-accent-ink'
                  : isToday
                    ? 'border-2 border-accent text-ink'
                    : 'bg-surface text-muted'
              }`}
            >
              {trained ? <Check size={18} strokeWidth={3} /> : letter}
            </div>
          </div>
        )
      })}
    </div>
  )
}
