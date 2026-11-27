import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

/*
 * «Под кат» — постепенное раскрытие. Спецификация: docs/03-components.md → ShowMoreList / ExpandableText.
 */

/** Список: показываем первые N, остальное — по кнопке «Показать ещё K». */
export function ShowMoreList<T>({
  items,
  initial = 5,
  step,
  renderItem,
  className,
}: {
  items: T[]
  initial?: number
  /** Сколько добавлять за нажатие. Не задано — раскрыть всё. */
  step?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}) {
  const [count, setCount] = React.useState(initial)
  const rest = items.length - count
  const expanded = count > initial
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ul className="flex flex-col">{items.slice(0, count).map((it, i) => <li key={i}>{renderItem(it, i)}</li>)}</ul>
      {(rest > 0 || expanded) && (
        <div className="flex gap-2">
          {rest > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setCount((c) => (step ? c + step : items.length))}>
              <ChevronDownIcon data-icon="inline-start" />
              Показать ещё {step ? Math.min(step, rest) : rest}
              <span className="text-muted-foreground tabular-nums">из {items.length}</span>
            </Button>
          )}
          {expanded && (
            <Button variant="ghost" size="sm" onClick={() => setCount(initial)}>
              Свернуть
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/** Длинный текст: первые строки и «Читать полностью». Кнопка появляется, только если текст не влез. */
export function ExpandableText({
  children,
  lines = 3,
  className,
}: {
  children: React.ReactNode
  lines?: number
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [overflow, setOverflow] = React.useState(false)
  const ref = React.useRef<HTMLParagraphElement>(null)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setOverflow(el.scrollHeight > el.clientHeight + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <p
        ref={ref}
        className="text-sm text-pretty"
        style={open ? undefined : { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {children}
      </p>
      {(overflow || open) && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="rounded-sm text-sm font-medium text-module-strong underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {open ? "Свернуть" : "Читать полностью"}
        </button>
      )}
    </div>
  )
}
