import type { Status } from "@/components/mgc/status-badge"

/* Демо-данные витрины: заявки на ремонт оборудования. Детерминированные — без Math.random. */

export type Priority = "critical" | "high" | "normal" | "low"

export type Request = {
  id: string
  equipment: string
  code: string
  area: string
  downtime: number
  created: string
  createdTs: number
  status: Status
  priority: Priority
  assignee: string
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  critical: "Критичный",
  high: "Высокий",
  normal: "Обычный",
  low: "Низкий",
}

const EQUIPMENT: [string, string, string][] = [
  ["Пресс гидравлический", "ПР-114", "Линия сборки №1"],
  ["Робот сварочный", "РС-07", "Сварочный участок"],
  ["Конвейер ленточный", "КЛ-22", "Линия сборки №2"],
  ["Камера окрасочная", "КО-03", "Окрасочный цех"],
  ["Гайковёрт многошпиндельный", "ГМ-41", "Линия сборки №1"],
  ["Стенд проверки ДВС", "СТ-02", "Испытания"],
  ["Пресс гидравлический", "ПР-109", "Линия сборки №2"],
  ["Кран-балка", "КБ-11", "Склад комплектующих"],
  ["Робот сварочный", "РС-08", "Сварочный участок"],
  ["Компрессор винтовой", "КВ-05", "Энергоцех"],
]
const ASSIGNEES = ["Иванов А. С.", "Петрова Е. В.", "Сидоров К. М.", "Ким Д. А.", "—"]
const STATUSES: Status[] = ["new", "in_progress", "in_progress", "waiting", "done", "done", "done", "stopped", "cancelled"]
const PRIORITIES: Priority[] = ["normal", "high", "normal", "low", "critical", "normal", "high"]

function seq(i: number, n: number, k: number) {
  return (i * k + Math.floor(i / 3)) % n
}

const base = new Date(2026, 10, 27, 8, 14).getTime()

export const REQUESTS: Request[] = Array.from({ length: 120 }, (_, i) => {
  const [equipment, code, area] = EQUIPMENT[seq(i, EQUIPMENT.length, 7)]
  const status = i === 1 ? "stopped" : i === 0 ? "in_progress" : STATUSES[seq(i, STATUSES.length, 5)]
  const ts = base - i * (2 * 3600_000 + ((i * 37) % 90) * 60_000)
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, "0")
  return {
    id: `ЗН-2026-${String(481 - i).padStart(5, "0")}`,
    equipment,
    code,
    area,
    downtime: status === "cancelled" ? 0 : (i * 23 + 8) % 140,
    created: `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`,
    createdTs: ts,
    status,
    priority: i === 1 ? "critical" : PRIORITIES[seq(i, PRIORITIES.length, 3)],
    assignee: status === "new" ? "—" : ASSIGNEES[seq(i, ASSIGNEES.length - 1, 3)],
  }
})

export const AREAS = Array.from(new Set(EQUIPMENT.map((e) => e[2])))
