import * as React from "react"
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon } from "lucide-react"
import { cn } from "cn"

/*
 * Перетаскивание (dnd-kit): мышь, касание (долгое нажатие 200 мс — чтобы не мешать прокрутке)
 * и клавиатура (Пробел — взять, стрелки — двигать, Пробел — положить, Esc — отмена).
 * Спецификация: docs/03-components.md → WidgetBoard / KanbanBoard / SortableList.
 */

export function useDndSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
}

const screenReaderInstructions = {
  draggable:
    "Чтобы взять элемент, нажмите Пробел или Enter. Перемещайте стрелками. Пробел или Enter — положить, Escape — отменить.",
}

function announcements(label: (id: UniqueIdentifier) => string): Announcements {
  return {
    onDragStart: ({ active }) => `Взят элемент «${label(active.id)}».`,
    onDragOver: ({ active, over }) => (over ? `«${label(active.id)}» над «${label(over.id)}».` : `«${label(active.id)}» вне области.`),
    onDragEnd: ({ active, over }) => (over ? `«${label(active.id)}» перемещён.` : `«${label(active.id)}» положен на место.`),
    onDragCancel: ({ active }) => `Перемещение «${label(active.id)}» отменено.`,
  }
}

/* ── Ручка перетаскивания ── */

export function DragHandle({
  listeners,
  attributes,
  label,
  className,
}: {
  listeners?: ReturnType<typeof useSortable>["listeners"]
  attributes?: ReturnType<typeof useSortable>["attributes"]
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      aria-label={`Переместить: ${label}`}
      className={cn(
        "flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing pointer-coarse:size-11",
        className
      )}
    >
      <GripVerticalIcon className="size-4" />
    </button>
  )
}

/* ─────────────────────────── SortableList ─────────────────────────── */

function SortableRow<T extends { id: string }>({
  item,
  index,
  label,
  render,
}: {
  item: T
  index: number
  label: string
  render: (item: T, index: number) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 border-b bg-card px-2 py-2 last:border-b-0",
        isDragging && "relative z-10 rounded-lg border shadow-[0_8px_24px_-8px_oklch(0_0_0/0.3)]"
      )}
    >
      <DragHandle listeners={listeners} attributes={attributes} label={label} />
      {render(item, index)}
    </li>
  )
}

export function SortableList<T extends { id: string }>({
  items,
  onChange,
  getLabel,
  renderItem,
  className,
}: {
  items: T[]
  onChange: (items: T[]) => void
  getLabel: (item: T) => string
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}) {
  const sensors = useDndSensors()
  const label = (id: UniqueIdentifier) => {
    const it = items.find((i) => i.id === id)
    return it ? getLabel(it) : String(id)
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      accessibility={{ announcements: announcements(label), screenReaderInstructions }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          const from = items.findIndex((i) => i.id === active.id)
          const to = items.findIndex((i) => i.id === over.id)
          onChange(arrayMove(items, from, to))
        }
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className={cn("overflow-hidden rounded-xl border bg-card", className)}>
          {items.map((it, i) => <SortableRow key={it.id} item={it} index={i} label={getLabel(it)} render={renderItem} />)}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

/* ─────────────────────────── WidgetBoard ─────────────────────────── */

export type WidgetSize = 1 | 2 | 3
export type WidgetItem = { id: string; type: string; size: WidgetSize }

const SPAN: Record<WidgetSize, string> = {
  1: "lg:col-span-1",
  2: "md:col-span-2 lg:col-span-2",
  3: "md:col-span-2 lg:col-span-3",
}

function SortableWidget({
  item,
  editing,
  label,
  render,
}: {
  item: WidgetItem
  editing: boolean
  label: string
  render: (item: WidgetItem, handle: React.ReactNode) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: !editing })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "min-w-0",
        SPAN[item.size],
        editing && "rounded-xl outline-2 outline-offset-2 outline-dashed outline-border",
        isDragging && "opacity-40"
      )}
    >
      {render(item, editing ? <DragHandle listeners={listeners} attributes={attributes} label={label} /> : null)}
    </div>
  )
}

export function WidgetBoard({
  items,
  onChange,
  editing,
  getLabel,
  renderWidget,
  renderOverlay,
}: {
  items: WidgetItem[]
  onChange: (items: WidgetItem[]) => void
  editing: boolean
  getLabel: (item: WidgetItem) => string
  /** handle — ручка перетаскивания (только в режиме настройки), разместите в шапке виджета. */
  renderWidget: (item: WidgetItem, handle: React.ReactNode) => React.ReactNode
  renderOverlay?: (item: WidgetItem) => React.ReactNode
}) {
  const sensors = useDndSensors()
  const [active, setActive] = React.useState<WidgetItem | null>(null)
  const label = (id: UniqueIdentifier) => {
    const it = items.find((i) => i.id === id)
    return it ? getLabel(it) : String(id)
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      accessibility={{ announcements: announcements(label), screenReaderInstructions }}
      onDragStart={(e: DragStartEvent) => setActive(items.find((i) => i.id === e.active.id) ?? null)}
      onDragCancel={() => setActive(null)}
      onDragEnd={({ active: a, over }: DragEndEvent) => {
        setActive(null)
        if (over && a.id !== over.id) {
          onChange(arrayMove(items, items.findIndex((i) => i.id === a.id), items.findIndex((i) => i.id === over.id)))
        }
      }}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => <SortableWidget key={it.id} item={it} editing={editing} label={getLabel(it)} render={renderWidget} />)}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" }}>
        {active ? (
          <div className="rotate-1 cursor-grabbing rounded-xl shadow-[0_16px_40px_-12px_oklch(0_0_0/0.35)]">
            {renderOverlay ? renderOverlay(active) : renderWidget(active, null)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

/* ─────────────────────────── KanbanBoard ─────────────────────────── */

export type KanbanColumn = { id: string; title: string; accent?: string }

function KanbanCard<T extends { id: string }>({
  item,
  label,
  render,
}: {
  item: T
  label: string
  render: (item: T, handle: React.ReactNode) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition }} className={cn(isDragging && "opacity-40")}>
      {render(item, <DragHandle listeners={listeners} attributes={attributes} label={label} className="-my-1 -mr-1" />)}
    </div>
  )
}

function KanbanLane({ column, count, children }: { column: KanbanColumn; count: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  return (
    <section
      aria-label={column.title}
      className={cn(
        "flex w-[85vw] max-w-80 shrink-0 snap-start flex-col rounded-xl bg-muted/60 transition-colors sm:w-72",
        isOver && "bg-muted"
      )}
    >
      <header className="flex items-center gap-2 px-3 pt-3 pb-2">
        {column.accent && <span className="size-2 rounded-full" style={{ background: column.accent }} />}
        <h3 className="flex-1 text-sm font-medium">{column.title}</h3>
        <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
      </header>
      <div ref={setNodeRef} className="flex min-h-24 flex-1 flex-col gap-2 px-2 pb-2">
        {children}
      </div>
    </section>
  )
}

export function KanbanBoard<T extends { id: string; column: string }>({
  columns,
  items,
  onChange,
  getLabel,
  renderCard,
}: {
  columns: KanbanColumn[]
  items: T[]
  onChange: (items: T[]) => void
  getLabel: (item: T) => string
  renderCard: (item: T, handle: React.ReactNode) => React.ReactNode
}) {
  const sensors = useDndSensors()
  const [active, setActive] = React.useState<T | null>(null)
  const colIds = new Set(columns.map((c) => c.id))
  const label = (id: UniqueIdentifier) => {
    if (colIds.has(String(id))) return columns.find((c) => c.id === id)?.title ?? String(id)
    const it = items.find((i) => i.id === id)
    return it ? getLabel(it) : String(id)
  }
  const columnOf = (id: UniqueIdentifier) => (colIds.has(String(id)) ? String(id) : items.find((i) => i.id === id)?.column)

  const onDragOver = ({ active: a, over }: DragOverEvent) => {
    if (!over) return
    const from = columnOf(a.id)
    const to = columnOf(over.id)
    if (!from || !to || from === to) return
    // переносим карточку в другую колонку на лету — чтобы она «раздвигала» соседей
    const moved = items.map((i) => (i.id === a.id ? { ...i, column: to } : i))
    const fromIdx = moved.findIndex((i) => i.id === a.id)
    const overIdx = colIds.has(String(over.id)) ? moved.length - 1 : moved.findIndex((i) => i.id === over.id)
    onChange(arrayMove(moved, fromIdx, overIdx))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      accessibility={{ announcements: announcements(label), screenReaderInstructions }}
      onDragStart={(e) => setActive(items.find((i) => i.id === e.active.id) ?? null)}
      onDragCancel={() => setActive(null)}
      onDragOver={onDragOver}
      onDragEnd={({ active: a, over }) => {
        setActive(null)
        if (!over || a.id === over.id || colIds.has(String(over.id))) return
        const from = items.findIndex((i) => i.id === a.id)
        const to = items.findIndex((i) => i.id === over.id)
        if (items[from]?.column === items[to]?.column) onChange(arrayMove(items, from, to))
      }}
    >
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {columns.map((col) => {
          const colItems = items.filter((i) => i.column === col.id)
          return (
            <KanbanLane key={col.id} column={col} count={colItems.length}>
              <SortableContext items={colItems} strategy={verticalListSortingStrategy}>
                {colItems.map((it) => <KanbanCard key={it.id} item={it} label={getLabel(it)} render={renderCard} />)}
              </SortableContext>
              {colItems.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                  Перетащите сюда
                </div>
              )}
            </KanbanLane>
          )
        })}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" }}>
        {active ? <div className="rotate-2 cursor-grabbing shadow-[0_16px_40px_-12px_oklch(0_0_0/0.35)]">{renderCard(active, null)}</div> : null}
      </DragOverlay>
    </DndContext>
  )
}
