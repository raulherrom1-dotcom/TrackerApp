export function todayDateString(): string {
  return toDateString(new Date())
}

export function toDateString(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** Lunes como primer día de la semana. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + diff)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/** "YYYY-MM-DD" -> Date local (evita el corrimiento de un día que da `new Date(str)` por UTC). */
export function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const weekdayShortFmt = new Intl.DateTimeFormat('es', { weekday: 'short' })
const dayMonthFmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })
const dayMonthYearFmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' })

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function formatSessionDate(dateStr: string): string {
  const date = parseDateString(dateStr)
  return `${capitalize(weekdayShortFmt.format(date))}, ${dayMonthFmt.format(date)}`
}

export function formatChartDate(dateStr: string): string {
  return dayMonthFmt.format(parseDateString(dateStr))
}

export function formatFullDate(dateStr: string): string {
  return capitalize(dayMonthYearFmt.format(parseDateString(dateStr)))
}
