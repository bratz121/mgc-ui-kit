import * as React from "react"
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/*
 * KPI-карточка: подпись, крупное значение, изменение к прошлому периоду.
 * Спецификация: docs/03-components.md → StatCard.
 *
 * tone — цветная полоса-маркер сверху (как цветные шапки карточек в реестре заказов
 * из референсов). Используйте, когда карточки соответствуют статусам или категориям.
 */
type Tone = "none" | "steel" | "rose" | "olive" | "slate" | "ochre" | "brand"

// Тона = цвета серий графиков (--chart-1…5), чтобы карточка и её серия на графике совпадали.
const toneClass: Record<Tone, string> = {
  none: "",
  steel: "before:bg-chart-1",
  rose: "before:bg-chart-2",
  olive: "before:bg-chart-3",
  slate: "before:bg-chart-4",
  ochre: "before:bg-chart-5",
  brand: "before:bg-brand",
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaLabel = "к прошлому периоду",
  /** true — рост это хорошо (выпуск), false — рост это плохо (простои, брак). */
  higherIsBetter = true,
  tone = "none",
  icon,
  className,
}: {
  label: string
  value: React.ReactNode
  unit?: string
  delta?: number
  deltaLabel?: string
  higherIsBetter?: boolean
  tone?: Tone
  icon?: React.ReactNode
  className?: string
}) {
  const up = (delta ?? 0) >= 0
  const good = up === higherIsBetter
  return (
    <Card
      className={cn(
        "relative gap-3",
        tone !== "none" &&
          "before:absolute before:inset-x-0 before:top-0 before:h-1 " + toneClass[tone],
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
        {icon && <CardAction className="text-muted-foreground">{icon}</CardAction>}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {delta !== undefined && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant={good ? "success" : "destructive"}>
              {up ? <ArrowUpRightIcon data-icon="inline-start" /> : <ArrowDownRightIcon data-icon="inline-start" />}
              {Math.abs(delta).toLocaleString("ru-RU")}%
            </Badge>
            {deltaLabel}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
