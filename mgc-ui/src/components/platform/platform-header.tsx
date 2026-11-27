import * as React from "react"
import { ArrowLeftIcon, PanelLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

/*
 * Шапка рабочей области — 64px, как AppBar.vue в текущих проектах.
 * Меню свёрнуто → слева кнопка его раскрытия. На внутренних страницах —
 * «На главную» + разделитель + заголовок. Справа — действия (версия, тема, помощь).
 */
export function PlatformHeader({
  title,
  onBack,
  actions,
}: {
  title: React.ReactNode
  onBack?: () => void
  actions?: React.ReactNode
}) {
  const { open, isMobile, toggleSidebar } = useSidebar()
  const showMenuButton = !open || isMobile

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background/90 pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur md:px-6">
      {showMenuButton && (
        <Button variant="outline" size="icon-lg" onClick={toggleSidebar}>
          <PanelLeftIcon />
          <span className="sr-only">Развернуть меню</span>
        </Button>
      )}
      {onBack && (
        <>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeftIcon data-icon="inline-start" />
            <span className="max-sm:sr-only">На главную</span>
          </Button>
          <Separator orientation="vertical" className="h-6 self-center!" />
        </>
      )}
      <h1 className="min-w-0 truncate text-lg font-medium">{title}</h1>
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </header>
  )
}
