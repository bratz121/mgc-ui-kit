import * as React from "react"
import {
  AlertTriangleIcon,
  BellIcon,
  CalendarClockIcon,
  CheckCheckIcon,
  ClipboardListIcon,
  ClockIcon,
  FactoryIcon,
  FilterIcon,
  HouseIcon,
  OctagonXIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "cn"

import { Logo } from "@/components/brand/logo"
import { DatePicker } from "@/components/mgc/date-picker"
import { StatusBadge, STATUS_LIST } from "@/components/mgc/status-badge"
import { TagInput } from "@/components/mgc/tag-input"
import {
  ActionBar,
  BottomNav,
  ChipScroller,
  Fab,
  MobileHeader,
  MobileSection,
  Numpad,
  type BottomNavItem,
} from "@/components/mobile/mobile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"
import { PRIORITY_LABEL, REQUESTS, type Request } from "../data"
import { PriorityCell } from "./tables"

/* ── Рамка телефона (только витрина) ──
   На десктопе — корпус 390×780; на настоящем телефоне — экран без корпуса. */
function Phone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="flex w-full min-w-0 flex-col items-center gap-3">
      <div className="relative w-full max-w-[390px] overflow-hidden rounded-2xl border bg-background shadow-sm md:rounded-[2.75rem] md:border-[10px] md:border-[oklch(0.2_0_0)] md:shadow-[0_24px_48px_-24px_oklch(0_0_0/0.45)] dark:md:border-[oklch(0.32_0_0)]">
        <div className="flex h-[720px] flex-col overflow-y-auto md:h-[760px] [&>*]:shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
      <figcaption className="text-sm text-muted-foreground">{label}</figcaption>
    </figure>
  )
}

const NAV: BottomNavItem[] = [
  { id: "home", label: "Сводка", icon: HouseIcon },
  { id: "requests", label: "Заявки", icon: ClipboardListIcon, badge: 12 },
  { id: "plan", label: "План ТО", icon: CalendarClockIcon },
  { id: "alerts", label: "События", icon: BellIcon, badge: 3 },
  { id: "me", label: "Профиль", icon: UserIcon },
]

/* ─────────────────────────── Экраны ─────────────────────────── */

function RequestRow({ r, onClick }: { r: Request; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full flex-col gap-2 border-b px-4 py-3.5 text-left outline-none transition-colors last:border-b-0 focus-visible:bg-muted active:bg-muted">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
        <StatusBadge status={r.status} />
      </div>
      <div className="font-medium">{r.equipment} <span className="font-mono text-xs font-normal text-muted-foreground">{r.code}</span></div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <PriorityCell p={r.priority} />
        <span className="flex items-center gap-1 tabular-nums"><ClockIcon className="size-3.5" />{r.downtime} мин</span>
      </div>
    </button>
  )
}

function RequestsApp() {
  const [tab, setTab] = React.useState("requests")
  const [filter, setFilter] = React.useState("all")
  const [open, setOpen] = React.useState<Request | null>(null)
  const list = REQUESTS.slice(0, 24).filter((r) => filter === "all" || r.status === filter)
  const count = (k: string) => REQUESTS.slice(0, 24).filter((r) => r.status === k).length

  if (open) {
    return (
      <>
        <MobileHeader title={<span className="font-mono">{open.id}</span>} subtitle={open.area} onBack={() => setOpen(null)} />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-3 px-4 py-4">
            <StatusBadge status={open.status} />
            <h2 className="text-xl font-semibold">{open.equipment}</h2>
            <span className="font-mono text-sm text-muted-foreground">{open.code}</span>
          </div>
          {open.priority === "critical" && (
            <div className="px-4 pb-3">
              <Alert variant="critical"><OctagonXIcon /><AlertTitle>Линия стоит</AlertTitle><AlertDescription>Простой {open.downtime} мин. Мастер смены уведомлён.</AlertDescription></Alert>
            </div>
          )}
          <MobileSection title="Детали">
            <dl className="mx-4 divide-y rounded-xl border bg-card text-sm">
              {[
                ["Приоритет", PRIORITY_LABEL[open.priority]],
                ["Простой", `${open.downtime} мин`],
                ["Исполнитель", open.assignee],
                ["Создана", open.created],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right tabular-nums">{v}</dd></div>
              ))}
            </dl>
          </MobileSection>
          <MobileSection title="Ход работ">
            <ol className="mx-4 flex flex-col gap-3 text-sm">
              {[["Заявка создана", "08:14", true], ["Назначен исполнитель", "08:20", true], ["Работы начаты", "08:31", true], ["Работы завершены", "—", false]].map(([t, time, done]) => (
                <li key={t as string} className="flex items-center gap-3">
                  <span className={cn("size-2.5 rounded-full", done ? "bg-foreground" : "border-2 border-muted-foreground/50")} />
                  <span className={cn("flex-1", !done && "text-muted-foreground")}>{t}</span>
                  <span className="text-muted-foreground tabular-nums">{time}</span>
                </li>
              ))}
            </ol>
          </MobileSection>
          <div className="flex-1" />
        </div>
        <ActionBar>
          <Button variant="outline" size="lg">Назначить</Button>
          <Drawer>
            <DrawerTrigger render={<Button size="lg" />}>Закрыть заявку</DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle>Закрыть заявку</DrawerTitle>
                  <DrawerDescription>{open.id} · {open.equipment}</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-2 px-4">
                  {["Устранено", "Устранено частично", "Не подтвердилась"].map((x) => (
                    <Button key={x} variant="outline" size="lg" className="h-12 justify-start" onClick={() => toast.success(`Заявка закрыта: ${x.toLowerCase()}`)}>{x}</Button>
                  ))}
                </div>
                <DrawerFooter><DrawerClose render={<Button variant="ghost" size="lg" />}>Отмена</DrawerClose></DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </ActionBar>
      </>
    )
  }

  return (
    <>
      <MobileHeader
        title="Заявки"
        subtitle="Линия сборки №1 · 2 смена"
        actions={
          <>
            <Button variant="ghost" size="icon-lg" className="size-11"><SearchIcon /><span className="sr-only">Поиск</span></Button>
            <Button variant="ghost" size="icon-lg" className="size-11"><FilterIcon /><span className="sr-only">Фильтры</span></Button>
          </>
        }
      />
      <ChipScroller
        value={filter}
        onChange={setFilter}
        options={[{ value: "all", label: "Все", count: 24 }, ...STATUS_LIST.filter((s) => count(s.key)).map((s) => ({ value: s.key, label: s.label, count: count(s.key) }))]}
      />
      <div className="flex-1">
        {list.map((r) => <RequestRow key={r.id} r={r} onClick={() => setOpen(r)} />)}
        <div className="h-20" />
      </div>
      <Fab icon={PlusIcon} label="Новая заявка" extended onClick={() => toast("Новая заявка")} />
      <BottomNav items={NAV} value={tab} onChange={setTab} />
    </>
  )
}

function ShiftDashboard() {
  const [tab, setTab] = React.useState("home")
  return (
    <>
      <MobileHeader title="Смена 2 · 16:00–00:00" subtitle="Мастер: Ким Д. А." actions={<Button variant="ghost" size="icon-lg" className="size-11"><BellIcon /><span className="sr-only">Уведомления</span></Button>} />
      <div className="flex flex-1 flex-col gap-3 py-3">
        <div className="px-4">
          <Alert variant="critical"><AlertTriangleIcon /><AlertTitle>Сварка: остановка 14 мин</AlertTitle><AlertDescription>Робот РС-07, заявка ЗН-2026-00480</AlertDescription></Alert>
        </div>
        <div className="grid grid-cols-2 gap-2 px-4">
          {[["Выпуск", "1 248", "шт", "+4,2%", true], ["OEE", "78,4", "%", "+1,3%", true], ["Простои", "47", "мин", "+12%", false], ["Брак", "0,8", "%", "−0,3%", true]].map(([l, v, u, d, good]) => (
            <div key={l as string} className="flex flex-col gap-1 rounded-xl border bg-card p-3">
              <span className="text-xs text-muted-foreground">{l}</span>
              <span className="text-2xl font-semibold tabular-nums">{v}<span className="ml-1 text-xs font-normal text-muted-foreground">{u}</span></span>
              <span className={cn("text-xs tabular-nums", good ? "text-success" : "text-destructive")}>{d}</span>
            </div>
          ))}
        </div>
        <MobileSection title="Участки · OEE">
          <div className="mx-4 flex flex-col gap-4 rounded-xl border bg-card p-4">
            {[["Линия №1", 82], ["Линия №2", 71], ["Сварка", 54], ["Окраска", 88]].map(([n, v]) => (
              <div key={n as string} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm"><span>{n}</span><span className="tabular-nums">{v}%</span></div>
                <Progress value={v as number} />
              </div>
            ))}
          </div>
        </MobileSection>
      </div>
      <BottomNav items={NAV} value={tab} onChange={setTab} />
    </>
  )
}

function DowntimeForm() {
  const [reason, setReason] = React.useState("Поломка")
  const [tags, setTags] = React.useState<string[]>(["гидравлика"])
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 10, 27))
  return (
    <>
      <MobileHeader title="Фиксация простоя" subtitle="Линия сборки №1" onBack={() => {}} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-4">
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-destructive-soft py-5 text-destructive">
          <span className="text-xs font-medium tracking-[0.06em] uppercase">Простой идёт</span>
          <span className="font-mono text-5xl font-medium tabular-nums">06:42</span>
          <span className="text-xs">с 14:18</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Причина</span>
          <div className="grid grid-cols-2 gap-2">
            {["Поломка", "Наладка", "Нет комплектующих", "Нет персонала"].map((x) => (
              <button key={x} type="button" aria-pressed={reason === x} onClick={() => setReason(x)}
                className="min-h-14 rounded-xl border bg-card px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground">
                {x}
              </button>
            ))}
          </div>
        </div>
        <Field>
          <FieldLabel htmlFor="m-date">Дата</FieldLabel>
          <DatePicker id="m-date" value={date} onChange={setDate} className="sm:w-full" />
        </Field>
        <Field>
          <FieldLabel htmlFor="m-tags">Теги</FieldLabel>
          <TagInput id="m-tags" value={tags} onChange={setTags} placeholder="Добавьте тег" />
        </Field>
        <Field>
          <FieldLabel htmlFor="m-comment">Комментарий</FieldLabel>
          <Textarea id="m-comment" rows={3} placeholder="Что произошло" />
        </Field>
      </div>
      <ActionBar>
        <Button variant="outline" size="lg">Отмена</Button>
        <Button size="lg" onClick={() => toast.success("Простой зафиксирован", { description: reason })}>Зафиксировать</Button>
      </ActionBar>
    </>
  )
}

function PinLogin() {
  const [pin, setPin] = React.useState("")
  const submit = () => {
    if (pin.length < 4) {
      toast.error("Введите 4 цифры PIN")
      return
    }
    toast.success("Вход выполнен", { description: "Иванов А. С. · наладчик" })
    setPin("")
  }
  return (
    <div className="flex flex-1 flex-col justify-between gap-6 px-6 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo variant="mark" className="h-10 text-brand" />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Терминал участка</h2>
          <p className="text-sm text-muted-foreground">Сварочный участок · пост 2</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="text-sm text-muted-foreground">Табельный PIN</span>
        <div className="flex gap-4" aria-label={`Введено ${pin.length} из 4`}>
          {[0, 1, 2, 3].map((i) => <span key={i} className={cn("size-4 rounded-full border-2 border-foreground transition-colors", i < pin.length && "bg-foreground")} />)}
        </div>
      </div>
      <Numpad onDigit={(d) => setPin((p) => (p.length < 4 ? p + d : p))} onBackspace={() => setPin((p) => p.slice(0, -1))} onSubmit={submit} />
    </div>
  )
}

function Notifications() {
  const [read, setRead] = React.useState(false)
  const items = [
    { icon: OctagonXIcon, tone: "text-destructive bg-destructive-soft", title: "Остановка: сварочный участок", text: "Робот РС-07 · 14 мин", time: "14:32" },
    { icon: WrenchIcon, tone: "text-info bg-info-soft", title: "Вам назначена заявка", text: "ЗН-2026-00481 · Пресс ПР-114", time: "14:20" },
    { icon: CalendarClockIcon, tone: "text-warning bg-warning-soft", title: "ТО через 2 дня", text: "Камера окрасочная КО-03", time: "11:05" },
    { icon: CheckCheckIcon, tone: "text-success bg-success-soft", title: "Заявка закрыта", text: "ЗН-2026-00477 · Гайковёрт ГМ-41", time: "Вчера" },
    { icon: FactoryIcon, tone: "text-muted-foreground bg-muted", title: "План смены выполнен", text: "Линия №1 · 1 248 из 1 200", time: "Вчера" },
  ]
  return (
    <>
      <MobileHeader title="События" actions={<Button variant="ghost" size="sm" className="mr-2" onClick={() => setRead(true)}>Прочитать все</Button>} />
      <div className="flex-1">
        {items.map((n, i) => (
          <div key={n.title} className="flex gap-3 border-b px-4 py-3.5">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", n.tone)}><n.icon className="size-5" /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-start justify-between gap-2">
                <span className={cn("text-sm", !read && i < 3 && "font-semibold")}>{n.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{n.time}</span>
              </div>
              <span className="truncate text-sm text-muted-foreground">{n.text}</span>
            </div>
            {!read && i < 3 && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" aria-label="Не прочитано" />}
          </div>
        ))}
      </div>
      <BottomNav items={NAV} value="alerts" onChange={() => {}} />
    </>
  )
}

/* ─────────────────────────── Страницы ─────────────────────────── */

export function MobileScreensPage() {
  return (
    <DocPage
      title="Мобильные экраны"
      lead="Готовые экраны для телефона мастера и наладчика и для сенсорного терминала в цехе. Всё интерактивное: нажмите заявку, закройте её через нижнюю панель, введите PIN."
    >
      <div className="grid justify-items-center gap-x-6 gap-y-10 [grid-template-columns:repeat(auto-fill,minmax(min(100%,390px),1fr))]">
        <Phone label="Список заявок → карточка"><RequestsApp /></Phone>
        <Phone label="Сводка смены"><ShiftDashboard /></Phone>
        <Phone label="Фиксация простоя"><DowntimeForm /></Phone>
        <Phone label="Вход на терминал по PIN"><PinLogin /></Phone>
        <Phone label="События и уведомления"><Notifications /></Phone>
      </div>
    </DocPage>
  )
}

export function MobileComponentsPage() {
  const [tab, setTab] = React.useState("requests")
  const [chip, setChip] = React.useState("all")
  const [pin, setPin] = React.useState("")
  return (
    <DocPage
      title="Мобильные компоненты"
      lead="Каркас мобильного экрана: шапка сверху, контент, внизу — навигация или панель действий (зона большого пальца). Цели касания ≥ 44px, отступы под вырез экрана — встроены."
    >
      <DocSection title="Анатомия экрана">
        <div className="grid items-start gap-6 2xl:grid-cols-[390px_1fr]">
          <div className="w-full max-w-[390px] overflow-hidden rounded-2xl border bg-background">
            <MobileHeader title="Заявки" subtitle="Линия сборки №1" onBack={() => {}} actions={<Button variant="ghost" size="icon-lg" className="size-11"><SearchIcon /><span className="sr-only">Поиск</span></Button>} />
            <ChipScroller value={chip} onChange={setChip} options={[{ value: "all", label: "Все", count: 24 }, { value: "new", label: "Новые", count: 3 }, { value: "work", label: "В работе", count: 9 }, { value: "done", label: "Выполнены", count: 12 }]} />
            <div className="h-40 border-y border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">Контент экрана</div>
            <BottomNav items={NAV} value={tab} onChange={setTab} className="static" />
          </div>
          <PropsTable
            rows={[
              { name: "MobileHeader", values: "title, subtitle, onBack, actions", note: "Шапка 56px, липкая. «Назад» — 44px. Заголовок обрезается, не переносится" },
              { name: "ChipScroller", values: "options, value, onChange", note: "Быстрые фильтры, горизонтальная прокрутка. Чип 36px высотой + счётчик" },
              { name: "BottomNav", values: "items (3–5), value, onChange", note: "Основная навигация на телефоне. Активный — полоса бренда + жирнее иконка. Бейдж-счётчик" },
              { name: "ActionBar", values: "children", note: "Липкая панель с 1–2 кнопками size=lg во всю ширину. Вместо кнопок в шапке" },
              { name: "Fab", values: "icon, label, extended", note: "Одно главное создающее действие экрана-списка. Над BottomNav" },
              { name: "Numpad", values: "onDigit, onBackspace, onSubmit", note: "Терминал: PIN, количество. Клавиши 64px" },
              { name: "Drawer", values: "—", note: "Выбор и подтверждение снизу вместо модального окна" },
            ]}
          />
        </div>
      </DocSection>

      <DocSection title="Панель действий и плавающая кнопка">
        <Example className="grid gap-6 p-4 md:grid-cols-2" code={`<ActionBar>\n  <Button variant="outline" size="lg">Назначить</Button>\n  <Button size="lg">Закрыть заявку</Button>\n</ActionBar>\n\n<Fab icon={PlusIcon} label="Новая заявка" extended />`}>
          <div className="overflow-hidden rounded-2xl border">
            <div className="h-24 bg-muted/40" />
            <ActionBar className="static"><Button variant="outline" size="lg">Назначить</Button><Button size="lg">Закрыть заявку</Button></ActionBar>
          </div>
          <div className="relative h-44 overflow-hidden rounded-2xl border bg-muted/40">
            <Fab icon={PlusIcon} label="Новая заявка" extended className="bottom-4" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Цифровая клавиатура терминала">
        <Example className="block" code={`<Numpad onDigit={…} onBackspace={…} onSubmit={…} submitLabel="Войти" />`}>
          <div className="mx-auto flex max-w-xs flex-col gap-4">
            <div className="text-center font-mono text-3xl tracking-[0.5em] tabular-nums">{pin.padEnd(4, "·")}</div>
            <Numpad onDigit={(d) => setPin((p) => (p.length < 4 ? p + d : p))} onBackspace={() => setPin((p) => p.slice(0, -1))} onSubmit={() => { toast.success("PIN принят"); setPin("") }} />
          </div>
        </Example>
      </DocSection>

      <Rules
        do={[
          "Главное действие — внизу (ActionBar или Fab), куда достаёт большой палец.",
          "На телефоне таблица = список карточек (DataTable делает это сам).",
          "Выбор из 2–6 вариантов на терминале — крупные кнопки-плитки, а не Select.",
          "Подтверждения и выбор — Drawer снизу, а не Dialog по центру.",
          "Учитывайте вырезы экрана: компоненты уже содержат env(safe-area-inset-*).",
        ]}
        dont={[
          "Не прячьте основную навигацию в «гамбургер» на телефоне — используйте BottomNav.",
          "Не делайте цели касания меньше 44px и ближе 8px друг к другу.",
          "Не полагайтесь на наведение (hover, HoverCard, Tooltip) — на тач-экране его нет.",
          "Не открывайте на телефоне многоколоночные формы.",
        ]}
      />
    </DocPage>
  )
}
