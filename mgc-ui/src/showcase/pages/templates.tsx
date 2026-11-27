import {
  AlertTriangleIcon,
  ClockIcon,
  FactoryIcon,
  GaugeIcon,
  PlusIcon,
} from "lucide-react"

import { StatCard } from "@/components/mgc/stat-card"
import { StatusBadge, type Status } from "@/components/mgc/status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { REQUESTS } from "../data"
import { OeeChart, OutputChart } from "./charts"
import { RecentRequests, RequestsDataTable } from "./tables"

/* ─────────────────────── Шаблон: дашборд ─────────────────────── */

export function DashboardTemplate() {
  const lines = [
    { name: "Линия сборки №1", oee: 82, status: "in_progress" as Status, label: "Работает" },
    { name: "Линия сборки №2", oee: 71, status: "in_progress" as Status, label: "Работает" },
    { name: "Сварочный участок", oee: 54, status: "stopped" as Status, label: "Остановка 14 мин" },
    { name: "Окрасочный цех", oee: 88, status: "done" as Status, label: "План выполнен" },
  ]
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">Сводка по заводу</h2>
          <p className="text-sm text-muted-foreground">Пятница, 27 ноября 2026 · 2 смена · обновлено в 14:32</p>
        </div>
        <ToggleGroup defaultValue={["shift"]} variant="outline">
          <ToggleGroupItem value="shift">Смена</ToggleGroupItem>
          <ToggleGroupItem value="day">День</ToggleGroupItem>
          <ToggleGroupItem value="week">Неделя</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Alert variant="critical">
        <AlertTriangleIcon />
        <AlertTitle>Остановка: сварочный участок, робот РС-07</AlertTitle>
        <AlertDescription>Стоит 14 мин. Заявка ЗН-2026-00480 назначена на дежурного наладчика.</AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Выпуск за смену" value="1 248" unit="шт" delta={4.2} icon={<FactoryIcon className="size-4" />} />
        <StatCard label="OEE завода" value="78,4" unit="%" delta={1.3} icon={<GaugeIcon className="size-4" />} />
        <StatCard label="Простои" value="47" unit="мин" delta={12} higherIsBetter={false} icon={<ClockIcon className="size-4" />} />
        <StatCard label="Брак" value="0,8" unit="%" delta={-0.3} higherIsBetter={false} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Выпуск: план и факт</CardTitle>
            <CardDescription>Текущая неделя, шт</CardDescription>
          </CardHeader>
          <CardContent><OutputChart /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Участки</CardTitle>
            <CardDescription>OEE за смену</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {lines.map((l) => (
              <div key={l.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{l.name}</span>
                  <span className="text-sm tabular-nums">{l.oee}%</span>
                </div>
                <Progress value={l.oee} />
                <StatusBadge status={l.status} label={l.label} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>OEE по участкам</CardTitle>
            <CardDescription>14 дней, %</CardDescription>
          </CardHeader>
          <CardContent><OeeChart /></CardContent>
        </Card>
        <Card className="gap-0 pb-0 lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Последние заявки</CardTitle>
            <CardDescription>Техобслуживание</CardDescription>
            <CardAction><Button variant="outline" size="sm">Все заявки</Button></CardAction>
          </CardHeader>
          <RecentRequests rows={REQUESTS.slice(0, 5)} />
        </Card>
      </div>
    </div>
  )
}

/* ─────────────────────── Шаблон: реестр ─────────────────────── */

export function RegistryTemplate() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">Заявки на ремонт</h2>
          <p className="text-sm text-muted-foreground">Все участки · 180 заявок</p>
        </div>
        <Button><PlusIcon data-icon="inline-start" />Новая заявка</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Новые" value="12" tone="steel" delta={2.7} deltaLabel="к прошлой неделе" />
        <StatCard label="Ожидают запчасти" value="20" tone="ochre" delta={2.7} higherIsBetter={false} deltaLabel="к прошлой неделе" />
        <StatCard label="В работе" value="57" tone="rose" delta={-0.6} deltaLabel="к прошлой неделе" />
        <StatCard label="Выполнены" value="98" tone="olive" delta={2.9} deltaLabel="к прошлой неделе" />
      </div>

      <RequestsDataTable />
    </div>
  )
}
