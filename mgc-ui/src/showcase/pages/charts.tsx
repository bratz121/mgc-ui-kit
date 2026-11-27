import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

import { ChartCard } from "@/components/mgc/chart-card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"

/*
 * Спецификация марок (dataviz/marks-and-anatomy):
 *   столбец ≤ 24px, скругление 4px только у конца данных; линия 2px; маркер r ≥ 4 с кольцом 2px;
 *   заливка площади 10%; сетка — сплошная 1px, только горизонтальная; одна ось Y.
 */
export const BAR_MAX = 24
export const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0]
const nf = (n: number) => n.toLocaleString("ru-RU")
const axis = { tickLine: false, axisLine: false } as const

/* ── Данные ── */

const OUTPUT = [
  { day: "Пн", plan: 1200, fact: 1180 },
  { day: "Вт", plan: 1200, fact: 1240 },
  { day: "Ср", plan: 1200, fact: 1095 },
  { day: "Чт", plan: 1200, fact: 1210 },
  { day: "Пт", plan: 1200, fact: 1260 },
  { day: "Сб", plan: 800, fact: 820 },
]
const outputConfig = {
  fact: { label: "Факт", color: "var(--chart-1)" },
  plan: { label: "План", color: "var(--chart-4)" },
} satisfies ChartConfig

const DOWNTIME_REASONS = [
  { line: "Линия №1", breakdown: 42, setup: 18, parts: 12, staff: 4 },
  { line: "Линия №2", breakdown: 25, setup: 30, parts: 6, staff: 9 },
  { line: "Сварка", breakdown: 64, setup: 10, parts: 3, staff: 2 },
  { line: "Окраска", breakdown: 15, setup: 22, parts: 18, staff: 6 },
]
const reasonsConfig = {
  breakdown: { label: "Поломка", color: "var(--chart-1)" },
  setup: { label: "Наладка", color: "var(--chart-2)" },
  parts: { label: "Нет комплектующих", color: "var(--chart-3)" },
  staff: { label: "Нет персонала", color: "var(--chart-4)" },
} satisfies ChartConfig

const PARETO = [
  { reason: "Течь гидравлики", min: 146 },
  { reason: "Сбой ПЛК", min: 98 },
  { reason: "Износ электрода", min: 74 },
  { reason: "Заклинивание конвейера", min: 51 },
  { reason: "Нет комплектующих", min: 39 },
  { reason: "Прочее", min: 27 },
]
const paretoConfig = { min: { label: "Простой, мин", color: "var(--chart-1)" } } satisfies ChartConfig

const OEE = Array.from({ length: 14 }, (_, i) => ({
  d: `${14 + i}.11`,
  l1: 78 + ((i * 7) % 11) - 3,
  l2: 70 + ((i * 5) % 13) - 4,
  weld: 62 + ((i * 11) % 17) - 6,
}))
const oeeConfig = {
  l1: { label: "Линия №1", color: "var(--chart-1)" },
  l2: { label: "Линия №2", color: "var(--chart-2)" },
  weld: { label: "Сварка", color: "var(--chart-3)" },
} satisfies ChartConfig

const HOURLY = ["08", "09", "10", "11", "12", "13", "14", "15"].map((h, i) => ({
  h: `${h}:00`,
  out: [142, 151, 160, 148, 96, 155, 158, 149][i],
}))
const hourlyConfig = { out: { label: "Выпуск, шт", color: "var(--chart-1)" } } satisfies ChartConfig

const SHARE = [
  { key: "breakdown", label: "Поломка", value: 146 },
  { key: "setup", label: "Наладка", value: 80 },
  { key: "parts", label: "Нет комплектующих", value: 39 },
  { key: "staff", label: "Нет персонала", value: 21 },
]
const shareConfig = {
  value: { label: "Минут" },
  breakdown: { label: "Поломка", color: "var(--chart-1)" },
  setup: { label: "Наладка", color: "var(--chart-2)" },
  parts: { label: "Нет комплектующих", color: "var(--chart-3)" },
  staff: { label: "Нет персонала", color: "var(--chart-4)" },
} satisfies ChartConfig

const COMBO = OUTPUT.map((d, i) => ({ ...d, cum: OUTPUT.slice(0, i + 1).reduce((s, x) => s + x.fact, 0) }))

const SCATTER = [
  [1200, 1], [2400, 2], [3100, 2], [4200, 3], [5100, 5], [6400, 4], [7000, 7], [8200, 6], [9100, 9], [10400, 8], [11800, 12], [12500, 10],
].map(([hours, fails], i) => ({ hours, fails, code: `ОБ-${String(i + 1).padStart(2, "0")}` }))
const scatterConfig = { fails: { label: "Отказов за год", color: "var(--chart-1)" } } satisfies ChartConfig

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const HOURS = Array.from({ length: 12 }, (_, i) => String(8 + i).padStart(2, "0"))
const HEAT = DAYS.map((d, di) => ({
  day: d,
  values: HOURS.map((_, hi) => (di >= 5 ? (hi * 3 + di) % 6 : ((di * 7 + hi * 5) % 23) + (hi === 4 ? 14 : 0))),
}))

/* ── Графики (экспортируются для шаблонов) ── */

export function OutputChart() {
  return (
    <ChartContainer config={outputConfig} className="aspect-auto h-64 w-full">
      <BarChart data={OUTPUT} barGap={2} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} width={44} tickFormatter={nf} />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="fact" fill="var(--color-fact)" radius={BAR_RADIUS} maxBarSize={BAR_MAX} />
        <Bar dataKey="plan" fill="var(--color-plan)" radius={BAR_RADIUS} maxBarSize={BAR_MAX} />
      </BarChart>
    </ChartContainer>
  )
}

export function OeeChart({ height = "h-64" }: { height?: string }) {
  return (
    <ChartContainer config={oeeConfig} className={`aspect-auto ${height} w-full`}>
      <LineChart data={OEE} accessibilityLayer margin={{ right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="d" {...axis} minTickGap={16} />
        <YAxis {...axis} width={36} domain={[40, 100]} tickFormatter={(v) => `${v}%`} />
        <ReferenceLine y={85} stroke="var(--muted-foreground)" strokeDasharray="0" label={{ value: "Цель 85%", position: "insideTopRight", fill: "var(--muted-foreground)", fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        {(["l1", "l2", "weld"] as const).map((k) => (
          <Line key={k} dataKey={k} type="monotone" stroke={`var(--color-${k})`} strokeWidth={2} dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

/* ── Bullet: факт против цели ── */

function Bullet({ label, value, target, max = 100, unit = "%" }: { label: string; value: number; target: number; max?: number; unit?: string }) {
  const below = value < target
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 text-sm max-sm:grid-cols-[1fr_auto] max-sm:gap-y-1.5">
      <span className="truncate">{label}</span>
      <div className="relative h-3 rounded-full bg-muted max-sm:order-3 max-sm:col-span-2" role="img" aria-label={`${label}: ${value}${unit}, цель ${target}${unit}`}>
        <div className="h-full rounded-full bg-chart-1" style={{ width: `${(value / max) * 100}%` }} />
        <div className="absolute -top-1 -bottom-1 w-0.5 rounded-full bg-foreground" style={{ left: `${(target / max) * 100}%` }} />
      </div>
      <span className="text-right tabular-nums">
        {value}{unit}
        {below && <span className="ml-1.5 text-xs text-destructive">−{target - value}</span>}
      </span>
    </div>
  )
}

/* ── Тепловая карта ── */

function Heatmap() {
  const max = Math.max(...HEAT.flatMap((r) => r.values))
  const step = (v: number) => (v === 0 ? 0 : Math.min(5, Math.ceil((v / max) * 5)))
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <div className="grid min-w-[480px] grid-cols-[2.5rem_repeat(12,minmax(0,1fr))] gap-0.5 text-xs">
          <span />
          {HOURS.map((h) => <span key={h} className="pb-1 text-center text-muted-foreground tabular-nums">{h}</span>)}
          {HEAT.map((r) => (
            <React.Fragment key={r.day}>
              <span className="flex items-center text-muted-foreground">{r.day}</span>
              {r.values.map((v, i) => (
                <div
                  key={i}
                  title={`${r.day}, ${HOURS[i]}:00 — ${v} мин`}
                  className="aspect-square rounded-[3px] transition-[outline] hover:outline-2 hover:outline-foreground"
                  style={{ background: step(v) === 0 ? "var(--muted)" : `var(--seq-${step(v)})` }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>0 мин</span>
        {[1, 2, 3, 4, 5].map((i) => <span key={i} className="h-2.5 w-6 rounded-[2px]" style={{ background: `var(--seq-${i})` }} />)}
        <span className="tabular-nums">{max} мин</span>
      </div>
    </div>
  )
}

/* ── Страница ── */

export function ChartsPage() {
  const total = SHARE.reduce((s, x) => s + x.value, 0)
  return (
    <DocPage
      title="Диаграммы"
      lead="Графики на Recharts через ChartContainer shadcn, по методу dataviz: сначала форма (какую задачу решает график), потом цвет. Палитра серий проверена валидатором на различимость при дальтонизме. У каждого графика — табличный вид."
    >
      <PropsTable
        rows={[
          { name: "Сравнение величин", values: "Столбцы", note: "План/факт по дням, выпуск по участкам" },
          { name: "Состав", values: "Стек-столбцы, кольцо ≤ 4 долей", note: "Простои по причинам" },
          { name: "Рейтинг", values: "Горизонтальные столбцы (Парето)", note: "Топ причин, отсортировано, подписи на концах" },
          { name: "Динамика", values: "Линии (≤ 5 серий), площадь (1 серия)", note: "OEE по дням, выпуск по часам" },
          { name: "Факт vs цель", values: "Bullet", note: "OEE участков против норматива — компактнее и точнее спидометра" },
          { name: "Плотность по двум осям", values: "Тепловая карта", note: "Простои день × час" },
          { name: "Связь двух величин", values: "Точечная", note: "Наработка × отказы" },
          { name: "Одно число", values: "StatCard, не график", note: "Выпуск за смену" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Выпуск: план и факт" description="Текущая неделя, шт" data={OUTPUT}
          columns={[{ key: "day", label: "День" }, { key: "plan", label: "План, шт", align: "right", format: (v) => nf(v as number) }, { key: "fact", label: "Факт, шт", align: "right", format: (v) => nf(v as number) }]}>
          <OutputChart />
        </ChartCard>

        <ChartCard title="Простои по причинам" description="Текущая неделя, мин" data={DOWNTIME_REASONS}
          columns={[{ key: "line", label: "Участок" }, { key: "breakdown", label: "Поломка", align: "right" }, { key: "setup", label: "Наладка", align: "right" }, { key: "parts", label: "Компл.", align: "right" }, { key: "staff", label: "Персонал", align: "right" }]}>
          <ChartContainer config={reasonsConfig} className="aspect-auto h-64 w-full">
            <BarChart data={DOWNTIME_REASONS} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="line" {...axis} />
              <YAxis {...axis} width={36} />
              <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {(["breakdown", "setup", "parts", "staff"] as const).map((k, i, arr) => (
                <Bar key={k} dataKey={k} stackId="a" fill={`var(--color-${k})`} maxBarSize={40}
                  stroke="var(--card)" strokeWidth={2} radius={i === arr.length - 1 ? BAR_RADIUS : 0} />
              ))}
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Парето причин простоя" description="Ноябрь, мин" data={PARETO}
          columns={[{ key: "reason", label: "Причина" }, { key: "min", label: "Минут", align: "right" }]}>
          <ChartContainer config={paretoConfig} className="aspect-auto h-64 w-full">
            <BarChart data={PARETO} layout="vertical" accessibilityLayer margin={{ right: 40 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" {...axis} hide />
              <YAxis type="category" dataKey="reason" {...axis} width={150} tick={{ fontSize: 12 }} />
              <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="min" fill="var(--color-min)" radius={[0, 4, 4, 0]} maxBarSize={BAR_MAX}>
                <LabelList dataKey="min" position="right" className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="OEE по участкам" description="Последние 14 дней, %" data={OEE}
          columns={[{ key: "d", label: "Дата" }, { key: "l1", label: "Линия №1", align: "right" }, { key: "l2", label: "Линия №2", align: "right" }, { key: "weld", label: "Сварка", align: "right" }]}>
          <OeeChart />
        </ChartCard>

        <ChartCard title="Выпуск по часам" description="Сегодня, шт · норма 150 шт/ч" data={HOURLY}
          columns={[{ key: "h", label: "Час" }, { key: "out", label: "Выпуск, шт", align: "right" }]}>
          <ChartContainer config={hourlyConfig} className="aspect-auto h-64 w-full">
            <AreaChart data={HOURLY} accessibilityLayer margin={{ right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="h" {...axis} />
              <YAxis {...axis} width={36} domain={[0, 200]} />
              <ReferenceLine y={150} stroke="var(--muted-foreground)" label={{ value: "Норма", position: "insideTopRight", fill: "var(--muted-foreground)", fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area dataKey="out" type="monotone" stroke="var(--color-out)" strokeWidth={2} fill="var(--color-out)" fillOpacity={0.1}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Доли причин простоя" description="Текущая неделя, мин" data={SHARE}
          columns={[{ key: "label", label: "Причина" }, { key: "value", label: "Минут", align: "right" }, { key: "key", label: "Доля", align: "right", format: (_, r) => `${Math.round((r.value / total) * 100)}%` }]}>
          <div className="@container">
          <div className="grid items-center gap-4 @md:grid-cols-[11rem_1fr]">
            <div className="mx-auto aspect-square w-full max-w-44">
            <ChartContainer config={shareConfig} className="aspect-square w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
                <Pie data={SHARE} dataKey="value" nameKey="key" innerRadius="62%" outerRadius="95%" paddingAngle={1} stroke="var(--card)" strokeWidth={2}>
                  {SHARE.map((s) => <Cell key={s.key} fill={`var(--color-${s.key})`} />)}
                </Pie>
              </PieChart>
            </ChartContainer>
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              {SHARE.map((s) => (
                <li key={s.key} className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: shareConfig[s.key as keyof typeof shareConfig] && "color" in shareConfig[s.key as keyof typeof shareConfig] ? (shareConfig[s.key as keyof typeof shareConfig] as { color: string }).color : undefined }} />
                  <span className="flex-1">{s.label}</span>
                  <span className="tabular-nums">{s.value}</span>
                  <span className="w-10 text-right text-muted-foreground tabular-nums">{Math.round((s.value / total) * 100)}%</span>
                </li>
              ))}
              <li className="flex items-center gap-2 border-t pt-2 font-medium">
                <span className="size-2.5" /><span className="flex-1">Всего</span><span className="tabular-nums">{total}</span><span className="w-10" />
              </li>
            </ul>
          </div>
          </div>
        </ChartCard>

        <ChartCard title="Факт и накопленный итог" description="Текущая неделя, шт — одна ось, одни единицы" data={COMBO}
          columns={[{ key: "day", label: "День" }, { key: "fact", label: "Факт", align: "right", format: (v) => nf(v as number) }, { key: "cum", label: "Накопительно", align: "right", format: (v) => nf(v as number) }]}>
          <ChartContainer config={{ fact: { label: "Факт за день", color: "var(--chart-1)" }, cum: { label: "Накопительно", color: "var(--chart-5)" } }} className="aspect-auto h-64 w-full">
            <ComposedChart data={COMBO} accessibilityLayer margin={{ right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" {...axis} />
              <YAxis {...axis} width={48} tickFormatter={nf} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="fact" fill="var(--color-fact)" radius={BAR_RADIUS} maxBarSize={BAR_MAX} />
              <Line dataKey="cum" type="monotone" stroke="var(--color-cum)" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: "var(--card)", fill: "var(--color-cum)" }} />
            </ComposedChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Наработка и отказы" description="Оборудование сварочного участка, за год" data={SCATTER}
          columns={[{ key: "code", label: "Код" }, { key: "hours", label: "Наработка, ч", align: "right", format: (v) => nf(v as number) }, { key: "fails", label: "Отказов", align: "right" }]}>
          <ChartContainer config={scatterConfig} className="aspect-auto h-64 w-full">
            <ScatterChart accessibilityLayer margin={{ right: 12 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="hours" name="Наработка, ч" {...axis} tickFormatter={(v) => `${v / 1000}K`} />
              <YAxis type="number" dataKey="fails" name="Отказов" {...axis} width={30} />
              <ZAxis range={[64, 64]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Scatter data={SCATTER} fill="var(--color-fails)" stroke="var(--card)" strokeWidth={2} />
            </ScatterChart>
          </ChartContainer>
        </ChartCard>
      </div>

      <DocSection title="Bullet: факт против цели" description="Полоса — факт, вертикальная риска — цель. Отставание подписано числом, не только цветом. Заменяет спидометры и кольца прогресса.">
        <Example className="block" code={`<Bullet label="Линия сборки №1" value={82} target={85} />`}>
          <div className="flex max-w-2xl flex-col gap-4">
            <Bullet label="Линия сборки №1" value={82} target={85} />
            <Bullet label="Линия сборки №2" value={71} target={85} />
            <Bullet label="Сварочный участок" value={54} target={80} />
            <Bullet label="Окрасочный цех" value={88} target={85} />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Тепловая карта" description="Последовательная шкала одного тона (--seq-1…5): светлее — меньше, темнее — больше. Наведение показывает значение.">
        <Example className="block"><Heatmap /></Example>
      </DocSection>

      <DocSection title="Шаблон кода">
        <Example
          className="block"
          code={`const config = {
  fact: { label: "Факт", color: "var(--chart-1)" },
  plan: { label: "План", color: "var(--chart-4)" },
} satisfies ChartConfig

<ChartCard title="Выпуск: план и факт" description="Текущая неделя, шт" data={data} columns={columns}>
  <ChartContainer config={config} className="aspect-auto h-64 w-full">
    <BarChart data={data} barGap={2} accessibilityLayer>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="day" tickLine={false} axisLine={false} />
      <YAxis tickLine={false} axisLine={false} width={44} />
      <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent />} />
      <Bar dataKey="fact" fill="var(--color-fact)" radius={[4, 4, 0, 0]} maxBarSize={24} />
      <Bar dataKey="plan" fill="var(--color-plan)" radius={[4, 4, 0, 0]} maxBarSize={24} />
    </BarChart>
  </ChartContainer>
</ChartCard>`}
        >
          <span className="text-sm text-muted-foreground">Полный шаблон — по кнопке «Код».</span>
        </Example>
      </DocSection>

      <Rules
        do={[
          "Сначала задача графика → форма, цвет — в последнюю очередь.",
          "Серии красьте строго по порядку --chart-1…5; цвет закреплён за сущностью, а не за местом.",
          "Легенда — при 2+ сериях; одна серия — её называет заголовок.",
          "Подписывайте выборочно: конец линии, максимум, столбцы рейтинга.",
          "Цель и норматив — горизонтальной линией с подписью.",
          "У каждого графика — табличный вид (ChartCard).",
        ]}
        dont={[
          "Никогда две оси Y. Разные единицы — два графика рядом.",
          "Не используйте статусные цвета (успех/ошибка) для серий.",
          "Не больше 5 серий; больше — «Прочее» или несколько маленьких графиков.",
          "Не используйте спидометры, 3D, градиенты, пунктирную сетку.",
          "Не ставьте число на каждую точку.",
          "Кольцо — только для 2–4 долей одного целого.",
        ]}
      />
    </DocPage>
  )
}
