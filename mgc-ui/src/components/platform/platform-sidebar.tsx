import * as React from "react"
import { ChevronDownIcon, LogOutIcon, PanelLeftIcon } from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import pkMarkDark from "@/assets/platform/logo-pk-mark-dark.png"
import pkMarkWhite from "@/assets/platform/logo-pk-mark-white.png"
import { PLATFORM_MODULES, type PlatformModuleKey } from "./modules"

/*
 * Боковое меню платформы «Производственный контур».
 * Повторяет структуру SideBar.vue из текущих проектов:
 *   шапка (знак ПК + название + свернуть) →
 *   площадка (заголовок капсом) → плитки модулей →
 *   у текущего модуля раскрываются его разделы (активный — красная полоса слева) →
 *   внизу пользователь, таймер сессии и выход.
 * Спецификация: docs/04-patterns.md → «Каркас приложения».
 */

export type PlatformPage = {
  id: string
  title: string
  /** Необязательная подпись-группа над пунктом (например, «Компоненты»). */
  group?: string
}

export type PlatformSidebarProps = {
  platformTitle?: string
  locationName: string
  /** Модули площадки в порядке показа; пустой url — модуль скрыт (кроме текущего). */
  modules: { key: PlatformModuleKey; url?: string }[]
  currentModule: PlatformModuleKey
  pages: PlatformPage[]
  activePageId: string
  onNavigate: (pageId: string) => void
  onHome?: () => void
  user: { login: string; sessionRemaining?: string | null }
  onLogout?: () => void
}

/** Плитка модуля: иконка из pc_ui_kit или (если её нет) серый квадрат с цветным «слешем» логотипа. */
export function ModuleTile({ moduleKey, className }: { moduleKey: PlatformModuleKey; className?: string }) {
  const m = PLATFORM_MODULES[moduleKey]
  if (!m.icon) {
    return (
      <span aria-hidden className={cn("flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#dee2e6] dark:bg-[#495057]", className)}>
        <svg viewBox="0 0 16 16" className="size-4"><path d="M10 2h4L6 14H2z" fill={m.accent} /></svg>
      </span>
    )
  }
  return (
    <span className={cn("flex size-8 shrink-0 items-center justify-center", className)}>
      <img src={m.icon} alt="" className="size-8 dark:hidden" />
      <img src={m.iconDark} alt="" className="hidden size-8 dark:block" />
    </span>
  )
}

function initialsOf(login: string) {
  const parts = login.split(/[\s._-]+/).filter(Boolean)
  if (!parts.length) return "ПК"
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

export function PlatformSidebar({
  platformTitle = "Производственный контур",
  locationName,
  modules,
  currentModule,
  pages,
  activePageId,
  onNavigate,
  onHome,
  user,
  onLogout,
}: PlatformSidebarProps) {
  const { toggleSidebar } = useSidebar()
  const [pagesOpen, setPagesOpen] = React.useState(true)

  // Группы разделов сворачиваются; группа активной страницы всегда раскрыта.
  const activeGroup = pages.find((p) => p.id === activePageId)?.group
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(
    () => new Set(activeGroup ? [activeGroup] : [])
  )
  const [prevActiveGroup, setPrevActiveGroup] = React.useState(activeGroup)
  if (activeGroup !== prevActiveGroup) {
    setPrevActiveGroup(activeGroup)
    if (activeGroup && !openGroups.has(activeGroup)) setOpenGroups(new Set(openGroups).add(activeGroup))
  }
  const toggleGroup = (g: string) =>
    setOpenGroups((s) => {
      const n = new Set(s)
      if (n.has(g)) n.delete(g)
      else n.add(g)
      return n
    })

  const visible = modules.filter((m) => m.key === currentModule || m.url)

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="h-16 flex-row items-center justify-between gap-2 border-b border-sidebar-border px-4 py-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onHome?.()
          }}
          className="flex min-w-0 items-center gap-2.5 text-sidebar-foreground"
          title="На начальную страницу"
        >
          <img src={pkMarkDark} alt="ПК" className="size-8 dark:hidden" />
          <img src={pkMarkWhite} alt="ПК" className="hidden size-8 dark:block" />
          <span className="truncate text-lg leading-tight">{platformTitle}</span>
        </a>
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="icon-lg" onClick={toggleSidebar} />}
          >
            <PanelLeftIcon />
            <span className="sr-only">Свернуть меню</span>
          </TooltipTrigger>
          <TooltipContent side="right">Свернуть меню</TooltipContent>
        </Tooltip>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-auto px-2 pb-1.5 text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase">
            {locationName}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {visible.map(({ key, url }) => {
              const m = PLATFORM_MODULES[key]
              if (key !== currentModule) {
                return (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      className="h-auto min-h-[46px] gap-2.5 text-base text-muted-foreground"
                      render={<a href={url} target="_blank" rel="noopener noreferrer" />}
                    >
                      <ModuleTile moduleKey={key} />
                      <span>{m.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }

              // Текущий модуль: подложка + стрелка, под ней разделы.
              return (
                <SidebarMenuItem key={key} className="my-0.5 rounded-lg bg-sidebar-accent">
                  <div className="flex items-center">
                    <SidebarMenuButton
                      className="h-auto min-h-[46px] flex-1 gap-2.5 text-base hover:bg-transparent"
                      onClick={() => onHome?.()}
                    >
                      <ModuleTile moduleKey={key} />
                      <span>{m.name}</span>
                    </SidebarMenuButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-1.5 text-muted-foreground"
                      aria-expanded={pagesOpen}
                      onClick={() => setPagesOpen((v) => !v)}
                    >
                      <ChevronDownIcon
                        className={cn("transition-transform", pagesOpen && "rotate-180")}
                      />
                      <span className="sr-only">
                        {pagesOpen ? "Свернуть разделы" : "Показать разделы"}
                      </span>
                    </Button>
                  </div>
                  {pagesOpen && (
                    <SidebarMenuSub className="mx-0 translate-x-0 gap-0 border-l-0 px-0 pt-0.5 pb-2">
                      {pages.map((page, i) => {
                        const showGroup = page.group && page.group !== pages[i - 1]?.group
                        const active = page.id === activePageId
                        const groupOpen = !page.group || openGroups.has(page.group)
                        const groupCount = page.group ? pages.filter((p) => p.group === page.group).length : 0
                        return (
                          <React.Fragment key={page.id}>
                            {showGroup && (
                              <li>
                                <button
                                  type="button"
                                  aria-expanded={groupOpen}
                                  onClick={() => toggleGroup(page.group!)}
                                  className="flex w-full items-center gap-1.5 pt-3 pr-4 pb-1 pl-[50px] text-left text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase outline-none hover:text-sidebar-foreground focus-visible:text-sidebar-foreground"
                                >
                                  <span className="flex-1">{page.group}</span>
                                  {!groupOpen && (
                                    <span className="font-mono text-[11px] font-normal tracking-normal tabular-nums">{groupCount}</span>
                                  )}
                                  <ChevronDownIcon className={cn("size-3.5 transition-transform duration-200", groupOpen && "rotate-180")} />
                                </button>
                              </li>
                            )}
                            {groupOpen && (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                isActive={active}
                                href={`#${page.id}`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  onNavigate(page.id)
                                }}
                                className={cn(
                                  "relative h-auto rounded-none py-2.5 pr-4 pl-[50px] text-[15px] text-muted-foreground hover:bg-transparent hover:text-sidebar-foreground data-active:bg-transparent data-active:text-sidebar-foreground",
                                  "data-active:before:absolute data-active:before:inset-y-1.5 data-active:before:left-0 data-active:before:w-[3px] data-active:before:rounded-r-xs data-active:before:bg-sidebar-primary"
                                )}
                              >
                                {page.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex-row items-center gap-2.5 border-t border-sidebar-border px-4 py-3.5">
        <Avatar className="size-10">
          <AvatarFallback className="bg-module-soft text-sm font-semibold text-module-strong">
            {initialsOf(user.login)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 leading-snug">
          <div className="truncate text-sm">{user.login || "Пользователь"}</div>
          {user.sessionRemaining && (
            <div className="text-[13px] text-muted-foreground tabular-nums">
              Сессия: {user.sessionRemaining}
            </div>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="outline" size="icon-lg" onClick={onLogout} />}
          >
            <LogOutIcon />
            <span className="sr-only">Выйти из аккаунта</span>
          </TooltipTrigger>
          <TooltipContent>Выйти из аккаунта</TooltipContent>
        </Tooltip>
      </SidebarFooter>
    </Sidebar>
  )
}
