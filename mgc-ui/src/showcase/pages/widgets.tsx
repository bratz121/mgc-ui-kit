import * as React from "react"
import {
  CheckIcon,
  GripVerticalIcon,
  AlertTriangleIcon,
  ClockIcon,
  LayoutGridIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { KanbanBoard, SortableList, WidgetBoard, type WidgetItem, type WidgetSize } from "@/components/mgc/dnd"
import { StatCard } from "@/components/mgc/stat-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"
import { REQUESTS } from "../data"
import { OeeChart, OutputChart } from "./charts"
import { PriorityCell, RecentRequests } from "./tables"

/* ── Библиотека виджетов ── */

type WidgetDef = { title: string; description: string; defaultSize: WidgetSize; render: () => React.ReactNode; bare?: boolean }

const LIBRARY: Record<string, WidgetDef> = {
  "kpi-output": { title: "Выпуск за смену", description: "KPI, шт", defaultSize: 1, bare: true, render: () => <StatCard label="Выпуск за смену" value="1 248" unit="шт" delta={4.2} className="h-full" /> },
  "kpi-oee": { title: "OEE завода", description: "KPI, %", defaultSize: 1, bare: true, render: () => <StatCard label="OEE завода" value="78,4" unit="%" delta={1.3} className="h-full" /> },
  "kpi-downtime": { title: "Простои", description: "KPI, мин", defaultSize: 1, bare: true, render: () => <StatCard label="Простои" value="47" unit="мин" delta={12} higherIsBetter={false} className="h-full" /> },
  "chart-output": { title: "Выпуск: план и факт", description: "Неделя, шт", defaultSize: 2, render: () => <OutputChart /> },
  "chart-oee": { title: "OEE по участкам", description: "14 дней, %", defaultSize: 2, render: () => <OeeChart height="h-56" /> },
  lines: {
    title: "Участки",
    description: "OEE за смену",
    defaultSize: 1,
    render: () => (
      <div className="flex flex-col gap-4">
        {[["Линия №1", 82], ["Линия №2", 71], ["Сварка", 54], ["Окраска", 88]].map(([n, v]) => (
          <div key={n as string} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm"><span>{n}</span><span className="tabular-nums">{v}%</span></div>
            <Progress value={v as number} />
          </div>
        ))}
      </div>
    ),
  },
  requests: { title: "Последние заявки", description: "Техобслуживание", defaultSize: 2, render: () => <div className="-mx-4 -mb-4"><RecentRequests rows={REQUESTS.slice(0, 5)} /></div> },
  alerts: {
    title: "Критичные события",
    description: "Сейчас",
    defaultSize: 1,
    render: () => (
      <Alert variant="critical"><AlertTriangleIcon /><AlertTitle>Сварка: остановка</AlertTitle><AlertDescription>Робот РС-07 · 14 мин</AlertDescription></Alert>
    ),
  },
}

const DEFAULT_LAYOUT: WidgetItem[] = [
  { id: "w1", type: "kpi-output", size: 1 },
  { id: "w2", type: "kpi-oee", size: 1 },
  { id: "w3", type: "kpi-downtime", size: 1 },
  { id: "w4", type: "chart-output", size: 2 },
  { id: "w5", type: "lines", size: 1 },
  { id: "w6", type: "requests", size: 3 },
]

const STORAGE_KEY = "mgc-ui:dashboard-layout"

function loadLayout(): WidgetItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as WidgetItem[]) : null
    return parsed?.every((w) => LIBRARY[w.type]) ? parsed : DEFAULT_LAYOUT
  } catch {
    return DEFAULT_LAYOUT
  }
}

function saveLayout(items: WidgetItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* хранилище недоступно — раскладка живёт до перезагрузки */
  }
}

const SIZE_LABEL: Record<WidgetSize, string> = { 1: "Узкий · 1/3", 2: "Широкий · 2/3", 3: "Во всю ширину" }

function DashboardBuilder() {
  const [items, setItemsState] = React.useState<WidgetItem[]>(loadLayout)
  const [editing, setEditing] = React.useState(false)
  const setItems = (next: WidgetItem[]) => {
    setItemsState(next)
    saveLayout(next)
  }

  const widgetMenu = (it: WidgetItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontalIcon />
        <span className="sr-only">Настройки виджета «{LIBRARY[it.type].title}»</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ширина</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={String(it.size)}
            onValueChange={(v) => setItems(items.map((w) => (w.id === it.id ? { ...w, size: Number(v) as WidgetSize } : w)))}
          >
            {([1, 2, 3] as WidgetSize[]).map((s) => <DropdownMenuRadioItem key={s} value={String(s)}>{SIZE_LABEL[s]}</DropdownMenuRadioItem>)}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => setItems(items.filter((w) => w.id !== it.id))}>
            <Trash2Icon />Убрать с дашборда
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderWidget = (it: WidgetItem, handle: React.ReactNode) => {
    const def = LIBRARY[it.type]
    if (def.bare) {
      return (
        <div className="relative h-full">
          {def.render()}
          {editing && <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded-lg bg-card/90 backdrop-blur">{handle}{widgetMenu(it)}</div>}
        </div>
      )
    }
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{def.title}</CardTitle>
          <CardDescription>{def.description}</CardDescription>
          {editing && <CardAction className="flex items-center gap-0.5">{handle}{widgetMenu(it)}</CardAction>}
        </CardHeader>
        <CardContent className="min-w-0">{def.render()}</CardContent>
      </Card>
    )
  }

  const available = Object.entries(LIBRARY)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {editing ? (
          <>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}><PlusIcon data-icon="inline-start" />Добавить виджет</SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Библиотека виджетов</SheetTitle>
                  <SheetDescription>Виджет добавится в конец дашборда — потом перетащите его на место.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 overflow-y-auto px-4 pb-4">
                  {available.map(([type, def]) => {
                    const count = items.filter((w) => w.type === type).length
                    return (
                      <Item key={type} variant="outline" size="sm">
                        <ItemContent>
                          <ItemTitle>{def.title}</ItemTitle>
                          <ItemDescription>{def.description} · {SIZE_LABEL[def.defaultSize]}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          {count > 0 && <Badge variant="secondary">на дашборде</Badge>}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setItems([...items, { id: `w${Date.now()}`, type, size: def.defaultSize }])
                              toast.success(`Добавлен виджет «${def.title}»`)
                            }}
                          >
                            <PlusIcon data-icon="inline-start" />Добавить
                          </Button>
                        </ItemActions>
                      </Item>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" onClick={() => setItems(DEFAULT_LAYOUT)}><RotateCcwIcon data-icon="inline-start" />Сбросить</Button>
            <span className="flex items-center gap-1 text-sm text-muted-foreground max-md:hidden">Тяните за <GripVerticalIcon className="size-4" /> или нажмите на ручку и двигайте стрелками</span>
            <Button className="ml-auto" onClick={() => setEditing(false)}><CheckIcon data-icon="inline-start" />Готово</Button>
          </>
        ) : (
          <Button variant="outline" className="ml-auto" onClick={() => setEditing(true)}><LayoutGridIcon data-icon="inline-start" />Настроить дашборд</Button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          На дашборде нет виджетов.
          <Button variant="outline" onClick={() => { setEditing(true); setItems(DEFAULT_LAYOUT) }}>Вернуть стандартный набор</Button>
        </div>
      ) : (
        <WidgetBoard items={items} onChange={setItems} editing={editing} getLabel={(w) => LIBRARY[w.type].title} renderWidget={renderWidget} />
      )}
    </div>
  )
}

/* ── Канбан ── */

type KanbanRequest = (typeof REQUESTS)[number] & { column: string }

function RequestsKanban() {
  const [items, setItems] = React.useState<KanbanRequest[]>(() =>
    REQUESTS.slice(0, 14).map((r) => ({
      ...r,
      column: r.status === "cancelled" || r.status === "stopped" ? "new" : r.status,
    }))
  )
  const columns = [
    { id: "new", title: "Новые", accent: "var(--info)" },
    { id: "in_progress", title: "В работе", accent: "var(--warning)" },
    { id: "waiting", title: "Ожидание", accent: "var(--muted-foreground)" },
    { id: "done", title: "Выполнены", accent: "var(--success)" },
  ]
  return (
    <KanbanBoard
      columns={columns}
      items={items}
      onChange={setItems}
      getLabel={(r) => `${r.id} ${r.equipment}`}
      renderCard={(r, handle) => (
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
            {handle}
          </div>
          <span className="font-medium">{r.equipment} <span className="font-mono text-xs font-normal text-muted-foreground">{r.code}</span></span>
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <PriorityCell p={r.priority} />
            <span className="flex items-center gap-1 tabular-nums"><ClockIcon className="size-3.5" />{r.downtime} мин</span>
          </div>
        </div>
      )}
    />
  )
}

/* ── Сортируемый список ── */

function OperationsList() {
  const [ops, setOps] = React.useState(
    [
      "Остановить пресс, LOTO-блокировка",
      "Сбросить давление до 0 бар",
      "Снять крышку гидроцилиндра",
      "Заменить уплотнитель РК-114",
      "Собрать, затянуть М12 моментом 85 Н·м",
      "Пробный пуск, 5 холостых ходов",
    ].map((t, i) => ({ id: `op${i}`, title: t, done: i < 2 }))
  )
  return (
    <SortableList
      items={ops}
      onChange={setOps}
      getLabel={(o) => o.title}
      className="max-w-2xl"
      renderItem={(o, i) => (
        <>
          <span className="w-6 text-right font-mono text-xs text-muted-foreground tabular-nums">{i + 1}.</span>
          <Checkbox
            checked={o.done}
            onCheckedChange={(v) => setOps((xs) => xs.map((x) => (x.id === o.id ? { ...x, done: !!v } : x)))}
            aria-label={`Выполнено: ${o.title}`}
          />
          <span className={o.done ? "flex-1 text-muted-foreground line-through" : "flex-1"}>{o.title}</span>
        </>
      )}
    />
  )
}

/* ── Страница ── */

export function WidgetsPage() {
  return (
    <DocPage
      title="Виджеты и перетаскивание"
      lead="Пользователь сам собирает свой дашборд: переставляет виджеты, меняет ширину, добавляет из библиотеки. Раскладка сохраняется. Перетаскивание работает мышью, касанием (долгое нажатие) и с клавиатуры."
    >
      <DocSection title="Конструктор дашборда" description="Нажмите «Настроить дашборд». Тяните виджет за ручку, ширину и удаление — в меню «⋯». Раскладка запоминается в браузере.">
        <DashboardBuilder />
      </DocSection>

      <DocSection title="Канбан заявок" description="Перетаскивание карточки между колонками меняет её статус. На телефоне колонки листаются горизонтально с прилипанием.">
        <RequestsKanban />
      </DocSection>

      <DocSection title="Сортируемый список" description="Порядок операций, приоритеты, шаги чек-листа. Номер пересчитывается сам.">
        <Example className="block" code={`<SortableList
  items={ops}
  onChange={setOps}
  getLabel={(o) => o.title}
  renderItem={(o, i) => <>{i + 1}. {o.title}</>}
/>`}>
          <OperationsList />
        </Example>
      </DocSection>

      <DocSection title="API">
        <PropsTable
          rows={[
            { name: "WidgetBoard", values: "items, onChange, editing, getLabel, renderWidget(item, handle)", note: "Сетка 3 колонки (2 на планшете, 1 на телефоне). size: 1 | 2 | 3 — ширина в колонках" },
            { name: "KanbanBoard", values: "columns, items (с полем column), onChange, renderCard(item, handle)", note: "Перенос между колонками и внутри колонки" },
            { name: "SortableList", values: "items, onChange, getLabel, renderItem(item, index)", note: "Вертикальный список с ручками" },
            { name: "DragHandle", values: "listeners, attributes, label", note: "Ручка 32px (44px на тач-экране). Перетаскивание только за неё — клики внутри виджета работают" },
            { name: "Клавиатура", values: "Пробел / стрелки / Пробел / Esc", note: "Взять, двигать, положить, отменить. Объявления для экранного диктора — на русском" },
          ]}
        />
      </DocSection>

      <Rules
        do={[
          "Перетаскивание — только за явную ручку, режим настройки включается кнопкой.",
          "Всегда дублируйте перенос другим способом: меню «Переместить в…», статус в карточке.",
          "Сохраняйте раскладку пользователя и давайте «Сбросить».",
          "На тач-экране — долгое нажатие, чтобы не мешать прокрутке.",
        ]}
        dont={[
          "Не делайте перетаскиваемым весь виджет — пользователь не сможет кликнуть по графику.",
          "Не используйте перетаскивание как единственный способ сменить статус.",
          "Не пересобирайте раскладку автоматически — пользователь должен находить виджет на том же месте.",
        ]}
      />
    </DocPage>
  )
}
