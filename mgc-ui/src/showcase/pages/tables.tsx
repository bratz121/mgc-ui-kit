import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  ArchiveIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
  SirenIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react"
import { toast } from "sonner"

import { DataTable, DataTableColumnHeader, selectColumn, type FacetFilter } from "@/components/mgc/data-table"
import { StatusBadge, STATUS_LIST } from "@/components/mgc/status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"
import { AREAS, PRIORITY_LABEL, REQUESTS, type Priority, type Request } from "../data"

/* ── Ячейки ── */

const PRIORITY_ICON: Record<Priority, React.ReactNode> = {
  critical: <SirenIcon className="size-4 text-destructive" />,
  high: <SignalHighIcon className="size-4 text-foreground" />,
  normal: <SignalMediumIcon className="size-4 text-muted-foreground" />,
  low: <SignalLowIcon className="size-4 text-muted-foreground" />,
}

export function PriorityCell({ p }: { p: Priority }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {PRIORITY_ICON[p]}
      <span className={p === "critical" ? "font-medium text-destructive" : undefined}>{PRIORITY_LABEL[p]}</span>
    </span>
  )
}

export function RowActions({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()} />}
      >
        <MoreHorizontalIcon />
        <span className="sr-only">Действия с {id}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuGroup>
          <DropdownMenuItem><PencilIcon />Редактировать</DropdownMenuItem>
          <DropdownMenuItem><UserIcon />Назначить исполнителя</DropdownMenuItem>
          <DropdownMenuItem><ArchiveIcon />В архив</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => toast(`Заявка ${id} удалена`)}><Trash2Icon />Удалить</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ── Колонки реестра заявок ── */

export const requestColumns: ColumnDef<Request, unknown>[] = [
  selectColumn<Request>(),
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Номер" />,
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
    enableHiding: false,
    meta: { label: "Номер", mobile: "subtitle" },
  },
  {
    accessorKey: "equipment",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Оборудование" />,
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col">
        <span className="max-w-56 truncate font-medium">{row.original.equipment}</span>
        <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>
      </div>
    ),
    meta: { label: "Оборудование", mobile: "title" },
  },
  {
    id: "area",
    accessorKey: "area",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Участок" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.area}</span>,
    meta: { label: "Участок", hideBelow: "lg" },
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Приоритет" />,
    cell: ({ row }) => <PriorityCell p={row.original.priority} />,
    sortingFn: (a, b) => {
      const o: Priority[] = ["critical", "high", "normal", "low"]
      return o.indexOf(a.original.priority) - o.indexOf(b.original.priority)
    },
    meta: { label: "Приоритет", hideBelow: "md" },
  },
  {
    accessorKey: "downtime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Простой, мин" />,
    cell: ({ row }) => row.original.downtime.toLocaleString("ru-RU"),
    meta: { label: "Простой, мин", align: "right" },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Исполнитель" />,
    cell: ({ row }) => <span className={row.original.assignee === "—" ? "text-muted-foreground" : undefined}>{row.original.assignee}</span>,
    meta: { label: "Исполнитель", hideBelow: "xl" },
  },
  {
    accessorKey: "createdTs",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Создана" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.created}</span>,
    meta: { label: "Создана" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Статус" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    meta: { label: "Статус", mobile: "badge" },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
    meta: { mobile: "hidden" },
  },
]

export const requestFacets: FacetFilter[] = [
  { columnId: "status", title: "Статус", options: STATUS_LIST.map((s) => ({ value: s.key, label: s.label })) },
  { columnId: "priority", title: "Приоритет", options: (Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => ({ value: p, label: PRIORITY_LABEL[p], icon: PRIORITY_ICON[p] })) },
  { columnId: "area", title: "Участок", options: AREAS.map((a) => ({ value: a, label: a })) },
]

/* ── Карточка заявки в боковой панели ── */

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0">{children}</span>
    </div>
  )
}

export function RequestSheet({ request, onClose }: { request: Request | null; onClose: () => void }) {
  return (
    <Sheet open={!!request} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="sm:max-w-md">
        {request && (
          <>
            <SheetHeader>
              <SheetTitle className="font-mono">{request.id}</SheetTitle>
              <SheetDescription>{request.equipment} {request.code}</SheetDescription>
            </SheetHeader>
            <div className="divide-y px-4">
              <Detail label="Статус"><StatusBadge status={request.status} /></Detail>
              <Detail label="Приоритет"><PriorityCell p={request.priority} /></Detail>
              <Detail label="Участок">{request.area}</Detail>
              <Detail label="Простой"><span className="tabular-nums">{request.downtime} мин</span></Detail>
              <Detail label="Исполнитель">{request.assignee}</Detail>
              <Detail label="Создана"><span className="tabular-nums">{request.created}</span></Detail>
            </div>
            <SheetFooter className="flex-row justify-end">
              <Button variant="outline"><PencilIcon data-icon="inline-start" />Изменить</Button>
              <Button>Закрыть заявку</Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

/* ── Реестр целиком (используется на странице и в шаблоне) ── */

export function RequestsDataTable({ maxHeight }: { maxHeight?: string }) {
  const [open, setOpen] = React.useState<Request | null>(null)
  return (
    <>
      <DataTable
        columns={requestColumns}
        data={REQUESTS}
        getRowId={(r) => r.id}
        searchPlaceholder="Номер, оборудование, код"
        facets={requestFacets}
        onRowClick={setOpen}
        maxHeight={maxHeight}
        toolbarActions={
          <Button variant="outline" onClick={() => toast("Формируем Excel…")}>
            <DownloadIcon data-icon="inline-start" /><span className="max-sm:sr-only">Экспорт</span>
          </Button>
        }
        bulkActions={(rows, clear) => (
          <>
            <Button size="sm" variant="outline" onClick={() => { toast.success(`Назначено: ${rows.length}`); clear() }}><UserIcon data-icon="inline-start" />Назначить</Button>
            <Button size="sm" variant="outline" onClick={() => { toast(`В архив: ${rows.length}`); clear() }}><ArchiveIcon data-icon="inline-start" />В архив</Button>
            <Button size="sm" variant="destructive" onClick={() => { toast(`Удалено: ${rows.length}`); clear() }}><Trash2Icon data-icon="inline-start" />Удалить</Button>
          </>
        )}
      />
      <RequestSheet request={open} onClose={() => setOpen(null)} />
    </>
  )
}

/* ── Компактная таблица для блоков дашборда ── */

export function RecentRequests({ rows }: { rows: Request[] }) {
  return (
    <Table data-density="compact">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Номер</TableHead>
          <TableHead>Оборудование</TableHead>
          <TableHead className="text-right max-md:hidden">Простой, мин</TableHead>
          <TableHead>Статус</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs">{r.id}</TableCell>
            <TableCell className="max-w-48">
              <div className="truncate">{r.equipment}</div>
              <div className="font-mono text-xs text-muted-foreground">{r.code}</div>
            </TableCell>
            <TableCell className="text-right tabular-nums max-md:hidden">{r.downtime}</TableCell>
            <TableCell><StatusBadge status={r.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/* ── Страница ── */

export function TablesPage() {
  const [loading, setLoading] = React.useState(false)
  return (
    <DocPage
      title="Таблицы"
      lead="DataTable — основной способ работы со списком сущностей: поиск, фильтры по значениям, сортировка, выбор колонок и плотности, массовые действия, пагинация. Узкий экран — карточки вместо горизонтальной прокрутки. Клик по строке открывает карточку записи сбоку."
    >
      <DocSection title="DataTable: реестр заявок" description="120 заявок. Попробуйте: фильтр «Статус», сортировку по «Простой», выбор строк, меню «Вид». Сузьте окно — таблица станет списком карточек.">
        <Example viewports className="block p-3">
          <RequestsDataTable />
        </Example>
      </DocSection>

      <DocSection title="Состояния: загрузка и пусто">
        <div className="flex items-center gap-3">
          <Switch id="dt-loading" checked={loading} onCheckedChange={setLoading} />
          <label htmlFor="dt-loading" className="text-sm">Показать загрузку</label>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <DataTable columns={requestColumns.slice(0, 5)} data={REQUESTS.slice(0, 4)} loading={loading} searchPlaceholder="Поиск" initialPageSize={5} />
          <DataTable columns={requestColumns.slice(1, 5)} data={[]} emptyTitle="Заявок нет" emptyDescription="За выбранный период на участке не было заявок на ремонт." />
        </div>
      </DocSection>

      <DocSection title="Закреплённая шапка" description="maxHeight — таблица прокручивается внутри, шапка остаётся на месте. Для экранов-мониторов и длинных списков без пагинации.">
        <DataTable columns={requestColumns.filter((c) => c.id !== "select")} data={REQUESTS} initialPageSize={50} pageSizeOptions={[50, 100]} maxHeight="22rem" initialDensity="compact" />
      </DocSection>

      <DocSection title="Простая таблица" description="Table без DataTable — для коротких фиксированных списков в карточках дашборда (до 10 строк, без фильтров). На узком экране второстепенные колонки скрываются (max-md:hidden).">
        <Example className="block p-0" code={`<Table data-density="compact">\n  <TableHeader>…</TableHeader>\n  <TableBody>…</TableBody>\n</Table>`}>
          <RecentRequests rows={REQUESTS.slice(0, 5)} />
        </Example>
      </DocSection>

      <DocSection title="Описание колонок">
        <Example
          className="block"
          code={`const columns: ColumnDef<Request, unknown>[] = [
  selectColumn<Request>(),
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Номер" />,
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
    meta: { label: "Номер", mobile: "subtitle" },   // роль в карточке на телефоне
  },
  {
    accessorKey: "downtime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Простой, мин" />,
    meta: { label: "Простой, мин", align: "right" }, // числа — вправо, tabular-nums
  },
  { id: "status", accessorKey: "status", meta: { label: "Статус", mobile: "badge" }, … },
]

<DataTable
  columns={columns}
  data={rows}
  facets={[{ columnId: "status", title: "Статус", options }]}
  onRowClick={openSheet}
  bulkActions={(rows, clear) => <Button size="sm">Назначить</Button>}
  toolbarActions={<Button variant="outline">Экспорт</Button>}
/>`}
        >
          <span className="text-sm text-muted-foreground">Код описания колонок и вызова — по кнопке «Код».</span>
        </Example>
        <PropsTable
          rows={[
            { name: "columns / data", values: "ColumnDef[] / T[]", note: "Колонки TanStack Table v8 и данные" },
            { name: "facets", values: "FacetFilter[]", note: "Фильтры по значениям с поиском и счётчиками" },
            { name: "onRowClick", values: "(row) => void", note: "Открыть карточку записи (Sheet справа)" },
            { name: "bulkActions", values: "(rows, clear) => ReactNode", note: "Панель действий при выделении строк" },
            { name: "toolbarActions", values: "ReactNode", note: "Кнопки справа в тулбаре" },
            { name: "initialDensity", values: "compact | default | comfortable", note: "Плотность; пользователь меняет в «Вид»" },
            { name: "maxHeight", values: "CSS-длина", note: "Внутренняя прокрутка + закреплённая шапка" },
            { name: "loading", values: "boolean", note: "Скелетон вместо строк" },
            { name: "meta.align", values: "left | right", note: "right — числа" },
            { name: "meta.mobile", values: "title | subtitle | badge | hidden", note: "Роль поля в карточке на узком экране" },
          ]}
        />
      </DocSection>

      <Rules
        do={[
          "Первая колонка — идентификатор моноширинным; числа — вправо, с единицей в шапке.",
          "Действия строки — в меню «⋯»; частые массовые — в панели выделения.",
          "Клик по строке — карточка в Sheet; таблица остаётся видна.",
          "Задайте meta.mobile — на телефоне строка станет понятной карточкой.",
          "Пустой результат фильтра — с кнопкой «Сбросить фильтры».",
        ]}
        dont={[
          "Не используйте горизонтальную прокрутку как решение для телефона.",
          "Не ставьте больше 2 кнопок прямо в строку.",
          "Не красьте строки целиком по статусу — статус несёт StatusBadge.",
          "Не используйте зебру и вертикальные линии.",
          "Не выводите сотни строк без пагинации или закреплённой шапки.",
        ]}
      />
    </DocPage>
  )
}

