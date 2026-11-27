import { Badge } from "@/components/ui/badge"

/*
 * Единый словарь статусов для внутренних систем.
 * Статус всегда = точка + текст, цвет никогда не единственный носитель смысла.
 * Спецификация: docs/03-components.md → StatusBadge.
 */
export type Status =
  | "new"
  | "in_progress"
  | "waiting"
  | "done"
  | "stopped"
  | "cancelled"

const STATUS: Record<
  Status,
  { label: string; variant: "info" | "warning" | "success" | "destructive" | "secondary" }
> = {
  new: { label: "Новая", variant: "info" },
  in_progress: { label: "В работе", variant: "warning" },
  waiting: { label: "Ожидание", variant: "secondary" },
  done: { label: "Выполнена", variant: "success" },
  stopped: { label: "Остановка", variant: "destructive" },
  cancelled: { label: "Отменена", variant: "secondary" },
}

export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const s = STATUS[status]
  return (
    <Badge variant={s.variant}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label ?? s.label}
    </Badge>
  )
}

export const STATUS_LIST = Object.entries(STATUS).map(([key, v]) => ({
  key: key as Status,
  ...v,
}))
