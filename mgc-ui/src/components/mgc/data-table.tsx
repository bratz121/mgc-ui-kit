import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type RowData,
  type SortingState,
  type Table as TanTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  PlusCircleIcon,
  SearchIcon,
  Settings2Icon,
  XIcon,
} from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/*
 * DataTable — таблица данных кита MGC (TanStack Table v8).
 * Спецификация: docs/03-components.md → DataTable.
 *
 * Широкий контейнер — таблица; узкий (< 640px, container query) — карточки.
 * Мета колонки (columnDef.meta): label — подпись в меню колонок и карточках,
 * align: "right" — числа, mobile: "title" | "badge" | "hidden" — роль в карточке.
 */

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
    align?: "left" | "right"
    mobile?: "title" | "subtitle" | "badge" | "hidden"
    /** Скрывать колонку, когда контейнер таблицы уже порога: "md" < 768px, "lg" < 896px, "xl" < 1024px. */
    hideBelow?: "md" | "lg" | "xl"
  }
}

export type Density = "compact" | "default" | "comfortable"

export type FacetFilter = {
  columnId: string
  title: string
  options: { value: string; label: string; icon?: React.ReactNode }[]
}

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  getRowId?: (row: TData) => string
  searchPlaceholder?: string
  facets?: FacetFilter[]
  /** Кнопки справа в тулбаре (экспорт, «Новая заявка»). */
  toolbarActions?: React.ReactNode
  /** Действия над выбранными строками — показываются в панели при выделении. */
  bulkActions?: (rows: TData[], clear: () => void) => React.ReactNode
  onRowClick?: (row: TData) => void
  loading?: boolean
  pageSizeOptions?: number[]
  initialPageSize?: number
  initialDensity?: Density
  /** Высота области прокрутки — включает закреплённую шапку. */
  maxHeight?: string
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

/* ── Шапка колонки с сортировкой ── */

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  const right = column.columnDef.meta?.align === "right"
  if (!column.getCanSort()) {
    return <span className={cn(right && "block text-right", className)}>{title}</span>
  }
  const sorted = column.getIsSorted()
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ChevronsUpDownIcon
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "-mx-1.5 inline-flex h-7 items-center gap-1 rounded-md px-1.5 transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        sorted && "text-foreground",
        right && "ml-auto flex flex-row-reverse",
        className
      )}
      title={sorted === "asc" ? "По возрастанию — нажмите для убывания" : sorted === "desc" ? "По убыванию — нажмите, чтобы сбросить" : "Сортировать"}
    >
      {title}
      <Icon className={cn("size-3.5", !sorted && "opacity-50")} />
    </button>
  )
}

/* ── Колонка выбора строк ── */

export function selectColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Выбрать все на странице"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Выбрать строку"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { mobile: "hidden" },
  }
}

/* ── Фильтр по значениям ── */

function FacetedFilter<TData>({ table, facet }: { table: TanTable<TData>; facet: FacetFilter }) {
  const column = table.getColumn(facet.columnId)
  const counts = column?.getFacetedUniqueValues()
  const selected = new Set((column?.getFilterValue() as string[] | undefined) ?? [])
  if (!column) return null
  const set = (next: Set<string>) => column.setFilterValue(next.size ? Array.from(next) : undefined)
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="border-dashed" />}>
        <PlusCircleIcon data-icon="inline-start" />
        {facet.title}
        {selected.size > 0 && (
          <>
            <Separator orientation="vertical" className="mx-0.5 h-4 self-center!" />
            {selected.size > 2 ? (
              <Badge variant="secondary">{selected.size} выбрано</Badge>
            ) : (
              facet.options
                .filter((o) => selected.has(o.value))
                .map((o) => <Badge key={o.value} variant="secondary">{o.label}</Badge>)
            )}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          <CommandInput placeholder={facet.title} />
          <CommandList>
            <CommandEmpty>Ничего не найдено</CommandEmpty>
            <CommandGroup>
              {facet.options.map((o) => {
                const on = selected.has(o.value)
                return (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    onSelect={() => {
                      const next = new Set(selected)
                      if (on) next.delete(o.value)
                      else next.add(o.value)
                      set(next)
                    }}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-[4px] border border-input",
                        on && "border-primary bg-primary text-primary-foreground"
                      )}
                    >
                      {on && <CheckIcon className="size-3" />}
                    </span>
                    {o.icon}
                    <span className="flex-1">{o.label}</span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {counts?.get(o.value) ?? 0}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => set(new Set())} className="justify-center">
                    Сбросить фильтр
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const HIDE_BELOW = { md: "@max-3xl/dt:hidden", lg: "@max-4xl/dt:hidden", xl: "@max-5xl/dt:hidden" } as const

const facetFilterFn = (row: Row<unknown>, id: string, value: string[]) =>
  value.includes(String(row.getValue(id)))

/* ── Настройки вида ── */

function ViewOptions<TData>({
  table,
  density,
  setDensity,
}: {
  table: TanTable<TData>
  density: Density
  setDensity: (d: Density) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <Settings2Icon data-icon="inline-start" />
        <span className="max-sm:sr-only">Вид</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Колонки</DropdownMenuLabel>
          {table
            .getAllColumns()
            .filter((c) => c.getCanHide())
            .map((c) => (
              <DropdownMenuCheckboxItem
                key={c.id}
                checked={c.getIsVisible()}
                onCheckedChange={(v) => c.toggleVisibility(!!v)}
              >
                {c.columnDef.meta?.label ?? c.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Плотность строк</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(v as Density)}>
            <DropdownMenuRadioItem value="compact">Компактно</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="default">Обычно</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">Просторно</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ── Пагинация ── */

function Pager<TData>({ table, pageSizeOptions }: { table: TanTable<TData>; pageSizeOptions: number[] }) {
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)
  const sizes = pageSizeOptions.map((n) => ({ label: String(n), value: n }))
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t px-4 py-3 text-sm">
      <span className="text-muted-foreground tabular-nums">
        {from}–{to} из {total.toLocaleString("ru-RU")}
      </span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground max-sm:hidden">Строк на странице</span>
          <Select items={sizes} value={pageSize} onValueChange={(v) => table.setPageSize(Number(v))}>
            <SelectTrigger size="sm" className="w-18" aria-label="Строк на странице"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sizes.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <span className="tabular-nums">
          Стр. {table.getPageCount() === 0 ? 0 : pageIndex + 1} из {table.getPageCount()}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" className="max-sm:hidden" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <ChevronsLeftIcon /><span className="sr-only">Первая страница</span>
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeftIcon /><span className="sr-only">Предыдущая страница</span>
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRightIcon /><span className="sr-only">Следующая страница</span>
          </Button>
          <Button variant="outline" size="icon-sm" className="max-sm:hidden" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <ChevronsRightIcon /><span className="sr-only">Последняя страница</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Карточка строки для узкого контейнера ── */

function MobileCard<TData>({ row, onClick }: { row: Row<TData>; onClick?: () => void }) {
  const cells = row.getVisibleCells().filter((c) => c.column.columnDef.meta?.mobile !== "hidden")
  const by = (role: string) => cells.find((c) => c.column.columnDef.meta?.mobile === role)
  const title = by("title")
  const subtitle = by("subtitle")
  const badge = by("badge")
  const rest = cells.filter((c) => !["title", "subtitle", "badge"].includes(c.column.columnDef.meta?.mobile ?? ""))
  const select = row.getVisibleCells().find((c) => c.column.id === "select")
  const actions = row.getVisibleCells().find((c) => c.column.id === "actions")
  return (
    <div
      data-state={row.getIsSelected() ? "selected" : undefined}
      className={cn(
        "flex flex-col gap-3 border-b px-4 py-3.5 last:border-b-0 data-[state=selected]:bg-module-soft",
        onClick && "cursor-pointer active:bg-muted/60"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {select && <div className="pt-0.5">{flexRender(select.column.columnDef.cell, select.getContext())}</div>}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {subtitle && <div className="text-xs text-muted-foreground">{flexRender(subtitle.column.columnDef.cell, subtitle.getContext())}</div>}
          {title && <div className="font-medium">{flexRender(title.column.columnDef.cell, title.getContext())}</div>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {badge && flexRender(badge.column.columnDef.cell, badge.getContext())}
          {actions && <div className="-my-1 -mr-2">{flexRender(actions.column.columnDef.cell, actions.getContext())}</div>}
        </div>
      </div>
      {rest.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {rest.map((c) =>
            c.column.id === "actions" ? null : (
              <div key={c.id} className="flex min-w-0 flex-col">
                <dt className="text-xs text-muted-foreground">{c.column.columnDef.meta?.label ?? c.column.id}</dt>
                <dd className="truncate">{flexRender(c.column.columnDef.cell, c.getContext())}</dd>
              </div>
            )
          )}
        </dl>
      )}
    </div>
  )
}

/* ── Таблица ── */

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  searchPlaceholder = "Поиск",
  facets = [],
  toolbarActions,
  bulkActions,
  onRowClick,
  loading,
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize = 10,
  initialDensity = "default",
  maxHeight,
  emptyTitle = "Ничего не найдено",
  emptyDescription = "Измените условия поиска или сбросьте фильтры.",
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [density, setDensity] = React.useState<Density>(initialDensity)

  const facetIds = React.useMemo(() => new Set(facets.map((f) => f.columnId)), [facets])
  const cols = React.useMemo(
    () => columns.map((c) => (c.id && facetIds.has(c.id) ? { ...c, filterFn: facetFilterFn as never } : c)),
    [columns, facetIds]
  )

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table намеренно возвращает изменяемый объект
  const table = useReactTable({
    data,
    columns: cols,
    getRowId,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    initialState: { pagination: { pageSize: initialPageSize } },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const filtered = columnFilters.length > 0 || globalFilter !== ""
  const selected = table.getSelectedRowModel().rows.map((r) => r.original)
  const rows = table.getRowModel().rows
  const visibleCount = table.getVisibleLeafColumns().length
  const reset = () => {
    table.resetColumnFilters()
    setGlobalFilter("")
  }

  return (
    <div className={cn("@container/dt overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10", className)}>
      {/* Тулбар */}
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <InputGroup className="w-full @2xl/dt:w-72">
          <InputGroupAddon><SearchIcon /></InputGroupAddon>
          <InputGroupInput
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            aria-label={searchPlaceholder}
          />
          {globalFilter && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" onClick={() => setGlobalFilter("")}>
                <XIcon /><span className="sr-only">Очистить поиск</span>
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        {facets.map((f) => <FacetedFilter key={f.columnId} table={table} facet={f} />)}
        {filtered && (
          <Button variant="ghost" onClick={reset}>
            Сбросить<XIcon data-icon="inline-end" />
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <ViewOptions table={table} density={density} setDensity={setDensity} />
          {toolbarActions}
        </div>
      </div>

      {/* Панель массовых действий */}
      {bulkActions && selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b bg-module-soft px-4 py-2 animate-in fade-in duration-150">
          <span className="text-sm font-medium tabular-nums">Выбрано: {selected.length}</span>
          <div className="flex flex-wrap items-center gap-2">{bulkActions(selected, () => table.resetRowSelection())}</div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => table.resetRowSelection()}>
            Снять выделение
          </Button>
        </div>
      )}

      {/* Таблица — широкий контейнер */}
      <div
        className={cn("@max-xl/dt:hidden", maxHeight && "overflow-auto overscroll-contain")}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <Table data-density={density} containerClassName={cn(maxHeight && "overflow-visible")}>
          <TableHeader className={cn(maxHeight && "sticky top-0 z-[1] [&_th]:bg-muted")}>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((h) => {
                  const sorted = h.column.getIsSorted()
                  return (
                    <TableHead
                      key={h.id}
                      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                      className={cn(
                        h.column.columnDef.meta?.align === "right" && "text-right",
                        h.column.columnDef.meta?.hideBelow && HIDE_BELOW[h.column.columnDef.meta.hideBelow]
                      )}
                    >
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 6 }, (_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    {Array.from({ length: visibleCount }, (_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full max-w-32" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.columnDef.meta?.align === "right" && "text-right tabular-nums",
                          cell.column.columnDef.meta?.hideBelow && HIDE_BELOW[cell.column.columnDef.meta.hideBelow]
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Карточки — узкий контейнер */}
      <div className="@xl/dt:hidden">
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2 border-b px-4 py-4"><Skeleton className="h-3 w-24" /><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-32" /></div>
            ))
          : rows.map((row) => (
              <MobileCard key={row.id} row={row} onClick={onRowClick ? () => onRowClick(row.original) : undefined} />
            ))}
      </div>

      {!loading && rows.length === 0 && (
        <Empty className="border-0 py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon"><SearchIcon /></EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
          {filtered && (
            <EmptyContent><Button variant="outline" onClick={reset}>Сбросить фильтры</Button></EmptyContent>
          )}
        </Empty>
      )}

      <Pager table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  )
}
