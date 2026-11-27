import { CheckIcon, MinusIcon, XIcon } from "lucide-react"
import { cn } from "cn"

/*
 * OkNok — результат проверки точки контроля: ОК (годен) / НОК (не годен) / Н/П (не применимо).
 * Цвет + иконка + слово — смысл не только в цвете. Клавиатура: стрелки внутри группы.
 * Спецификация: docs/03-components.md → OkNok.
 */

export type OkNokValue = "ok" | "nok" | "na" | null

const OPTIONS = [
  { value: "ok" as const, label: "ОК", long: "Годен", icon: CheckIcon, on: "border-success bg-success text-success-foreground" },
  { value: "nok" as const, label: "НОК", long: "Не годен", icon: XIcon, on: "border-destructive bg-destructive text-destructive-foreground" },
  { value: "na" as const, label: "Н/П", long: "Не применимо", icon: MinusIcon, on: "border-foreground/40 bg-muted text-foreground" },
]

export function OkNok({
  value,
  onChange,
  allowNa = false,
  size = "default",
  label,
  disabled,
}: {
  value: OkNokValue
  onChange: (v: OkNokValue) => void
  allowNa?: boolean
  /** lg — терминал в цехе: кнопки 56px. */
  size?: "default" | "lg"
  /** Название точки контроля — для экранного диктора. */
  label: string
  disabled?: boolean
}) {
  const opts = allowNa ? OPTIONS : OPTIONS.slice(0, 2)
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-1.5">
      {opts.map((o, i) => {
        const on = value === o.value
        const Icon = o.icon
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            title={o.long}
            disabled={disabled}
            tabIndex={on || (value === null && i === 0) ? 0 : -1}
            onClick={() => onChange(on ? null : o.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault()
                const next = opts[(i + (e.key === "ArrowRight" ? 1 : opts.length - 1)) % opts.length]
                onChange(next.value)
                ;(e.currentTarget.parentElement?.children[opts.indexOf(next)] as HTMLElement | undefined)?.focus()
              }
            }}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-lg border bg-card font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
              size === "lg" ? "h-14 min-w-24 px-4 text-base" : "h-8 min-w-16 px-2.5 text-xs pointer-coarse:h-11",
              on ? o.on : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className={size === "lg" ? "size-5" : "size-3.5"} strokeWidth={2.5} />
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
