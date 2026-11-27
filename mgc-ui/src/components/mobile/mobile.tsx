import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowLeftIcon, DeleteIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

/*
 * Мобильные компоненты кита. Для телефонов и планшетов мастеров/наладчиков
 * и для сенсорных терминалов в цехе.
 * Спецификация: docs/04-patterns.md → «Мобильная версия».
 *
 * Правила: цель касания ≥ 44px, главное действие — внизу (зона большого пальца),
 * учёт вырезов экрана через env(safe-area-inset-*).
 */

/* ── Шапка экрана ── */

export function MobileHeader({
  title,
  subtitle,
  onBack,
  actions,
  className,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <header
      data-slot="mobile-header"
      className={cn(
        "sticky top-0 z-10 flex min-h-14 shrink-0 items-center gap-1 border-b bg-background/95 px-1 pt-[env(safe-area-inset-top)] backdrop-blur",
        !onBack && "pl-4",
        className
      )}
    >
      {onBack && (
        <Button variant="ghost" size="icon-lg" className="size-11" onClick={onBack}>
          <ArrowLeftIcon />
          <span className="sr-only">Назад</span>
        </Button>
      )}
      <div className="flex min-w-0 flex-1 flex-col py-2">
        <h1 className="truncate text-base leading-tight font-semibold">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center">{actions}</div>}
    </header>
  )
}

/* ── Нижняя навигация ── */

export type BottomNavItem = { id: string; label: string; icon: LucideIcon; badge?: number }

export function BottomNav({
  items,
  value,
  onChange,
  className,
}: {
  items: BottomNavItem[]
  value: string
  onChange: (id: string) => void
  className?: string
}) {
  return (
    <nav
      data-slot="bottom-nav"
      aria-label="Основная навигация"
      className={cn(
        "sticky bottom-0 z-10 grid shrink-0 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map(({ id, label, icon: Icon, badge }) => {
        const active = id === value
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(id)}
            className={cn(
              "relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-muted-foreground outline-none transition-colors focus-visible:bg-muted active:bg-muted",
              active && "font-medium text-foreground"
            )}
          >
            {active && <span aria-hidden className="absolute inset-x-5 top-0 h-0.5 rounded-b-full bg-module-strong" />}
            <span className="relative">
              <Icon className="size-[22px]" strokeWidth={active ? 2.2 : 1.8} />
              {badge ? (
                <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground tabular-nums">
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
            </span>
            <span className="truncate">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

/* ── Нижняя панель действий ── */

export function ActionBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      data-slot="action-bar"
      className={cn(
        "sticky bottom-0 z-10 flex shrink-0 gap-2 border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur [&>*]:min-h-11 [&>*]:flex-1",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ── Плавающая кнопка ── */

export function Fab({
  icon: Icon,
  label,
  onClick,
  extended,
  className,
}: {
  icon: LucideIcon
  label: string
  onClick?: () => void
  /** С подписью — когда действие не очевидно по иконке. */
  extended?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute right-4 bottom-20 z-10 flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground shadow-[0_6px_16px_-4px_oklch(0_0_0/0.35)] outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95",
        extended ? "px-5" : "w-14",
        className
      )}
    >
      <Icon className="size-6" />
      {extended ? <span className="text-sm font-medium">{label}</span> : <span className="sr-only">{label}</span>}
    </button>
  )
}

/* ── Горизонтальные чипы-фильтры ── */

export function ChipScroller({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: string; count?: number }[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      className={cn("flex shrink-0 gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              on ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cn("text-xs tabular-nums", on ? "text-primary-foreground/70" : "text-muted-foreground")}>{o.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── Секция списка с заголовком ── */

export function MobileSection({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 py-2">
      {title && (
        <div className="flex items-center justify-between px-4">
          <h2 className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

/* ── Крупная цифровая клавиатура (терминалы) ── */

export function Numpad({ onDigit, onBackspace, onSubmit, submitLabel = "Войти" }: {
  onDigit: (d: string) => void
  onBackspace: () => void
  onSubmit?: () => void
  submitLabel?: string
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  const cls = "flex h-16 items-center justify-center rounded-2xl bg-muted text-2xl font-medium tabular-nums outline-none transition-colors active:bg-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/50"
  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((k) => <button key={k} type="button" className={cls} onClick={() => onDigit(k)}>{k}</button>)}
      <button type="button" className={cls} onClick={onBackspace}><DeleteIcon className="size-6" /><span className="sr-only">Стереть</span></button>
      <button type="button" className={cls} onClick={() => onDigit("0")}>0</button>
      <button type="button" className={cn(cls, "bg-primary text-base text-primary-foreground active:bg-primary/80")} onClick={onSubmit}>{submitLabel}</button>
    </div>
  )
}
