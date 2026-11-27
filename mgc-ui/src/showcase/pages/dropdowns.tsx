import * as React from "react"
import {
  ArchiveIcon,
  CalendarClockIcon,
  ChevronDownIcon,
  ClipboardListIcon,
  CopyIcon,
  FactoryIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  PencilIcon,
  PlusIcon,
  PrinterIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
  UserIcon,
  WrenchIcon,
} from "lucide-react"
import { toast } from "sonner"

import { StatusBadge } from "@/components/mgc/status-badge"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DocPage, DocSection, Example, Mono, PropsTable, Rules } from "../doc"

/* ── Данные ── */

const SHIFTS = [
  { label: "Выберите смену", value: null },
  { label: "1 смена · 08:00–16:00", value: "1" },
  { label: "2 смена · 16:00–00:00", value: "2" },
  { label: "3 смена · 00:00–08:00", value: "3" },
]

const AREAS = {
  "Сборочное производство": [
    { label: "Линия сборки №1", value: "l1" },
    { label: "Линия сборки №2", value: "l2" },
    { label: "Испытания", value: "test" },
  ],
  "Кузовное производство": [
    { label: "Сварочный участок", value: "weld" },
    { label: "Окрасочный цех", value: "paint" },
  ],
}
const AREA_ITEMS = [{ label: "Все участки", value: null }, ...Object.values(AREAS).flat()]

const DEFECTS = ["Царапина ЛКП", "Непровар шва", "Подтёк краски", "Зазор вне допуска", "Отсутствует крепёж", "Повреждение уплотнителя", "Неверная маркировка"]

const EQUIPMENT = [
  {
    value: "Сборка",
    items: [
      { code: "ПР-114", label: "Пресс гидравлический" },
      { code: "ПР-109", label: "Пресс гидравлический" },
      { code: "ГМ-41", label: "Гайковёрт многошпиндельный" },
      { code: "КЛ-22", label: "Конвейер ленточный" },
    ],
  },
  {
    value: "Сварка и окраска",
    items: [
      { code: "РС-07", label: "Робот сварочный" },
      { code: "РС-08", label: "Робот сварочный" },
      { code: "КО-03", label: "Камера окрасочная" },
    ],
  },
]
type Equipment = (typeof EQUIPMENT)[number]["items"][number]

const EMPLOYEES = [
  { id: "", label: "Не назначен" },
  { id: "1042", label: "Иванов А. С. · наладчик" },
  { id: "1088", label: "Петрова Е. В. · инженер ТОиР" },
  { id: "1131", label: "Сидоров К. М. · электрик" },
  { id: "1175", label: "Ким Д. А. · мастер смены" },
]

/* ── Страница ── */

export function DropdownsPage() {
  const anchor = useComboboxAnchor()
  const [cols, setCols] = React.useState({ area: true, downtime: true, created: true, author: false })
  const [sort, setSort] = React.useState("created")
  const [cmdOpen, setCmdOpen] = React.useState(false)


  return (
    <DocPage
      title="Выпадающие списки"
      lead="Шесть способов выбрать значение или действие из списка. Выбор компонента зависит от числа вариантов, нужен ли поиск и что происходит после выбора — значение или действие."
    >
      <PropsTable
        rows={[
          { name: "Select", values: "до ~15 вариантов", note: "Выбор одного значения из короткого известного списка: смена, участок, приоритет" },
          { name: "Combobox", values: "15+ / справочник", note: "Выбор с поиском: оборудование, сотрудник, причина дефекта. Поддерживает мультивыбор чипами" },
          { name: "NativeSelect", values: "любой", note: "Терминалы в цехе, планшеты, мобильные — системный список, крупные цели" },
          { name: "DropdownMenu", values: "действия", note: "Меню действий по кнопке: экспорт, «⋯» в строке, настройки вида таблицы" },
          { name: "ContextMenu", values: "действия", note: "Те же действия по правому клику — только как дублирование, не единственный путь" },
          { name: "Command", values: "команды + поиск", note: "Палитра Ctrl+K: быстрый переход и действия для опытных пользователей" },
        ]}
      />

      {/* ── Select ── */}
      <DocSection title="Select" description={<>Base UI требует проп <Mono>items</Mono> (для подписи выбранного значения). Плейсхолдер — элемент с <Mono>value: null</Mono>.</>}>
        <Example
          className="grid gap-6 md:grid-cols-3"
          code={`const shifts = [
  { label: "Выберите смену", value: null },
  { label: "1 смена · 08:00–16:00", value: "1" },
]

<Select items={shifts} defaultValue={null}>
  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {shifts.map((s) => <SelectItem key={s.label} value={s.value}>{s.label}</SelectItem>)}
    </SelectGroup>
  </SelectContent>
</Select>`}
        >
          <Field>
            <FieldLabel>Смена</FieldLabel>
            <Select items={SHIFTS} defaultValue={null}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SHIFTS.map((s) => <SelectItem key={s.label} value={s.value}>{s.label}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>Простой список</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Участок</FieldLabel>
            <Select items={AREA_ITEMS} defaultValue={null}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={null}>Все участки</SelectItem>
                </SelectGroup>
                {Object.entries(AREAS).map(([group, items]) => (
                  <React.Fragment key={group}>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>{group}</SelectLabel>
                      {items.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                    </SelectGroup>
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>С группами</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Смены в отчёте</FieldLabel>
            <Select items={SHIFTS.slice(1)} multiple defaultValue={["1", "2"]}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    value.length === 0 ? "Не выбрано" : value.length === 3 ? "Все смены" : value.map((v) => `${v} смена`).join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SHIFTS.slice(1).map((s) => <SelectItem key={s.label} value={s.value}>{s.label}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>Множественный выбор</FieldDescription>
          </Field>
        </Example>
      </DocSection>

      {/* ── Combobox ── */}
      <DocSection title="Combobox — выбор с поиском" description="Для справочников и длинных списков. Поиск по подстроке, клавиатура, пустой результат с подсказкой.">
        <Example
          className="grid gap-6 md:grid-cols-2"
          code={`<Combobox items={equipment} itemToStringValue={(e) => \`\${e.code} \${e.label}\`}>
  <ComboboxInput placeholder="Код или название" showClear />
  <ComboboxContent>
    <ComboboxEmpty>Ничего не найдено</ComboboxEmpty>
    <ComboboxList>
      {(group, i) => (
        <ComboboxGroup key={group.value} items={group.items}>
          <ComboboxLabel>{group.value}</ComboboxLabel>
          <ComboboxCollection>
            {(e) => <ComboboxItem key={e.code} value={e}>{e.code} · {e.label}</ComboboxItem>}
          </ComboboxCollection>
          {i < equipment.length - 1 && <ComboboxSeparator />}
        </ComboboxGroup>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`}
        >
          <Field>
            <FieldLabel>Оборудование</FieldLabel>
            <Combobox items={EQUIPMENT} itemToStringValue={(e: Equipment) => `${e.code} ${e.label}`}>
              <ComboboxInput placeholder="Код или название, например РС" showClear />
              <ComboboxContent>
                <ComboboxEmpty>Оборудование не найдено</ComboboxEmpty>
                <ComboboxList>
                  {(group: (typeof EQUIPMENT)[number], i: number) => (
                    <ComboboxGroup key={group.value} items={group.items}>
                      <ComboboxLabel>{group.value}</ComboboxLabel>
                      <ComboboxCollection>
                        {(e: Equipment) => (
                          <ComboboxItem key={e.code} value={e}>
                            <span className="font-mono text-xs text-muted-foreground">{e.code}</span>
                            {e.label}
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                      {i < EQUIPMENT.length - 1 && <ComboboxSeparator />}
                    </ComboboxGroup>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldDescription>С поиском, группами и кнопкой очистки</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Дефекты</FieldLabel>
            <Combobox multiple autoHighlight items={DEFECTS} defaultValue={[DEFECTS[0], DEFECTS[2]]}>
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {(values: string[]) => (
                    <>
                      {values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}
                      <ComboboxChipsInput placeholder={values.length ? "" : "Добавьте дефект"} />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>Нет такого дефекта</ComboboxEmpty>
                <ComboboxList>
                  {(d: string) => <ComboboxItem key={d} value={d}>{d}</ComboboxItem>}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldDescription>Мультивыбор чипами</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Исполнитель</FieldLabel>
            <Combobox items={EMPLOYEES} defaultValue={EMPLOYEES[0]}>
              <ComboboxTrigger render={<Button variant="outline" className="w-full justify-between font-normal" />}>
                <span className="flex items-center gap-2 truncate">
                  <UserIcon className="size-4 text-muted-foreground" />
                  <ComboboxValue />
                </span>
                <ChevronDownIcon className="text-muted-foreground" />
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput showTrigger={false} placeholder="ФИО или табельный номер" />
                <ComboboxEmpty>Сотрудник не найден</ComboboxEmpty>
                <ComboboxList>
                  {(e: (typeof EMPLOYEES)[number]) => <ComboboxItem key={e.id} value={e}>{e.label}</ComboboxItem>}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldDescription>Кнопка-триггер, поиск внутри списка</FieldDescription>
          </Field>

          <Field data-invalid>
            <FieldLabel>Причина простоя</FieldLabel>
            <Combobox items={["Поломка", "Наладка", "Нет комплектующих", "Нет персонала", "Плановое ТО"]}>
              <ComboboxInput placeholder="Выберите причину" aria-invalid />
              <ComboboxContent>
                <ComboboxEmpty>Ничего не найдено</ComboboxEmpty>
                <ComboboxList>{(r: string) => <ComboboxItem key={r} value={r}>{r}</ComboboxItem>}</ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldDescription className="text-destructive">Укажите причину — без неё простой не закрыть</FieldDescription>
          </Field>
        </Example>
      </DocSection>

      {/* ── NativeSelect ── */}
      <DocSection title="NativeSelect — для терминалов и планшетов" description="Системный список: крупный, привычный, работает с экранной клавиатурой и в перчатках. Без поиска.">
        <Example
          className="grid gap-6 md:grid-cols-2"
          code={`<NativeSelect>
  <NativeSelectOption value="">Выберите участок</NativeSelectOption>
  <NativeSelectOptGroup label="Сборочное производство">
    <NativeSelectOption value="l1">Линия сборки №1</NativeSelectOption>
  </NativeSelectOptGroup>
</NativeSelect>`}
        >
          <Field>
            <FieldLabel htmlFor="ns-area">Участок</FieldLabel>
            <NativeSelect id="ns-area" className="w-full">
              <NativeSelectOption value="">Выберите участок</NativeSelectOption>
              {Object.entries(AREAS).map(([g, items]) => (
                <NativeSelectOptGroup key={g} label={g}>
                  {items.map((a) => <NativeSelectOption key={a.value} value={a.value}>{a.label}</NativeSelectOption>)}
                </NativeSelectOptGroup>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="ns-shift">Смена</FieldLabel>
            <NativeSelect id="ns-shift" size="sm" className="w-full">
              {SHIFTS.slice(1).map((s) => <NativeSelectOption key={s.label} value={s.value ?? ""}>{s.label}</NativeSelectOption>)}
            </NativeSelect>
          </Field>
        </Example>
      </DocSection>

      {/* ── DropdownMenu ── */}
      <DocSection title="DropdownMenu — меню действий" description="Кнопка открывает список действий. Группы разделяются, разрушающее действие — последним и красным. Поддерживает флажки, переключатели и вложенные меню.">
        <Example
          code={`<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>Вид</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>Колонки</DropdownMenuLabel>
      <DropdownMenuCheckboxItem checked={cols.area} onCheckedChange={…}>Участок</DropdownMenuCheckboxItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>Сортировка</DropdownMenuLabel>
      <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
        <DropdownMenuRadioItem value="created">По дате</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button />}>
              <PlusIcon data-icon="inline-start" />Создать<ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem><WrenchIcon />Заявку на ремонт<DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuItem><CalendarClockIcon />Плановое ТО</DropdownMenuItem>
                <DropdownMenuItem><ClipboardListIcon />Наряд-допуск</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger><FileSpreadsheetIcon />Из шаблона</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Замена масла</DropdownMenuItem>
                    <DropdownMenuItem>Проверка гидравлики</DropdownMenuItem>
                    <DropdownMenuItem>Калибровка датчиков</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <SettingsIcon data-icon="inline-start" />Вид таблицы
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Колонки</DropdownMenuLabel>
                {([["area", "Участок"], ["downtime", "Простой"], ["created", "Дата создания"], ["author", "Автор"]] as const).map(([k, l]) => (
                  <DropdownMenuCheckboxItem key={k} checked={cols[k]} onCheckedChange={(v) => setCols((c) => ({ ...c, [k]: v }))}>
                    {l}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Сортировка</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenuRadioItem value="created">По дате создания</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="downtime">По длительности простоя</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="status">По статусу</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" />}>
              <PrinterIcon data-icon="inline-start" />Экспорт
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => toast("Формируем Excel…")}>Excel (.xlsx)</DropdownMenuItem>
                <DropdownMenuItem>PDF для печати</DropdownMenuItem>
                <DropdownMenuItem disabled>1С (нет доступа)</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Example>
      </DocSection>

      {/* ── ContextMenu ── */}
      <DocSection title="ContextMenu — правый клик" description="Дублирует действия, которые уже есть в интерфейсе (кнопка «⋯»). Никогда не прячьте действие только в контекстное меню.">
        <Example className="block">
          <ContextMenu>
            <ContextMenuTrigger className="flex items-center justify-between gap-4 rounded-lg border border-dashed p-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-muted-foreground">ЗН-2026-00481</span>
                <span className="font-medium">Пресс гидравлический ПР-114</span>
              </div>
              <StatusBadge status="in_progress" />
              <span className="text-xs text-muted-foreground max-sm:hidden">Правый клик — меню</span>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-60">
              <ContextMenuGroup>
                <ContextMenuLabel>ЗН-2026-00481</ContextMenuLabel>
                <ContextMenuItem><PencilIcon />Редактировать<ContextMenuShortcut>Enter</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuItem><CopyIcon />Копировать номер<ContextMenuShortcut>Ctrl+C</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger><UserIcon />Назначить</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    {EMPLOYEES.slice(1).map((e) => <ContextMenuItem key={e.id}>{e.label}</ContextMenuItem>)}
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem><ArchiveIcon />В архив</ContextMenuItem>
                <ContextMenuItem variant="destructive"><Trash2Icon />Удалить</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </Example>
      </DocSection>

      {/* ── Command ── */}
      <DocSection title="Command — палитра команд" description={<>Поиск по разделам и действиям. В модуле открывается по <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> — так работает поиск этой витрины (кнопка в шапке).</>}>
        <Example
          className="grid gap-6 md:grid-cols-[1fr_auto]"
          code={`<CommandDialog open={open} onOpenChange={setOpen}>
  <Command>
    <CommandInput placeholder="Раздел, заявка, оборудование…" />
    <CommandList>
      <CommandEmpty>Ничего не найдено</CommandEmpty>
      <CommandGroup heading="Переход">
        <CommandItem><LayoutDashboardIcon />Дашборд</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</CommandDialog>`}
        >
          <Command className="max-w-md rounded-xl border">
            <CommandInput placeholder="Раздел, заявка, оборудование…" />
            <CommandList>
              <CommandEmpty>Ничего не найдено</CommandEmpty>
              <CommandGroup heading="Переход">
                <CommandItem><LayoutDashboardIcon />Дашборд</CommandItem>
                <CommandItem><ClipboardListIcon />Заявки на ремонт</CommandItem>
                <CommandItem><CalendarClockIcon />План ТО</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Действия">
                <CommandItem><PlusIcon />Новая заявка<CommandShortcut>Ctrl+N</CommandShortcut></CommandItem>
                <CommandItem><FileSpreadsheetIcon />Отчёт за смену</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="flex flex-col items-start gap-3">
            <Button variant="outline" className="w-64 justify-between text-muted-foreground" onClick={() => setCmdOpen(true)}>
              <span className="flex items-center gap-2"><SearchIcon />Поиск…</span>
              <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
            </Button>
            <span className="text-xs text-muted-foreground">Кнопка поиска для шапки модуля</span>
          </div>
          <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
            <Command>
              <CommandInput placeholder="Раздел, заявка, оборудование…" />
              <CommandList>
                <CommandEmpty>Ничего не найдено</CommandEmpty>
                <CommandGroup heading="Переход">
                  {[["Дашборд", LayoutDashboardIcon], ["Заявки на ремонт", ClipboardListIcon], ["План ТО", CalendarClockIcon], ["Оборудование", FactoryIcon]].map(([l, I]) => {
                    const Icon = I as typeof FactoryIcon
                    return (
                      <CommandItem key={l as string} onSelect={() => { setCmdOpen(false); toast(`Переход: ${l}`) }}>
                        <Icon />{l as string}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Оборудование">
                  {EQUIPMENT.flatMap((g) => g.items).map((e) => (
                    <CommandItem key={e.code} value={`${e.code} ${e.label}`} onSelect={() => setCmdOpen(false)}>
                      <WrenchIcon /><span className="font-mono text-xs">{e.code}</span>{e.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </CommandDialog>
        </Example>
      </DocSection>

      <Rules
        do={[
          "До ~15 вариантов — Select; больше или справочник — Combobox с поиском.",
          "На терминалах в цехе — NativeSelect: крупно и с системной клавиатурой.",
          "Пустой результат поиска объясняйте: «Оборудование не найдено».",
          "Действия группируйте; разрушающее — последним, красным, с подтверждением.",
        ]}
        dont={[
          "Не используйте Select для действий — для этого DropdownMenu.",
          "Не прячьте действие только в правый клик.",
          "Не делайте вложенность меню глубже одного уровня.",
          "Не используйте Combobox для 3–5 вариантов — лучше RadioGroup или ToggleGroup.",
        ]}
      />
    </DocPage>
  )
}
