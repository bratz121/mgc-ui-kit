import * as React from "react"
import { cn } from "cn"

/*
 * Интерактивная легенда (dataviz: легенда обязательна при 2+ сериях, маркер повторяет метку).
 * Клик — скрыть/показать серию; наведение — подсветить; двойной клик — «только эта».
 * Спецификация: docs/03-components.md → InteractiveLegend.
 */

export type LegendItem = { key: string; label: string; color: string; value?: React.ReactNode }

export function useSeriesVisibility(keys: string[]) {
  const [hidden, setHidden] = React.useState<Set<string>>(new Set())
  const [hover, setHover] = React.useState<string | null>(null)
  const toggle = (k: string) =>
    setHidden((s) => {
      const n = new Set(s)
      if (n.has(k)) n.delete(k)
      else if (n.size < keys.length - 1) n.add(k) // хотя бы одна серия остаётся видимой
      return n
    })
  const only = (k: string) => setHidden(new Set(keys.filter((x) => x !== k)))
  const reset = () => setHidden(new Set())
  /** Прозрачность серии с учётом наведения на легенду. */
  const opacity = (k: string) => (hover && hover !== k ? 0.2 : 1)
  return { hidden, hover, setHover, toggle, only, reset, opacity }
}

export function InteractiveLegend({
  items,
  hidden,
  onToggle,
  onOnly,
  onHover,
  onReset,
  mark = "rect",
  layout = "inline",
  className,
}: {
  items: LegendItem[]
  hidden: Set<string>
  onToggle: (k: string) => void
  onOnly?: (k: string) => void
  onHover?: (k: string | null) => void
  onReset?: () => void
  mark?: "rect" | "line" | "dot"
  /** list — столбиком: подпись слева, значение справа (легенда кольца). */
  layout?: "inline" | "list"
  className?: string
}) {
  const list = layout === "list"
  return (
    <div className={cn("flex gap-x-1 gap-y-1 text-sm", list ? "flex-col items-stretch" : "flex-wrap items-center", className)} role="group" aria-label="Легенда: нажмите, чтобы скрыть или показать серию">
      {items.map((it) => {
        const off = hidden.has(it.key)
        return (
          <button
            key={it.key}
            type="button"
            aria-pressed={!off}
            onClick={() => onToggle(it.key)}
            onDoubleClick={() => onOnly?.(it.key)}
            onMouseEnter={() => onHover?.(it.key)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(it.key)}
            onBlur={() => onHover?.(null)}
            title="Клик — скрыть/показать · двойной клик — только эта"
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
              off && "text-muted-foreground line-through decoration-1"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "shrink-0",
                mark === "rect" && "size-2.5 rounded-[2px]",
                mark === "line" && "h-0.5 w-3.5 rounded-full",
                mark === "dot" && "size-2.5 rounded-full",
                off && "opacity-30"
              )}
              style={{ background: it.color }}
            />
            <span className={cn(list && "flex-1")}>{it.label}</span>
            {it.value !== undefined && <span className="shrink-0 text-muted-foreground tabular-nums">{it.value}</span>}
          </button>
        )
      })}
      {hidden.size > 0 && onReset && (
        <button type="button" onClick={onReset} className="rounded-md px-2 text-sm text-module-strong underline-offset-4 hover:underline">
          Показать все
        </button>
      )}
    </div>
  )
}
