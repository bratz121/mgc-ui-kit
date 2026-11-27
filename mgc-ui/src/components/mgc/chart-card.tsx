import * as React from "react"
import { ChartColumnIcon, TableIcon } from "lucide-react"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/*
 * ChartCard — карточка графика с переключателем «График / Таблица».
 * Табличный вид обязателен (dataviz: доступность — данные не только цветом и формой).
 * Спецификация: docs/03-components.md → ChartCard.
 */

export type ChartTableColumn<T> = {
  key: keyof T & string
  label: string
  align?: "left" | "right"
  format?: (v: T[keyof T], row: T) => React.ReactNode
}

export function ChartCard<T extends Record<string, unknown>>({
  title,
  description,
  data,
  columns,
  action,
  footer,
  className,
  children,
}: {
  title: string
  /** Период и единицы: «Текущая неделя, шт». */
  description?: string
  data: T[]
  columns: ChartTableColumn<T>[]
  action?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  const [view, setView] = React.useState<"chart" | "table">("chart")
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CardAction className="flex items-center gap-2">
          {action}
          <ToggleGroup
            value={[view]}
            onValueChange={(v) => v[0] && setView(v[0] as "chart" | "table")}
            variant="outline"
            size="sm"
            aria-label="Вид данных"
          >
            <ToggleGroupItem value="chart" aria-label="График"><ChartColumnIcon /></ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Таблица"><TableIcon /></ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="min-w-0">
        {view === "chart" ? (
          children
        ) : (
          <div className="max-h-72 overflow-auto rounded-lg border">
            <Table data-density="compact">
              <TableHeader className="sticky top-0">
                <TableRow className="hover:bg-transparent">
                  {columns.map((c) => (
                    <TableHead key={c.key} className={c.align === "right" ? "text-right" : undefined}>{c.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((c) => (
                      <TableCell key={c.key} className={c.align === "right" ? "text-right tabular-nums" : undefined}>
                        {c.format ? c.format(row[c.key], row) : String(row[c.key] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {footer}
    </Card>
  )
}
