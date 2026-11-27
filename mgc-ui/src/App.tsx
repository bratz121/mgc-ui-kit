import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon, MonitorIcon, MoonIcon, SearchIcon, SunIcon } from "lucide-react"

import { PlatformHeader } from "@/components/platform/platform-header"
import { PlatformSidebar } from "@/components/platform/platform-sidebar"
import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ChartsPage } from "@/showcase/pages/charts"
import { CardsPage, FeedbackPage, FormsPage, StatusesPage } from "@/showcase/pages/components"
import { AccentsPage } from "@/showcase/pages/accents"
import { AnalyticsPage } from "@/showcase/pages/analytics"
import { ButtonsPage } from "@/showcase/pages/buttons"
import { ControlsPage } from "@/showcase/pages/controls"
import { NavigationPage } from "@/showcase/pages/navigation"
import { ModuleSwitcher } from "@/components/platform/cross-nav"
import { useModule } from "@/components/platform/module-context"
import { DialogsPage } from "@/showcase/pages/dialogs"
import { DropdownsPage } from "@/showcase/pages/dropdowns"
import { ColorsPage, LogoPage, OverviewPage, TypographyPage } from "@/showcase/pages/foundations"
import { IconsPage } from "@/showcase/pages/icons"
import { MobileComponentsPage, MobileScreensPage } from "@/showcase/pages/mobile"
import { InputsPage, LayoutPage } from "@/showcase/pages/more"
import { TablesPage } from "@/showcase/pages/tables"
import { DashboardTemplate, RegistryTemplate } from "@/showcase/pages/templates"
import { WidgetsPage } from "@/showcase/pages/widgets"
import type { ShowcasePage } from "@/showcase/registry"

const PAGES: ShowcasePage[] = [
  { id: "overview", title: "Обзор", summary: "Что внутри кита и как им пользоваться", render: (go) => <OverviewPage go={go} pages={PAGES} /> },

  { id: "colors", title: "Цвета", group: "Основы", summary: "Палитра брендбука, семантические токены, статусы, графики", keywords: ["токены", "palette", "oklch", "тёмная тема"], render: () => <ColorsPage /> },
  { id: "typography", title: "Типографика", group: "Основы", summary: "IBM Plex Sans и Mono, шкала, цифры", keywords: ["шрифт", "font", "plex"], render: () => <TypographyPage /> },
  { id: "accents", title: "Акценты модулей", group: "Основы", summary: "Цвет каждого модуля из его логотипа — акцент интерфейса", keywords: ["module", "модуль", "акцент", "логотип", "data-module", "цвет модуля"], render: () => <AccentsPage /> },
  { id: "logo", title: "Логотип", group: "Основы", summary: "5 вариантов логотипа MGC GROUP", keywords: ["logo", "знак"], render: () => <LogoPage /> },
  { id: "icons", title: "Иконки", group: "Основы", summary: "Lucide: подборка для производства и поиск по 2000+", keywords: ["lucide", "icon"], render: () => <IconsPage /> },

  { id: "buttons", title: "Кнопки", group: "Компоненты", summary: "Форматы, составные, поведение, кнопки в формах", keywords: ["Button", "кнопка", "AsyncButton", "HoldButton", "split", "Toggle", "удержание"], render: () => <ButtonsPage /> },
  { id: "forms", title: "Формы и поля", group: "Компоненты", summary: "Field, Input, InputGroup, Textarea, ошибки", keywords: ["Field", "Input", "InputGroup", "Textarea", "валидация"], render: () => <FormsPage /> },
  { id: "inputs", title: "Специальный ввод", group: "Компоненты", summary: "Теги, даты, периоды, степпер, слайдер, PIN, файлы", keywords: ["TagInput", "DatePicker", "DateRangePicker", "Calendar", "календарь", "Slider", "InputOTP", "ButtonGroup", "теги", "дата"], render: () => <InputsPage /> },
  { id: "selection", title: "Выбор, под кат, OK/NOK", group: "Компоненты", summary: "Чекбоксы, радио, переключатели, «показать ещё», контроль ОК/НОК", keywords: ["Checkbox", "RadioGroup", "Switch", "ToggleGroup", "OkNok", "ОК", "НОК", "под кат", "ShowMoreList", "ExpandableText", "чек-лист", "контроль качества"], render: () => <ControlsPage /> },
  { id: "dropdowns", title: "Выпадающие списки", group: "Компоненты", summary: "Select, Combobox, NativeSelect, меню, палитра команд", keywords: ["Select", "Combobox", "NativeSelect", "DropdownMenu", "ContextMenu", "Command", "мультивыбор"], render: () => <DropdownsPage /> },
  { id: "statuses", title: "Статусы и бейджи", group: "Компоненты", summary: "StatusBadge, Badge, Alert", keywords: ["StatusBadge", "Badge", "Alert"], render: () => <StatusesPage /> },
  { id: "tables", title: "Таблицы", group: "Компоненты", summary: "DataTable: фильтры, сортировка, массовые действия, карточки на телефоне", keywords: ["DataTable", "Table", "TanStack", "пагинация", "сортировка"], render: () => <TablesPage /> },
  { id: "cards", title: "Карточки и KPI", group: "Компоненты", summary: "Card, StatCard", keywords: ["Card", "StatCard", "KPI"], render: () => <CardsPage /> },
  { id: "charts", title: "Диаграммы", group: "Компоненты", summary: "10 видов графиков, палитра проверена на дальтонизм", keywords: ["Chart", "ChartCard", "график", "bullet", "heatmap", "тепловая карта", "Recharts"], render: () => <ChartsPage /> },
  { id: "overlays", title: "Модальные окна", group: "Компоненты", summary: "Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip", keywords: ["Dialog", "AlertDialog", "Sheet", "Drawer", "Popover", "HoverCard", "Tooltip", "модалка", "диалог"], render: () => <DialogsPage /> },
  { id: "navigation", title: "Навигация", group: "Компоненты", summary: "Боковое меню, путь внутри приложения, переходы в смежные модули", keywords: ["Breadcrumb", "Pagination", "NavigationMenu", "Menubar", "ModuleSwitcher", "ModuleLink", "RelatedRecords", "RecordPager", "BackLink", "лаунчер", "смежные"], render: () => <NavigationPage /> },
  { id: "layout", title: "Раскладка и списки", group: "Компоненты", summary: "Accordion, Collapsible, Item, Resizable, Carousel", keywords: ["Accordion", "Collapsible", "Item", "Resizable", "Carousel", "AspectRatio", "Avatar", "Kbd"], render: () => <LayoutPage /> },
  { id: "analytics", title: "Аналитика", group: "Компоненты", summary: "Проваливание, масштаб, легенды, масштабируемость графиков", keywords: ["drill-down", "проваливание", "zoom", "масштаб", "Brush", "легенда", "InteractiveLegend", "круговая"], render: () => <AnalyticsPage /> },
  { id: "widgets", title: "Виджеты и перетаскивание", group: "Компоненты", summary: "Конструктор дашборда, канбан, сортируемый список", keywords: ["WidgetBoard", "KanbanBoard", "SortableList", "drag", "dnd", "перетаскивание", "канбан"], render: () => <WidgetsPage /> },
  { id: "feedback", title: "Обратная связь", group: "Компоненты", summary: "Toast, Progress, Skeleton, Spinner, Empty", keywords: ["toast", "sonner", "Progress", "Skeleton", "Spinner", "Empty", "уведомление"], render: () => <FeedbackPage /> },

  { id: "mobile-components", title: "Компоненты", group: "Мобильная версия", summary: "Шапка, нижнее меню, панель действий, FAB, клавиатура терминала", keywords: ["MobileHeader", "BottomNav", "ActionBar", "Fab", "Numpad", "мобильный", "телефон", "терминал"], render: () => <MobileComponentsPage /> },
  { id: "mobile-screens", title: "Экраны", group: "Мобильная версия", summary: "Заявки, сводка смены, простой, PIN, события", keywords: ["мобильный", "телефон", "экран"], render: () => <MobileScreensPage /> },

  { id: "tpl-dashboard", title: "Дашборд", group: "Шаблоны", summary: "Сводка по заводу", keywords: ["шаблон", "dashboard"], render: () => <DashboardTemplate /> },
  { id: "tpl-registry", title: "Реестр заявок", group: "Шаблоны", summary: "Список с фильтрами и массовыми действиями", keywords: ["шаблон", "реестр"], render: () => <RegistryTemplate /> },
]

function readHash() {
  const id = window.location.hash.slice(1)
  return PAGES.some((p) => p.id === id) ? id : "overview"
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
  const label = { light: "Светлая тема", dark: "Тёмная тема", system: "Как в системе" }[theme]
  const Icon = { light: SunIcon, dark: MoonIcon, system: MonitorIcon }[theme]
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon-lg" onClick={() => setTheme(next)} />}>
        <Icon />
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{label} · нажмите, чтобы сменить</TooltipContent>
    </Tooltip>
  )
}

function AppLauncher() {
  const { module, setModule } = useModule()
  return <ModuleSwitcher current={module === "uiKit" ? "platform" : module} onSelect={setModule} />
}

function SearchDialog({ open, onOpenChange, go }: { open: boolean; onOpenChange: (o: boolean) => void; go: (id: string) => void }) {
  const groups = Array.from(new Set(PAGES.map((p) => p.group ?? "Витрина")))
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Поиск по киту" description="Страницы и компоненты">
      <Command>
        <CommandInput placeholder="Компонент или раздел: Combobox, календарь, таблица…" />
        <CommandList className="max-h-[min(60svh,420px)]">
          <CommandEmpty>Ничего не нашлось. Попробуйте английское название компонента.</CommandEmpty>
          {groups.map((g) => (
            <CommandGroup key={g} heading={g}>
              {PAGES.filter((p) => (p.group ?? "Витрина") === g).map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.title} ${p.group ?? ""} ${p.summary} ${(p.keywords ?? []).join(" ")}`}
                  onSelect={() => {
                    onOpenChange(false)
                    go(p.id)
                  }}
                >
                  <FileTextIcon />
                  <div className="flex min-w-0 flex-col">
                    <span>{p.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{p.summary}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export function App() {
  const [pageId, setPageId] = React.useState(readHash)
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const onHash = () => setPageId(readHash())
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener("hashchange", onHash)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("hashchange", onHash)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  const go = React.useCallback((id: string) => {
    window.location.hash = id
    window.scrollTo({ top: 0 })
  }, [])

  const index = Math.max(0, PAGES.findIndex((p) => p.id === pageId))
  const page = PAGES[index]
  const prev = PAGES[index - 1]
  const next = PAGES[index + 1]

  const crumbs = (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {page.id !== "overview" && (
          <>
            <BreadcrumbItem className="max-md:hidden">
              <BreadcrumbLink href="#overview" onClick={(e) => { e.preventDefault(); go("overview") }}>UI-кит</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="max-md:hidden" />
            {page.group && (
              <>
                <BreadcrumbItem className="max-sm:hidden"><span>{page.group}</span></BreadcrumbItem>
                <BreadcrumbSeparator className="max-sm:hidden" />
              </>
            )}
          </>
        )}
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate text-base font-medium">{page.id === "overview" ? "UI-кит MGC" : page.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )

  return (
    <SidebarProvider style={{ "--sidebar-width": "22.5rem" } as React.CSSProperties}>
      <PlatformSidebar
        locationName="Площадка Липецк"
        currentModule="uiKit"
        modules={[
          { key: "andon", url: "#" },
          { key: "maintenance", url: "#" },
          { key: "plantReport", url: "#" },
          { key: "qrci", url: "#" },
          { key: "change", url: "#" },
          { key: "audits", url: "#" },
          { key: "uiKit" },
        ]}
        pages={PAGES}
        activePageId={page.id}
        onNavigate={go}
        onHome={() => go("overview")}
        user={{ login: "p.zheludkov", sessionRemaining: "07:42:15" }}
      />
      <SidebarInset className="min-w-0">
        <PlatformHeader
          title={crumbs}
          actions={
            <>
              <Button variant="outline" className="w-56 justify-between text-muted-foreground max-lg:hidden" onClick={() => setSearchOpen(true)}>
                <span className="flex items-center gap-2"><SearchIcon />Поиск по киту</span>
                <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
              </Button>
              <Button variant="outline" size="icon-lg" className="lg:hidden" onClick={() => setSearchOpen(true)}>
                <SearchIcon /><span className="sr-only">Поиск по киту</span>
              </Button>
              <AppLauncher />
              <Badge variant="outline" className="font-mono max-md:hidden">v0.3.0</Badge>
              <ThemeToggle />
            </>
          }
        />
        <main key={page.id} className="flex flex-1 flex-col animate-in duration-200 fade-in">
          {page.render(go)}
          {(prev || next) && (
            <nav aria-label="Соседние страницы" className="mx-auto mt-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-4 pb-10 md:px-8">
              {prev ? (
                <a href={`#${prev.id}`} onClick={(e) => { e.preventDefault(); go(prev.id) }} className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/30">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeftIcon className="size-3.5" />Назад</span>
                  <span className="truncate font-medium">{prev.title}</span>
                </a>
              ) : <span />}
              {next && (
                <a href={`#${next.id}`} onClick={(e) => { e.preventDefault(); go(next.id) }} className="flex min-w-0 flex-col items-end gap-1 rounded-xl border bg-card p-4 text-right transition-colors hover:border-foreground/30">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">Далее<ArrowRightIcon className="size-3.5" /></span>
                  <span className="max-w-full truncate font-medium">{next.title}</span>
                </a>
              )}
            </nav>
          )}
        </main>
      </SidebarInset>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} go={go} />
    </SidebarProvider>
  )
}

export default App
