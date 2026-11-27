import * as React from "react"
import type { DateRange } from "react-day-picker"
import { ArrowLeftIcon, MousePointerClickIcon, RotateCcwIcon, ZoomInIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "cn"

import { InteractiveLegend, useSeriesVisibility } from "@/components/mgc/chart-legend"
import { DateRangePicker } from "@/components/mgc/date-picker"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"
import { BAR_MAX, BAR_RADIUS } from "./charts"

const axis = { tickLine: false, axisLine: false } as const
const nf = (n: number) => n.toLocaleString("ru-RU")
const SERIES = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

/* ───────────────────── Проваливание: столбцы ───────────────────── */

type Node = { name: string; value?: number; children?: Node[] }

const REASONS = (k: number): Node[] => [
  { name: "Поломка", value: 20 + ((k * 7) % 30) },
  { name: "Наладка", value: 8 + ((k * 5) % 18) },
  { name: "Нет комплектующих", value: 4 + ((k * 3) % 12) },
  { name: "Нет персонала", value: 2 + ((k * 2) % 7) },
]
const TREE: Node = {
  name: "Завод",
  children: [
    { name: "Линия №1", children: [{ name: "ПР-114", children: REASONS(1) }, { name: "ГМ-41", children: REASONS(2) }, { name: "КЛ-20", children: REASONS(3) }] },
    { name: "Линия №2", children: [{ name: "ПР-109", children: REASONS(4) }, { name: "КЛ-22", children: REASONS(5) }] },
    { name: "Сварка", children: [{ name: "РС-07", children: REASONS(6) }, { name: "РС-08", children: REASONS(7) }, { name: "РС-11", children: REASONS(8) }, { name: "СТ-03", children: REASONS(9) }] },
    { name: "Окраска", children: [{ name: "КО-03", children: REASONS(10) }, { name: "КО-04", children: REASONS(11) }] },
  ],
}
const sum = (n: Node): number => n.value ?? (n.children ?? []).reduce((s, c) => s + sum(c), 0)
const LEVELS = ["Участок", "Оборудование", "Причина"]

function DrillDownBars() {
  const [path, setPath] = React.useState<Node[]>([TREE])
  const node = path[path.length - 1]
  const rows = (node.children ?? []).map((c) => ({ name: c.name, value: sum(c), canDrill: !!c.children })).sort((a, b) => b.value - a.value)
  const config = { value: { label: "Простой, мин", color: "var(--chart-1)" } } satisfies ChartConfig
  const drill = (name: string) => {
    const child = node.children?.find((c) => c.name === name)
    if (child?.children) setPath((p) => [...p, child])
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Простои: {LEVELS[path.length - 1]?.toLowerCase() ?? ""}</CardTitle>
        <CardDescription>Ноябрь, мин · всего {nf(sum(node))}</CardDescription>
        {path.length > 1 && (
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setPath((p) => p.slice(0, -1))}><ArrowLeftIcon data-icon="inline-start" />Назад</Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            {path.map((n, i) => (
              <React.Fragment key={n.name}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {i === path.length - 1 ? (
                    <BreadcrumbPage>{n.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); setPath((p) => p.slice(0, i + 1)) }}>{n.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <ChartContainer key={node.name} config={config} className="aspect-auto h-64 w-full">
          <BarChart data={rows} layout="vertical" accessibilityLayer margin={{ right: 44 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" {...axis} width={120} />
            <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel={false} />} />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[0, 4, 4, 0]}
              maxBarSize={BAR_MAX}
              className={cn(rows[0]?.canDrill && "cursor-pointer")}
              onClick={(d) => drill(String((d as { name?: string }).name ?? ""))}
              label={{ position: "right", className: "fill-foreground", fontSize: 12 }}
              animationDuration={400}
            />
          </BarChart>
        </ChartContainer>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MousePointerClickIcon className="size-3.5" />
          {rows[0]?.canDrill ? "Нажмите на столбец, чтобы раскрыть уровень ниже. Крошки — вернуться на любой уровень." : "Нижний уровень — причины простоя."}
        </p>
      </CardContent>
    </Card>
  )
}

/* ───────────────────── Проваливание: кольцо ───────────────────── */

const SHARE: Node = {
  name: "Все причины",
  children: [
    { name: "Поломка", children: [{ name: "Гидравлика", value: 62 }, { name: "Электрика", value: 41 }, { name: "Механика", value: 30 }, { name: "ПЛК", value: 13 }] },
    { name: "Наладка", children: [{ name: "Смена оснастки", value: 48 }, { name: "Подстройка", value: 32 }] },
    { name: "Нет комплектующих", children: [{ name: "Склад", value: 25 }, { name: "Поставщик", value: 14 }] },
    { name: "Нет персонала", children: [{ name: "Больничный", value: 12 }, { name: "Обучение", value: 9 }] },
  ],
}

function DrillDownDonut() {
  const [node, setNode] = React.useState<Node>(SHARE)
  const rows = (node.children ?? []).map((c, i) => ({ key: `s${i}`, name: c.name, value: sum(c), canDrill: !!c.children }))
  const total = rows.reduce((s, r) => s + r.value, 0)
  const config = Object.fromEntries(rows.map((r, i) => [r.key, { label: r.name, color: SERIES[i] }])) satisfies ChartConfig
  const vis = useSeriesVisibility(rows.map((r) => r.key))
  const shown = rows.filter((r) => !vis.hidden.has(r.key))
  const shownTotal = shown.reduce((s, r) => s + r.value, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{node === SHARE ? "Причины простоя" : node.name}</CardTitle>
        <CardDescription>{node === SHARE ? "Доли, мин" : "Подпричины, мин"}</CardDescription>
        {node !== SHARE && (
          <CardAction><Button variant="outline" size="sm" onClick={() => { setNode(SHARE); vis.reset() }}><ArrowLeftIcon data-icon="inline-start" />Все причины</Button></CardAction>
        )}
      </CardHeader>
      <CardContent className="@container">
        <div className="grid items-center gap-4 @md:grid-cols-[12rem_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-48">
          <ChartContainer key={node.name} config={config} className="aspect-square w-full">
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
              <Pie
                data={shown}
                dataKey="value"
                nameKey="key"
                innerRadius="62%"
                outerRadius="95%"
                paddingAngle={1}
                stroke="var(--card)"
                strokeWidth={2}
                className={cn(node === SHARE && "cursor-pointer")}
                animationDuration={400}
                onClick={(d) => {
                  const child = node.children?.find((c) => c.name === (d as { name?: string }).name)
                  if (child?.children) {
                    setNode(child)
                    vis.reset()
                  }
                }}
              >
                {shown.map((r) => <Cell key={r.key} fill={`var(--color-${r.key})`} opacity={vis.opacity(r.key)} />)}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold tabular-nums">{nf(shownTotal)}</span>
            <span className="text-xs text-muted-foreground">мин</span>
          </div>
        </div>
        <InteractiveLegend
          items={rows.map((r, i) => ({ key: r.key, label: r.name, color: SERIES[i], value: `${nf(r.value)} · ${Math.round((r.value / total) * 100)}%` }))}
          hidden={vis.hidden}
          onToggle={vis.toggle}
          onOnly={vis.only}
          onHover={vis.setHover}
          onReset={vis.reset}
          layout="list"
        />
        </div>
      </CardContent>
    </Card>
  )
}

/* ───────────────────── Масштаб временного ряда ───────────────────── */

const DAILY = Array.from({ length: 120 }, (_, i) => {
  const d = new Date(2026, 6, 31 + i)
  const wave = Math.sin(i / 9) * 6 + Math.sin(i / 3.1) * 3
  return {
    date: `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`,
    l1: Math.round(80 + wave + ((i * 7) % 5)),
    l2: Math.round(72 + wave * 0.8 - ((i * 3) % 6)),
    weld: Math.round(64 + wave * 1.3 + ((i * 5) % 7) - 3),
  }
})
const LINES = [
  { key: "l1", label: "Линия №1", color: "var(--chart-1)" },
  { key: "l2", label: "Линия №2", color: "var(--chart-2)" },
  { key: "weld", label: "Сварка", color: "var(--chart-3)" },
]

function ZoomableSeries() {
  const [range, setRange] = React.useState<[number, number]>([DAILY.length - 30, DAILY.length - 1])
  const [sel, setSel] = React.useState<{ a?: string; b?: string }>({})
  const vis = useSeriesVisibility(LINES.map((l) => l.key))
  const data = DAILY.slice(range[0], range[1] + 1)
  const config = Object.fromEntries(LINES.map((l) => [l.key, { label: l.label, color: l.color }])) satisfies ChartConfig
  const preset = (days: number | "all") => setRange(days === "all" ? [0, DAILY.length - 1] : [DAILY.length - days, DAILY.length - 1])
  const applySelection = () => {
    if (sel.a && sel.b && sel.a !== sel.b) {
      let i = DAILY.findIndex((d) => d.date === sel.a)
      let j = DAILY.findIndex((d) => d.date === sel.b)
      if (i > j) [i, j] = [j, i]
      if (j - i >= 3) setRange([i, j])
    }
    setSel({})
  }
  const label = (e: unknown) => {
    const v = (e as { activeLabel?: string | number } | null)?.activeLabel
    return v === undefined ? undefined : String(v)
  }
  const span = range[1] - range[0] + 1
  return (
    <Card>
      <CardHeader>
        <CardTitle>OEE по участкам</CardTitle>
        <CardDescription className="tabular-nums">{DAILY[range[0]].date} — {DAILY[range[1]].date} · {span} дн., %</CardDescription>
        <CardAction>
          <ToggleGroup
            value={[span === DAILY.length ? "all" : String(span)]}
            onValueChange={(v) => v[0] && preset(v[0] === "all" ? "all" : Number(v[0]))}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="7">7 дн.</ToggleGroupItem>
            <ToggleGroupItem value="30">30 дн.</ToggleGroupItem>
            <ToggleGroupItem value="90">90 дн.</ToggleGroupItem>
            <ToggleGroupItem value="all">Всё</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <InteractiveLegend mark="line" items={LINES} hidden={vis.hidden} onToggle={vis.toggle} onOnly={vis.only} onHover={vis.setHover} onReset={vis.reset} />
        <ChartContainer config={config} className="aspect-auto h-72 w-full select-none">
          <LineChart
            data={data}
            accessibilityLayer
            margin={{ right: 12 }}
            onMouseDown={(e) => setSel({ a: label(e) })}
            onMouseMove={(e) => sel.a && setSel((s) => ({ ...s, b: label(e) }))}
            onMouseUp={applySelection}
            onMouseLeave={() => sel.a && setSel({})}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" {...axis} minTickGap={24} />
            <YAxis {...axis} width={36} domain={[40, 100]} tickFormatter={(v) => `${v}%`} />
            <ReferenceLine y={85} stroke="var(--muted-foreground)" label={{ value: "Цель 85%", position: "insideTopRight", fill: "var(--muted-foreground)", fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            {LINES.map((l) =>
              vis.hidden.has(l.key) ? null : (
                <Line key={l.key} dataKey={l.key} type="monotone" stroke={`var(--color-${l.key})`} strokeWidth={2} strokeOpacity={vis.opacity(l.key)}
                  dot={span <= 14 ? { r: 3, strokeWidth: 2, stroke: "var(--card)", fill: `var(--color-${l.key})` } : false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} isAnimationActive={false} />
              )
            )}
            {sel.a && sel.b && <ReferenceArea x1={sel.a} x2={sel.b} fill="var(--foreground)" fillOpacity={0.08} stroke="var(--foreground)" strokeOpacity={0.3} />}
          </LineChart>
        </ChartContainer>
        <ChartContainer config={config} className="aspect-auto h-14 w-full">
          <LineChart data={DAILY} margin={{ left: 36, right: 12 }}>
            <Line dataKey="l1" stroke="var(--color-l1)" strokeWidth={1} dot={false} isAnimationActive={false} />
            <Brush
              dataKey="date"
              height={40}
              startIndex={range[0]}
              endIndex={range[1]}
              onChange={(r) => {
                const { startIndex, endIndex } = r as { startIndex?: number; endIndex?: number }
                if (startIndex !== undefined && endIndex !== undefined) setRange([startIndex, endIndex])
              }}
              stroke="var(--muted-foreground)"
              fill="var(--muted)"
              travellerWidth={10}
            />
          </LineChart>
        </ChartContainer>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><ZoomInIcon className="size-3.5" />Выделите участок мышью на графике — приблизить. Тяните рамку внизу — сдвинуть период.</span>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => preset(30)}><RotateCcwIcon data-icon="inline-start" />Сбросить масштаб</Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ───────────────────── Масштабируемость ───────────────────── */

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [w, setW] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

const OUTPUT_BY_AREA = [
  { area: "Линия сборки №1", plan: 1200, fact: 1248 },
  { area: "Линия сборки №2", plan: 1100, fact: 1032 },
  { area: "Сварочный участок", plan: 900, fact: 812 },
  { area: "Окрасочный цех", plan: 950, fact: 968 },
  { area: "Испытания", plan: 400, fact: 391 },
]

function ScalableChart() {
  const [ref, w] = useWidth<HTMLDivElement>()
  const narrow = w > 0 && w < 420
  const config = { fact: { label: "Факт", color: "var(--chart-1)" }, plan: { label: "План", color: "var(--chart-4)" } } satisfies ChartConfig
  const vis = useSeriesVisibility(["fact", "plan"])
  return (
    <div ref={ref} className="flex h-full flex-col gap-2 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-medium">Выпуск по участкам, шт</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{w}px · {narrow ? "горизонтальные столбцы" : "колонки"}</span>
      </div>
      <InteractiveLegend items={[{ key: "fact", label: "Факт", color: "var(--chart-1)" }, { key: "plan", label: "План", color: "var(--chart-4)" }]} hidden={vis.hidden} onToggle={vis.toggle} onOnly={vis.only} onHover={vis.setHover} onReset={vis.reset} />
      <ChartContainer config={config} className="aspect-auto min-h-0 w-full flex-1">
        {narrow ? (
          <BarChart data={OUTPUT_BY_AREA} layout="vertical" accessibilityLayer barGap={2}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="area" {...axis} width={96} tick={{ fontSize: 11 }} tickFormatter={(v: string) => (v.length > 14 ? v.slice(0, 13) + "…" : v)} />
            <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
            {(["fact", "plan"] as const).map((k) => !vis.hidden.has(k) && <Bar key={k} dataKey={k} fill={`var(--color-${k})`} radius={[0, 4, 4, 0]} maxBarSize={14} fillOpacity={vis.opacity(k)} />)}
          </BarChart>
        ) : (
          <BarChart data={OUTPUT_BY_AREA} accessibilityLayer barGap={2}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="area" {...axis} interval={0} tick={{ fontSize: 11 }} tickFormatter={(v: string) => (w < 640 ? v.split(" ").slice(-1)[0] : v)} />
            <YAxis {...axis} width={44} tickFormatter={nf} />
            <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
            {(["fact", "plan"] as const).map((k) => !vis.hidden.has(k) && <Bar key={k} dataKey={k} fill={`var(--color-${k})`} radius={BAR_RADIUS} maxBarSize={BAR_MAX} fillOpacity={vis.opacity(k)} />)}
          </BarChart>
        )}
      </ChartContainer>
    </div>
  )
}

/* ───────────────────── Страница ───────────────────── */

export function AnalyticsPage() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(2026, 10, 1), to: new Date(2026, 10, 27) })
  const [area, setArea] = React.useState("all")
  const [loading, setLoading] = React.useState(false)
  const refetch = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 900)
  }
  return (
    <DocPage
      title="Аналитика"
      lead="Поведение графиков: проваливание на уровень ниже, масштаб и период, интерактивные легенды, перестройка под ширину. Правила dataviz: одна ось Y, подсказки дублируют подписи и таблицу, фильтры — одной строкой над всеми графиками."
    >
      <PropsTable
        rows={[
          { name: "Проваливание", values: "клик по метке", note: "Столбец/сектор раскрывает уровень ниже; крошки и «Назад» — вернуться. Курсор-рука и подсказка показывают, что можно провалиться" },
          { name: "Масштаб", values: "выделение · рамка · пресеты", note: "Выделите участок мышью — приблизить; рамка внизу — сдвинуть; 7 / 30 / 90 дней; «Сбросить масштаб»" },
          { name: "Легенда", values: "клик · наведение · двойной клик", note: "Скрыть/показать серию, подсветить, «только эта». Хотя бы одна серия всегда видна" },
          { name: "Масштабируемость", values: "по ширине контейнера", note: "Узко — горизонтальные столбцы и сокращённые подписи; легенда переносится строкой" },
          { name: "Фильтры", values: "одна строка сверху", note: "Период первым, действуют на все графики ниже; при обновлении график остаётся на месте, полупрозрачный" },
        ]}
      />

      <DocSection title="Фильтры дашборда" description="Одна строка над всеми графиками. При обновлении данных графики не прыгают и не мигают скелетоном — остаются на месте с пониженной прозрачностью.">
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={range} onChange={(r) => { setRange(r); refetch() }} today={new Date(2026, 10, 27)} />
          <ToggleGroup value={[area]} onValueChange={(v) => { if (v[0]) { setArea(v[0]); refetch() } }} variant="outline">
            <ToggleGroupItem value="all">Все участки</ToggleGroupItem>
            <ToggleGroupItem value="assembly">Сборка</ToggleGroupItem>
            <ToggleGroupItem value="body">Кузов</ToggleGroupItem>
          </ToggleGroup>
          {loading && <span className="text-sm text-muted-foreground">Обновляем…</span>}
        </div>
        <div className={cn("grid gap-4 transition-opacity duration-200 xl:grid-cols-2", loading && "pointer-events-none opacity-50")} aria-busy={loading}>
          <DrillDownBars />
          <DrillDownDonut />
        </div>
      </DocSection>

      <DocSection title="Масштаб и период" description="Длинный ряд: пресеты периода, выделение участка мышью, рамка-навигатор внизу. Легенда интерактивная.">
        <ZoomableSeries />
      </DocSection>

      <DocSection title="Масштабируемость" description="Потяните разделитель — график перестраивается по ширине своего контейнера: на узкой ширине колонки становятся горизонтальными столбцами, подписи сокращаются.">
        <div className="overflow-hidden rounded-xl border bg-card">
          <ResizablePanelGroup orientation="horizontal" className="min-h-80">
            <ResizablePanel defaultSize="70%" minSize="25%">
              <ScalableChart />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="30%" minSize="10%">
              <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">Соседняя панель — тяните разделитель влево и вправо</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </DocSection>

      <DocSection title="Код">
        <Example className="block" code={`// Проваливание: клик по столбцу открывает уровень ниже
<Bar dataKey="value" className="cursor-pointer" onClick={(d) => drill(d.name)} />

// Интерактивная легенда
const vis = useSeriesVisibility(["l1", "l2", "weld"])
<InteractiveLegend items={series} hidden={vis.hidden} onToggle={vis.toggle}
  onOnly={vis.only} onHover={vis.setHover} onReset={vis.reset} mark="line" />
{series.map((s) => !vis.hidden.has(s.key) && (
  <Line key={s.key} dataKey={s.key} strokeOpacity={vis.opacity(s.key)} … />
))}

// Масштаб: выделение мышью + рамка-навигатор
<LineChart onMouseDown={…} onMouseMove={…} onMouseUp={applySelection}>
  {sel.a && sel.b && <ReferenceArea x1={sel.a} x2={sel.b} />}
</LineChart>
<LineChart data={all}><Brush startIndex={from} endIndex={to} onChange={…} /></LineChart>`}>
          <span className="text-sm text-muted-foreground">Шаблоны — по кнопке «Код».</span>
        </Example>
      </DocSection>

      <Rules
        do={[
          "Показывайте, что можно провалиться: курсор-рука, подсказка, крошки уровня.",
          "Сохраняйте путь проваливания и масштаб в URL — ссылкой можно поделиться.",
          "Легенда при 2+ сериях; клик скрывает серию, но одна остаётся всегда.",
          "Масштаб всегда можно сбросить одной кнопкой.",
          "На узкой ширине меняйте форму (горизонтальные столбцы), а не сжимайте шрифт.",
        ]}
        dont={[
          "Не делайте вторую ось Y ради «комбо» — два графика рядом.",
          "Не проваливайтесь глубже 3–4 уровней — дальше нужна таблица.",
          "Не перерисовывайте цвета при скрытии серии — цвет закреплён за сущностью.",
          "Не показывайте скелетон при обновлении фильтра — график должен оставаться на месте.",
        ]}
      />
    </DocPage>
  )
}
