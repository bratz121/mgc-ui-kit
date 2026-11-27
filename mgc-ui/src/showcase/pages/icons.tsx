import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { SearchIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DocPage, DocSection, Example, Mono, PropsTable, Rules } from "../doc"

/*
 * Иконки — lucide (ISC-лицензия, https://lucide.dev). Полный набор грузится лениво,
 * только на этой странице, чтобы не раздувать бандл остальных экранов.
 * Подборка ниже — рекомендованные иконки для производственных сценариев.
 */

type Curated = { group: string; items: [name: string, ru: string][] }

export const CURATED: Curated[] = [
  {
    group: "Производство",
    items: [
      ["Factory", "Завод, цех"], ["Warehouse", "Склад"], ["Forklift", "Погрузчик"], ["Truck", "Доставка, логистика"],
      ["Package", "Изделие, упаковка"], ["Boxes", "Партия"], ["PackageCheck", "Принято ОТК"], ["PackageX", "Брак партии"],
      ["Container", "Тара"], ["Construction", "Ремонтные работы"], ["HardHat", "Охрана труда"], ["Cone", "Ограждение, опасная зона"],
      ["Workflow", "Технологический процесс"], ["Route", "Маршрут"], ["Recycle", "Переработка"], ["Leaf", "Экология"],
    ],
  },
  {
    group: "Оборудование и ТОиР",
    items: [
      ["Wrench", "Ремонт"], ["Cog", "Узел, механизм"], ["Settings", "Настройки"], ["Hammer", "Слесарные работы"],
      ["Drill", "Инструмент"], ["Bolt", "Крепёж"], ["Nut", "Гайка, метизы"], ["Gauge", "Датчик, показатель"],
      ["Thermometer", "Температура"], ["Zap", "Электрика"], ["Plug", "Подключение"], ["Cable", "Кабель"],
      ["Cpu", "Контроллер"], ["CircuitBoard", "Электроника"], ["Battery", "Аккумулятор"], ["Power", "Вкл/выкл"],
      ["Droplets", "Жидкости, смазка"], ["Flame", "Нагрев, пожар"], ["Wind", "Вентиляция"], ["Fuel", "Топливо"],
    ],
  },
  {
    group: "Статусы и сигналы",
    items: [
      ["CircleCheck", "Выполнено"], ["CircleX", "Отклонено"], ["CircleAlert", "Внимание"], ["TriangleAlert", "Предупреждение"],
      ["OctagonX", "Остановка, авария"], ["Siren", "Андон, тревога"], ["Info", "Справка"], ["BadgeCheck", "Проверено"],
      ["CircleDot", "Активно"], ["CirclePlay", "Запущено"], ["CircleStop", "Остановлено"], ["Pause", "Пауза"],
      ["Clock", "Время"], ["Timer", "Таймер, такт"], ["Hourglass", "Ожидание"], ["Flag", "Отметка"],
    ],
  },
  {
    group: "Качество и измерения",
    items: [
      ["Ruler", "Размер"], ["Scale", "Вес, баланс"], ["Weight", "Масса"], ["Microscope", "Лаборатория"],
      ["FlaskConical", "Анализ"], ["TestTube", "Проба"], ["Target", "Цель, норматив"], ["ScanBarcode", "Сканирование ШК"],
      ["QrCode", "QR-код"], ["Barcode", "Штрихкод"], ["Scan", "Сканер"], ["Camera", "Фотофиксация"],
    ],
  },
  {
    group: "Данные и аналитика",
    items: [
      ["ChartColumn", "Столбчатый график"], ["ChartLine", "Линейный график"], ["ChartPie", "Доли"], ["TrendingUp", "Рост"],
      ["TrendingDown", "Падение"], ["Activity", "Мониторинг"], ["LayoutDashboard", "Дашборд"], ["Database", "База данных"],
      ["Server", "Сервер"], ["FileSpreadsheet", "Excel-отчёт"], ["Kanban", "Канбан"], ["ListChecks", "Чек-лист"],
    ],
  },
  {
    group: "Документы и задачи",
    items: [
      ["ClipboardList", "Заявка, наряд"], ["ClipboardCheck", "Акт приёмки"], ["FileText", "Документ"], ["BookOpen", "Инструкция"],
      ["Folder", "Папка"], ["Archive", "Архив"], ["Paperclip", "Вложение"], ["CalendarDays", "Календарь"],
      ["CalendarClock", "План ТО"], ["ListTodo", "Задачи"], ["Lightbulb", "Предложение по улучшению"], ["Milestone", "Этап"],
    ],
  },
  {
    group: "Люди и доступ",
    items: [
      ["User", "Пользователь"], ["Users", "Бригада"], ["UserCog", "Администратор"], ["UserCheck", "Ответственный"],
      ["Shield", "Безопасность"], ["ShieldCheck", "Допуск"], ["Lock", "Закрыто"], ["KeyRound", "Доступ"],
      ["Bell", "Уведомления"], ["BellRing", "Новое уведомление"], ["MessageSquare", "Комментарий"], ["Mail", "Почта"],
    ],
  },
  {
    group: "Действия",
    items: [
      ["Plus", "Добавить"], ["Pencil", "Редактировать"], ["Trash2", "Удалить"], ["Copy", "Копировать"],
      ["Save", "Сохранить"], ["Download", "Скачать"], ["Upload", "Загрузить"], ["Printer", "Печать"],
      ["Share2", "Поделиться"], ["RefreshCw", "Обновить"], ["RotateCcw", "Отменить"], ["Send", "Отправить"],
      ["Search", "Поиск"], ["Filter", "Фильтр"], ["ArrowUpDown", "Сортировка"], ["Eye", "Просмотр"],
    ],
  },
  {
    group: "Навигация и интерфейс",
    items: [
      ["House", "Главная"], ["PanelLeft", "Меню"], ["Menu", "Меню (моб.)"], ["LayoutGrid", "Плитки"],
      ["List", "Список"], ["ChevronDown", "Раскрыть"], ["ChevronRight", "Перейти"], ["ArrowLeft", "Назад"],
      ["ExternalLink", "Внешняя ссылка"], ["Ellipsis", "Ещё действия"], ["X", "Закрыть"], ["Check", "Выбрано"],
      ["LogOut", "Выход"], ["Maximize2", "Развернуть"], ["Monitor", "Терминал"], ["Smartphone", "Мобильный"],
    ],
  },
]

type IconMap = Record<string, LucideIcon>

function useLucide() {
  const [mod, setMod] = React.useState<IconMap | null>(null)
  React.useEffect(() => {
    let alive = true
    import("lucide-react").then((m) => {
      if (!alive) return
      // Полный словарь + алиасы (Trash2, TriangleAlert и т.п. в v1 — алиасы).
      const all: IconMap = { ...(m.icons as IconMap) }
      for (const [k, v] of Object.entries(m)) {
        if (/^[A-Z]/.test(k) && !k.endsWith("Icon") && !k.startsWith("Lucide") && typeof v === "object") {
          all[k] ??= v as unknown as LucideIcon
        }
      }
      setMod(all)
    })
    return () => {
      alive = false
    }
  }, [])
  return mod
}

function IconTile({
  name,
  Icon,
  label,
  size,
  stroke,
}: {
  name: string
  Icon: LucideIcon
  label?: string
  size: number
  stroke: number
}) {
  const importLine = `import { ${name}Icon } from "lucide-react"`
  return (
    <button
      type="button"
      title={`${name}Icon — скопировать импорт`}
      onClick={() => {
        navigator.clipboard?.writeText(importLine)
        toast.success(`${name}Icon`, { description: "Импорт скопирован" })
      }}
      className="group flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center outline-none transition-colors hover:border-foreground/30 hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex h-10 items-center justify-center">
        <Icon size={size} strokeWidth={stroke} />
      </span>
      {label && <span className="line-clamp-2 text-xs leading-tight">{label}</span>}
      <span className="w-full truncate font-mono text-[10px] text-muted-foreground">{name}</span>
    </button>
  )
}

export function IconsPage() {
  const lib = useLucide()
  const [query, setQuery] = React.useState("")
  const [scope, setScope] = React.useState<"curated" | "all">("curated")
  const [size, setSize] = React.useState("20")
  const [stroke, setStroke] = React.useState("2")
  const q = query.trim().toLowerCase()
  const sz = Number(size)
  const sw = Number(stroke)

  const curated = React.useMemo(
    () =>
      CURATED.map((g) => ({
        ...g,
        items: g.items.filter(
          ([n, ru]) => !q || n.toLowerCase().includes(q) || ru.toLowerCase().includes(q)
        ),
      })).filter((g) => g.items.length),
    [q]
  )

  const all = React.useMemo(() => {
    if (!lib) return []
    const names = Object.keys(lib).sort()
    return (q ? names.filter((n) => n.toLowerCase().includes(q)) : names).slice(0, 400)
  }, [lib, q])

  return (
    <DocPage
      title="Иконки"
      lead={
        <>
          Единственная библиотека иконок кита — <strong>lucide</strong> (открытая, лицензия ISC, {lib ? Object.keys(lib).length : "2000+"} иконок).
          Нажмите на иконку, чтобы скопировать импорт. Подборка ниже — рекомендованные иконки для производственных задач с русскими значениями.
        </>
      }
    >
      <div className="sticky top-16 z-[5] -mx-2 flex flex-wrap items-center gap-3 rounded-xl bg-background/90 px-2 py-3 backdrop-blur">
        <InputGroup className="w-full sm:w-80">
          <InputGroupAddon><SearchIcon /></InputGroupAddon>
          <InputGroupInput
            placeholder={scope === "curated" ? "Поиск: ремонт, склад, wrench…" : "Поиск по-английски: gear, truck…"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupText>{scope === "curated" ? curated.reduce((s, g) => s + g.items.length, 0) : all.length}</InputGroupText>
            </InputGroupAddon>
          )}
        </InputGroup>
        <Tabs value={scope} onValueChange={(v) => setScope(v as "curated" | "all")}>
          <TabsList>
            <TabsTrigger value="curated">Подборка</TabsTrigger>
            <TabsTrigger value="all">Все иконки</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Размер</span>
          <ToggleGroup value={[size]} onValueChange={(v) => v[0] && setSize(v[0])} variant="outline" size="sm">
            <ToggleGroupItem value="16">16</ToggleGroupItem>
            <ToggleGroupItem value="20">20</ToggleGroupItem>
            <ToggleGroupItem value="24">24</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Линия</span>
          <ToggleGroup value={[stroke]} onValueChange={(v) => v[0] && setStroke(v[0])} variant="outline" size="sm">
            <ToggleGroupItem value="1.5">1.5</ToggleGroupItem>
            <ToggleGroupItem value="2">2</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {!lib && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Загружаем набор иконок…</div>
      )}

      {lib && scope === "curated" &&
        curated.map((g) => (
          <DocSection key={g.group} title={g.group}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
              {g.items.map(([name, ru]) => {
                const Icon = lib[name]
                return Icon ? <IconTile key={name} name={name} Icon={Icon} label={ru} size={sz} stroke={sw} /> : null
              })}
            </div>
          </DocSection>
        ))}

      {lib && scope === "curated" && curated.length === 0 && (
        <p className="text-sm text-muted-foreground">
          В подборке ничего не нашлось. Переключитесь на «Все иконки» и поищите по-английски.
        </p>
      )}

      {lib && scope === "all" && (
        <DocSection
          title={q ? `Найдено: ${all.length}${all.length === 400 ? "+" : ""}` : "Все иконки lucide"}
          description={all.length === 400 ? "Показаны первые 400 — уточните запрос." : undefined}
        >
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 xl:grid-cols-10">
            {all.map((name) => (
              <IconTile key={name} name={name} Icon={lib[name]} size={sz} stroke={sw} />
            ))}
          </div>
        </DocSection>
      )}

      <DocSection title="Как использовать">
        <Example
          code={`import { WrenchIcon, PlusIcon } from "lucide-react"

// В кнопке — data-icon, без классов размера (размер задаёт кнопка)
<Button><PlusIcon data-icon="inline-start" />Добавить</Button>

// Отдельно — через size-*
<WrenchIcon className="size-5 text-muted-foreground" />

// Иконка без подписи — обязательно sr-only
<Button variant="ghost" size="icon"><WrenchIcon /><span className="sr-only">Ремонт</span></Button>`}
        >
          <Badge variant="outline">Импорт — всегда с суффиксом Icon: WrenchIcon</Badge>
        </Example>
        <PropsTable
          rows={[
            { name: "16px · size-4", values: "stroke 2", note: "По умолчанию: кнопки, поля, меню, таблицы, бейджи (12px)" },
            { name: "20px · size-5", values: "stroke 2", note: "Шапка, кнопки lg, заголовки карточек" },
            { name: "24px · size-6", values: "stroke 1.5–2", note: "Пустые состояния, крупные плитки, сенсорные терминалы" },
            { name: "32px+", values: "stroke 1.5", note: "Иллюстративные места (Empty), не в интерфейсных элементах" },
          ]}
        />
      </DocSection>

      <Rules
        do={[
          "Берите иконки только из lucide — один стиль линии во всём интерфейсе.",
          "Цвет иконки = цвет текста рядом (currentColor). Статусный цвет — только вместе со статусом.",
          "Одно значение — одна иконка во всех модулях (ремонт = Wrench, остановка = OctagonX).",
          "Импортируйте по имени (WrenchIcon) — в сборку попадут только нужные иконки.",
        ]}
        dont={[
          "Не смешивайте lucide с Material, Font Awesome, Bootstrap Icons.",
          "Не используйте иконку как единственную подпись важной кнопки.",
          <>Не импортируйте весь набор <Mono>icons</Mono> в продуктовый код — только на этой странице.</>,
          "Не меняйте толщину линии внутри одного экрана.",
        ]}
      />
    </DocPage>
  )
}
