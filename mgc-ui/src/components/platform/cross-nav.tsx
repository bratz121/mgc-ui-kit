import * as React from "react"
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon, LayoutGridIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { MODULES_WITH_ACCENT, PLATFORM_MODULES, type PlatformModuleKey } from "./modules"
import { ModuleTile } from "./platform-sidebar"

/*
 * Навигация внутри приложения и между приложениями платформы.
 * Спецификация: docs/04-patterns.md → «Навигация».
 */

/* ── Переключатель приложений (лаунчер) ── */

export function ModuleSwitcher({
  current,
  urls = {},
  onSelect,
}: {
  current: PlatformModuleKey
  /** Ссылки площадки (config.js → PROJECT_URLS). Модуль без ссылки не показывается. */
  urls?: Partial<Record<PlatformModuleKey, string>>
  onSelect?: (m: PlatformModuleKey) => void
}) {
  const list = MODULES_WITH_ACCENT.filter((k) => k !== "platform" && (k === current || urls[k] !== undefined || !Object.keys(urls).length))
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="icon-lg" />}>
        <LayoutGridIcon />
        <span className="sr-only">Приложения платформы</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(30rem,calc(100vw-2rem))] p-3">
        <PopoverHeader className="px-1 pb-2">
          <PopoverTitle>Приложения платформы</PopoverTitle>
          <PopoverDescription>Открываются в новой вкладке</PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {list.map((k) => {
            const m = PLATFORM_MODULES[k]
            const on = k === current
            return (
              <a
                key={k}
                href={urls[k] ?? "#"}
                target={on ? undefined : "_blank"}
                rel="noopener noreferrer"
                data-module={k}
                aria-current={on ? "page" : undefined}
                onClick={(e) => {
                  if (onSelect) {
                    e.preventDefault()
                    onSelect(k)
                  }
                }}
                className={cn(
                  "flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-lg p-2 text-center text-xs leading-tight transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                  on && "bg-module-soft font-medium text-module-strong"
                )}
              >
                <ModuleTile moduleKey={k} />
                <span className="line-clamp-2">{m.name}</span>
              </a>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* ── Ссылка в смежное приложение ── */

export function ModuleLink({
  module,
  href = "#",
  children,
  className,
}: {
  module: PlatformModuleKey
  href?: string
  /** Что откроется: «Заявка ЗН-2026-00481», «Создать заявку». */
  children: React.ReactNode
  className?: string
}) {
  const m = PLATFORM_MODULES[module]
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-module={module}
      className={cn(
        "group inline-flex max-w-full items-center gap-2 rounded-lg border bg-card py-1.5 pr-2.5 pl-1.5 text-sm transition-colors outline-none hover:border-module-strong/50 hover:bg-module-soft focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <ModuleTile moduleKey={module} className="size-7 [&_img]:size-7" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[11px] text-muted-foreground">{m.name}</span>
        <span className="truncate font-medium group-hover:text-module-strong">{children}</span>
      </span>
      <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground" aria-label="откроется в новой вкладке" />
    </a>
  )
}

/* ── Связанные записи из других модулей ── */

export function RelatedRecords({
  items,
}: {
  items: { module: PlatformModuleKey; title: string; meta?: string; href?: string; status?: React.ReactNode }[]
}) {
  return (
    <ul className="flex flex-col divide-y rounded-xl border bg-card">
      {items.map((it) => (
        <li key={`${it.module}-${it.title}`}>
          <a
            href={it.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            data-module={it.module}
            className="group flex items-center gap-3 px-3 py-2.5 outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted"
          >
            <ModuleTile moduleKey={it.module} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium group-hover:text-module-strong">{it.title}</span>
              <span className="truncate text-xs text-muted-foreground">{PLATFORM_MODULES[it.module].name}{it.meta ? ` · ${it.meta}` : ""}</span>
            </span>
            {it.status}
            <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
          </a>
        </li>
      ))}
    </ul>
  )
}

/* ── Возврат с контекстом ── */

export function BackLink({ children, onClick, href = "#" }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ArrowLeftIcon className="size-4" />
      {children}
    </a>
  )
}

/* ── Листание записей ── */

export function RecordPager({
  index,
  total,
  onPrev,
  onNext,
}: {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="inline-flex items-center gap-1">
      <Button variant="outline" size="icon-sm" onClick={onPrev} disabled={index <= 0}>
        <ChevronLeftIcon /><span className="sr-only">Предыдущая запись</span>
      </Button>
      <span className="min-w-20 text-center text-sm text-muted-foreground tabular-nums">
        {index + 1} из {total.toLocaleString("ru-RU")}
      </span>
      <Button variant="outline" size="icon-sm" onClick={onNext} disabled={index >= total - 1}>
        <ChevronRightIcon /><span className="sr-only">Следующая запись</span>
      </Button>
    </div>
  )
}
