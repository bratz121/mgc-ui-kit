import * as React from "react"
import type { DateRange, Matcher } from "react-day-picker"
import { ru } from "react-day-picker/locale"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"

/*
 * Выбор даты и периода — всегда календарь кита (не системный input type="date"):
 * одинаковый вид во всех браузерах, русская локаль, неделя с понедельника.
 * Спецификация: docs/03-components.md → DatePicker / DateRangePicker.
 */

const pad = (n: number) => String(n).padStart(2, "0")
export const formatDate = (d?: Date) => (d ? `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}` : "")

/** Разбор «ДД.ММ.ГГГГ», «Д.М.ГГ», «ДДММГГГГ». */
export function parseDate(s: string): Date | undefined {
  const t = s.trim()
  let m = t.match(/^(\d{1,2})[./\-\s](\d{1,2})[./\-\s](\d{2}|\d{4})$/)
  if (!m) {
    const d = t.replace(/\D/g, "")
    if (d.length === 8) m = ["", d.slice(0, 2), d.slice(2, 4), d.slice(4)] as unknown as RegExpMatchArray
    else if (d.length === 6) m = ["", d.slice(0, 2), d.slice(2, 4), d.slice(4)] as unknown as RegExpMatchArray
  }
  if (!m) return undefined
  const day = Number(m[1])
  const month = Number(m[2]) - 1
  const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3])
  const date = new Date(year, month, day)
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : undefined
}

/** Ввод маски ДД.ММ.ГГГГ: точки подставляются сами. */
function maskDate(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}.${d.slice(2)}`
  return `${d.slice(0, 2)}.${d.slice(2, 4)}.${d.slice(4)}`
}

/* ─────────────────────────── DatePicker ─────────────────────────── */

export type DatePickerProps = {
  value?: Date
  onChange: (date: Date | undefined) => void
  id?: string
  placeholder?: string
  /** Недоступные даты — синтаксис react-day-picker: { before: new Date() }, { dayOfWeek: [0, 6] }… */
  disabled?: Matcher | Matcher[]
  "aria-invalid"?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  id,
  placeholder = "ДД.ММ.ГГГГ",
  disabled,
  className,
  ...aria
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState(formatDate(value))
  const [month, setMonth] = React.useState<Date | undefined>(value)
  const [invalid, setInvalid] = React.useState(false)

  // синхронизируем текст при внешнем изменении значения
  const [prev, setPrev] = React.useState(value)
  if (prev !== value) {
    setPrev(value)
    setText(formatDate(value))
    setMonth(value)
  }

  const commitText = () => {
    if (!text.trim()) {
      setInvalid(false)
      onChange(undefined)
      return
    }
    const d = parseDate(text)
    setInvalid(!d)
    if (d) onChange(d)
  }

  return (
    <InputGroup className={cn("w-full sm:w-48", className)}>
      <InputGroupInput
        id={id}
        value={text}
        inputMode="numeric"
        placeholder={placeholder}
        aria-invalid={aria["aria-invalid"] || invalid}
        onChange={(e) => setText(maskDate(e.target.value))}
        onBlur={commitText}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commitText()
          } else if (e.key === "ArrowDown" && e.altKey) {
            setOpen(true)
          }
        }}
        className="tabular-nums"
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger render={<InputGroupButton size="icon-xs" />}>
            <CalendarIcon />
            <span className="sr-only">Открыть календарь</span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
            <Calendar
              mode="single"
              locale={ru}
              selected={value}
              month={month}
              onMonthChange={setMonth}
              captionLayout="dropdown"
              startMonth={new Date(2015, 0)}
              endMonth={new Date(2035, 11)}
              disabled={disabled}
              onSelect={(d) => {
                onChange(d)
                setInvalid(false)
                setOpen(false)
              }}
            />
            <Separator />
            <div className="flex justify-between gap-2 p-2">
              <Button variant="ghost" size="sm" onClick={() => { onChange(undefined); setOpen(false) }}>Очистить</Button>
              <Button variant="outline" size="sm" onClick={() => { const t = new Date(); t.setHours(0, 0, 0, 0); onChange(t); setOpen(false) }}>Сегодня</Button>
            </div>
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}

/* ───────────────────────── DateRangePicker ───────────────────────── */

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const startOfWeek = (d: Date) => addDays(d, -((d.getDay() + 6) % 7))

export function rangePresets(today = new Date()): { label: string; range: DateRange }[] {
  const t = startOfDay(today)
  const w = startOfWeek(t)
  return [
    { label: "Сегодня", range: { from: t, to: t } },
    { label: "Вчера", range: { from: addDays(t, -1), to: addDays(t, -1) } },
    { label: "Эта неделя", range: { from: w, to: t } },
    { label: "Прошлая неделя", range: { from: addDays(w, -7), to: addDays(w, -1) } },
    { label: "Этот месяц", range: { from: new Date(t.getFullYear(), t.getMonth(), 1), to: t } },
    { label: "Прошлый месяц", range: { from: new Date(t.getFullYear(), t.getMonth() - 1, 1), to: new Date(t.getFullYear(), t.getMonth(), 0) } },
    { label: "30 дней", range: { from: addDays(t, -29), to: t } },
  ]
}

export function formatRange(r?: DateRange) {
  if (!r?.from) return ""
  if (!r.to || r.from.getTime() === r.to.getTime()) return formatDate(r.from)
  const sameYear = r.from.getFullYear() === r.to.getFullYear()
  const from = sameYear ? `${pad(r.from.getDate())}.${pad(r.from.getMonth() + 1)}` : formatDate(r.from)
  return `${from} — ${formatDate(r.to)}`
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Выберите период",
  today,
  className,
}: {
  value?: DateRange
  onChange: (r: DateRange | undefined) => void
  placeholder?: string
  /** «Сегодня» для пресетов (по умолчанию — текущая дата). */
  today?: Date
  className?: string
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<DateRange | undefined>(value)
  const presets = rangePresets(today)
  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) setDraft(value)
      }}
    >
      <PopoverTrigger render={<Button variant="outline" className={cn("w-full justify-start font-normal sm:w-auto", className)} />}>
        <CalendarIcon data-icon="inline-start" />
        <span className={cn("tabular-nums", !value?.from && "text-muted-foreground")}>{formatRange(value) || placeholder}</span>
        <ChevronDownIcon data-icon="inline-end" className="ml-auto text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start">
        <div className="flex max-sm:flex-col">
          <div className="flex gap-1 overflow-x-auto border-b p-2 sm:w-40 sm:flex-col sm:border-r sm:border-b-0">
            {presets.map((p) => (
              <Button key={p.label} variant="ghost" size="sm" className="shrink-0 justify-start" onClick={() => setDraft(p.range)}>
                {p.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-col">
            <Calendar
              mode="range"
              locale={ru}
              numberOfMonths={isMobile ? 1 : 2}
              selected={draft}
              onSelect={setDraft}
              defaultMonth={draft?.from ?? today}
            />
            <Separator />
            <div className="flex items-center justify-between gap-2 p-2">
              <span className="px-1 text-sm text-muted-foreground tabular-nums">{formatRange(draft) || "Период не выбран"}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Отмена</Button>
                <Button size="sm" disabled={!draft?.from} onClick={() => { onChange(draft); setOpen(false) }}>Применить</Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
