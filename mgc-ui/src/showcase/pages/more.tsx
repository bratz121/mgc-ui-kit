import * as React from "react"
import type { DateRange } from "react-day-picker"
import { ru } from "react-day-picker/locale"
import {
  BoldIcon,
  CameraIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  FactoryIcon,
  FileTextIcon,
  ImageIcon,
  MinusIcon,
  PlusIcon,
  RefreshCwIcon,
  UploadIcon,
  WrenchIcon,
} from "lucide-react"
import { toast } from "sonner"

import { StatusBadge } from "@/components/mgc/status-badge"
import { TagInput } from "@/components/mgc/tag-input"
import { DatePicker, DateRangePicker } from "@/components/mgc/date-picker"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocPage, DocSection, Example, Rules } from "../doc"
import { REQUESTS } from "../data"

const prevent = (e: React.MouseEvent) => e.preventDefault()

/* ─────────────────────────── Навигация ─────────────────────────── */

/** Компоненты навигации — секции встраиваются в страницу «Навигация» (navigation.tsx). */
export function NavigationComponentSections() {
  return (
    <>
      <DocSection title="Хлебные крошки" description="Показывают путь в глубокой иерархии: Площадка → Участок → Оборудование. Последний пункт — текущая страница, не ссылка.">
        <Example code={`<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="#">Оборудование</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>ПР-114</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#" onClick={prevent}>Техобслуживание</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
                    <BreadcrumbEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Площадка Липецк</DropdownMenuItem>
                      <DropdownMenuItem>Сборочное производство</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#" onClick={prevent}>Линия сборки №1</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Пресс ПР-114</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Example>
      </DocSection>

      <DocSection title="Вкладки" description="Два вида: «в подложке» (default) — переключатель видов внутри блока; «линия» (line) — разделы карточки сущности под заголовком.">
        <Example className="grid gap-8" code={`<Tabs defaultValue="info">\n  <TabsList variant="line">\n    <TabsTrigger value="info">Информация</TabsTrigger>\n    <TabsTrigger value="history">История</TabsTrigger>\n  </TabsList>\n  <TabsContent value="info">…</TabsContent>\n</Tabs>`}>
          <Tabs defaultValue="info">
            <div className="-mx-1 overflow-x-auto px-1 pb-1.5 [scrollbar-width:none]">
            <TabsList variant="line">
              <TabsTrigger value="info">Информация</TabsTrigger>
              <TabsTrigger value="history">История ремонтов <Badge variant="secondary">12</Badge></TabsTrigger>
              <TabsTrigger value="plan">План ТО</TabsTrigger>
              <TabsTrigger value="docs">Документы</TabsTrigger>
            </TabsList>
            </div>
            <TabsContent value="info" className="pt-4 text-sm text-muted-foreground">Паспорт оборудования, характеристики, ответственные.</TabsContent>
            <TabsContent value="history" className="pt-4 text-sm text-muted-foreground">12 заявок за год.</TabsContent>
            <TabsContent value="plan" className="pt-4 text-sm text-muted-foreground">Следующее ТО — 30.11.2026.</TabsContent>
            <TabsContent value="docs" className="pt-4 text-sm text-muted-foreground">Инструкции и акты.</TabsContent>
          </Tabs>
          <Tabs defaultValue="day">
            <TabsList>
              <TabsTrigger value="shift">Смена</TabsTrigger>
              <TabsTrigger value="day">День</TabsTrigger>
              <TabsTrigger value="week">Неделя</TabsTrigger>
            </TabsList>
          </Tabs>
        </Example>
      </DocSection>

      <DocSection title="Пагинация">
        <Example code={`<Pagination>\n  <PaginationContent>\n    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>\n    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>\n    <PaginationItem><PaginationEllipsis /></PaginationItem>\n    <PaginationItem><PaginationNext href="#" /></PaginationItem>\n  </PaginationContent>\n</Pagination>`}>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={prevent} /></PaginationItem>
              <PaginationItem><PaginationLink href="#" onClick={prevent}>1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" onClick={prevent} isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" onClick={prevent}>3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem><PaginationLink href="#" onClick={prevent}>23</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" onClick={prevent} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </Example>
      </DocSection>

      <DocSection title="Верхнее меню (NavigationMenu)" description="Только для модулей с большим числом разделов внутри страницы (справочники). Основная навигация — боковое меню.">
        <Example className="min-h-56 items-start" code={`<NavigationMenu>\n  <NavigationMenuList>\n    <NavigationMenuItem>\n      <NavigationMenuTrigger>Справочники</NavigationMenuTrigger>\n      <NavigationMenuContent>…</NavigationMenuContent>\n    </NavigationMenuItem>\n  </NavigationMenuList>\n</NavigationMenu>`}>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Справочники</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] grid-cols-2 gap-1 p-1">
                    {[["Оборудование", "Паспорта, инв. номера"], ["Участки", "Структура производства"], ["Причины простоев", "Классификатор"], ["Дефекты", "Каталог несоответствий"]].map(([t, d]) => (
                      <li key={t}>
                        <NavigationMenuLink href="#" onClick={prevent} className="flex flex-col items-start gap-0.5">
                          <span className="text-sm font-medium">{t}</span>
                          <span className="text-xs text-muted-foreground">{d}</span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Отчёты</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-56 gap-1 p-1">
                    {["Сменный отчёт", "Простои за период", "Выполнение плана ТО"].map((t) => (
                      <li key={t}><NavigationMenuLink href="#" onClick={prevent}>{t}</NavigationMenuLink></li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" onClick={prevent} className={navigationMenuTriggerStyle()}>Помощь</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Example>
      </DocSection>

      <DocSection title="Меню-панель (Menubar)" description="Для редакторов: конструктор отчёта, схема цеха. В обычных экранах не используется.">
        <Example code={`<Menubar>\n  <MenubarMenu>\n    <MenubarTrigger>Файл</MenubarTrigger>\n    <MenubarContent>\n      <MenubarGroup>\n        <MenubarItem>Сохранить <MenubarShortcut>Ctrl+S</MenubarShortcut></MenubarItem>\n      </MenubarGroup>\n    </MenubarContent>\n  </MenubarMenu>\n</Menubar>`}>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Файл</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>Новый отчёт<MenubarShortcut>Ctrl+N</MenubarShortcut></MenubarItem>
                  <MenubarItem>Сохранить<MenubarShortcut>Ctrl+S</MenubarShortcut></MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem>Экспорт в Excel</MenubarItem>
                  <MenubarItem>Печать<MenubarShortcut>Ctrl+P</MenubarShortcut></MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Правка</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>Отменить<MenubarShortcut>Ctrl+Z</MenubarShortcut></MenubarItem>
                  <MenubarItem>Повторить<MenubarShortcut>Ctrl+Y</MenubarShortcut></MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Вид</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarCheckboxItem checked>Сетка</MenubarCheckboxItem>
                  <MenubarCheckboxItem>Линейки</MenubarCheckboxItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Example>
      </DocSection>
    </>
  )
}

/* ── Множественный ввод ── */

function TagInputDemos() {
  const [serials, setSerials] = React.useState(["ПР-114", "РС-07"])
  const [serialErr, setSerialErr] = React.useState<string | null>(null)
  const [emails, setEmails] = React.useState(["master.l1@mgc.local"])
  const [emailErr, setEmailErr] = React.useState<string | null>(null)
  const [tags, setTags] = React.useState(["гидравлика", "течь"])
  const [tagErr, setTagErr] = React.useState<string | null>(null)
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Field data-invalid={serialErr ? true : undefined}>
        <FieldLabel htmlFor="ti-serial">Коды оборудования</FieldLabel>
        <TagInput
          id="ti-serial"
          value={serials}
          onChange={setSerials}
          onError={setSerialErr}
          mono
          transform={(v) => v.trim().toUpperCase()}
          validate={(v) => (/^[А-ЯA-Z]{2}-\d{2,3}$/.test(v) ? null : `«${v}» — не код вида ПР-114`)}
          placeholder="ПР-114, Enter"
          aria-invalid={!!serialErr}
        />
        {serialErr ? <FieldError>{serialErr}</FieldError> : <FieldDescription>Можно вставить список из Excel — разобьём по строкам</FieldDescription>}
      </Field>
      <Field data-invalid={emailErr ? true : undefined}>
        <FieldLabel htmlFor="ti-email">Получатели отчёта</FieldLabel>
        <TagInput
          id="ti-email"
          value={emails}
          onChange={setEmails}
          onError={setEmailErr}
          transform={(v) => v.trim().toLowerCase()}
          validate={(v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : `«${v}» — не похоже на e-mail`)}
          placeholder="e-mail, Enter или запятая"
          aria-invalid={!!emailErr}
        />
        {emailErr ? <FieldError>{emailErr}</FieldError> : <FieldDescription>Через запятую, точку с запятой или Enter</FieldDescription>}
      </Field>
      <Field data-invalid={tagErr ? true : undefined}>
        <FieldLabel htmlFor="ti-tags">Теги неисправности</FieldLabel>
        <TagInput id="ti-tags" value={tags} onChange={setTags} onError={setTagErr} max={5} placeholder="Добавьте тег" aria-invalid={!!tagErr} />
        {tagErr ? <FieldError>{tagErr}</FieldError> : <FieldDescription>До 5 тегов · {tags.length}/5</FieldDescription>}
      </Field>
      <Field data-disabled>
        <FieldLabel>Недоступно</FieldLabel>
        <TagInput value={["только чтение"]} onChange={() => {}} disabled />
      </Field>
    </div>
  )
}

/* ─────────────────────── Специальный ввод ─────────────────────── */

export function InputsPage() {
  const [qty, setQty] = React.useState(12)
  const [temp, setTemp] = React.useState([65])
  const [due, setDue] = React.useState<Date | undefined>(new Date(2026, 10, 30))
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 10, 23),
    to: new Date(2026, 10, 27),
  })
  return (
    <DocPage
      title="Специальный ввод"
      lead="Поля сверх обычного текста: множественный ввод тегами, дата и период, количество со степпером, слайдер уставки, PIN-код терминала, загрузка файла, группы кнопок."
    >
      <DocSection title="Дата и период" description="DatePicker — поле с маской ДД.ММ.ГГГГ (можно печатать) и календарь кита по кнопке. DateRangePicker — быстрые периоды и два месяца (на телефоне — один). Системный input type=&quot;date&quot; не используем: он выглядит по-разному в каждом браузере.">
        <Example className="grid gap-6 md:grid-cols-2" code={`import { DatePicker, DateRangePicker } from "@/components/mgc/date-picker"

const [date, setDate] = React.useState<Date>()
const [range, setRange] = React.useState<DateRange>()

<Field>
  <FieldLabel htmlFor="due">Срок выполнения</FieldLabel>
  <DatePicker id="due" value={date} onChange={setDate} disabled={{ before: new Date() }} />
</Field>

<DateRangePicker value={range} onChange={setRange} />`}>
          <Field>
            <FieldLabel htmlFor="dp-due">Срок выполнения</FieldLabel>
            <DatePicker id="dp-due" value={due} onChange={setDue} disabled={{ before: new Date(2026, 10, 27) }} />
            <FieldDescription>Печатайте 30112026 — точки подставятся. Прошедшие даты недоступны.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Период отчёта</FieldLabel>
            <DateRangePicker value={range} onChange={setRange} today={new Date(2026, 10, 27)} />
            <FieldDescription>Быстрые периоды слева, применение — кнопкой</FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="dp-bad">Дата поверки</FieldLabel>
            <DatePicker id="dp-bad" value={undefined} onChange={() => {}} aria-invalid />
            <FieldError>Укажите дату поверки</FieldError>
          </Field>
        </Example>
        <Example className="block" code={`<Calendar mode="range" locale={ru} numberOfMonths={2} selected={range} onSelect={setRange} />`}>
          <div className="flex flex-wrap items-start gap-6">
            <Calendar mode="range" locale={ru} numberOfMonths={2} selected={range} onSelect={setRange} defaultMonth={new Date(2026, 10)} className="rounded-xl border max-md:hidden" />
            <Calendar mode="range" locale={ru} selected={range} onSelect={setRange} defaultMonth={new Date(2026, 10)} className="rounded-xl border md:hidden" />
            <div className="flex flex-col gap-1 text-sm">
              <span className="text-muted-foreground">Календарь на странице — для планирования (график ТО, смены)</span>
              <span className="text-lg font-medium tabular-nums">
                {range?.from?.toLocaleDateString("ru-RU") ?? "—"} — {range?.to?.toLocaleDateString("ru-RU") ?? "—"}
              </span>
            </div>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Количество и уставки">
        <Example className="grid gap-8 md:grid-cols-2" code={`<ButtonGroup>\n  <Button variant="outline" size="icon"><MinusIcon /></Button>\n  <Input className="w-20 text-center tabular-nums" value={qty} />\n  <Button variant="outline" size="icon"><PlusIcon /></Button>\n</ButtonGroup>\n\n<Slider value={temp} onValueChange={(v) => setTemp(v as number[])} min={20} max={120} />`}>
          <Field>
            <FieldLabel htmlFor="qty">Количество, шт</FieldLabel>
            <ButtonGroup>
              <Button variant="outline" size="icon" onClick={() => setQty((q) => Math.max(0, q - 1))}><MinusIcon /><span className="sr-only">Уменьшить</span></Button>
              <Input id="qty" className="w-20 text-center tabular-nums" inputMode="numeric" value={qty} onChange={(e) => setQty(Number(e.target.value.replace(/\D/g, "")) || 0)} />
              <Button variant="outline" size="icon" onClick={() => setQty((q) => q + 1)}><PlusIcon /><span className="sr-only">Увеличить</span></Button>
            </ButtonGroup>
            <FieldDescription>Степпер на ButtonGroup</FieldDescription>
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel>Уставка температуры</FieldLabel>
              <span className="text-sm tabular-nums">{temp[0]} °C</span>
            </div>
            <Slider value={temp} onValueChange={(v) => setTemp(v as number[])} min={20} max={120} step={1} />
            <FieldDescription>Допуск 60–80 °C</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Диапазон давления, бар</FieldLabel>
            <Slider defaultValue={[120, 180]} min={0} max={250} step={5} />
            <FieldDescription>Два бегунка — диапазон</FieldDescription>
          </Field>
        </Example>
      </DocSection>

      <DocSection title="Множественный ввод (теги)" description="Ввели значение → Enter → оно стало чипом, вводите следующее. Запятая и точка с запятой тоже добавляют. Backspace в пустом поле удаляет последний чип. Дубли и неверный формат не добавляются — с понятной ошибкой.">
        <Example className="block" code={`import { TagInput } from "@/components/mgc/tag-input"

const [codes, setCodes] = React.useState<string[]>([])
const [error, setError] = React.useState<string | null>(null)

<Field data-invalid={error ? true : undefined}>
  <FieldLabel htmlFor="codes">Коды оборудования</FieldLabel>
  <TagInput
    id="codes"
    value={codes}
    onChange={setCodes}
    onError={setError}
    mono
    transform={(v) => v.trim().toUpperCase()}
    validate={(v) => (/^[А-Я]{2}-\\d{2,3}$/.test(v) ? null : "Не код вида ПР-114")}
    aria-invalid={!!error}
  />
  {error && <FieldError>{error}</FieldError>}
</Field>`}>
          <TagInputDemos />
        </Example>
      </DocSection>

      <DocSection title="Код и PIN" description="InputOTP — посимвольный ввод: PIN-код входа на терминале, код подтверждения.">
        <Example className="grid gap-8 md:grid-cols-2" code={`<InputOTP maxLength={6}>\n  <InputOTPGroup>\n    <InputOTPSlot index={0} />…\n  </InputOTPGroup>\n  <InputOTPSeparator />\n  <InputOTPGroup>…</InputOTPGroup>\n</InputOTP>`}>
          <Field>
            <FieldLabel>Табельный PIN</FieldLabel>
            <InputOTP maxLength={4} onComplete={() => toast.success("Вход выполнен")}>
              <InputOTPGroup>
                {[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>4 цифры, вход на терминале участка</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Код подтверждения</FieldLabel>
            <InputOTP maxLength={6}>
              <InputOTPGroup>{[0, 1, 2].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>{[3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
          </Field>
        </Example>
      </DocSection>

      <DocSection title="Поле с кнопками и файл">
        <Example className="grid gap-6 md:grid-cols-2" code={`<InputGroup>\n  <InputGroupInput readOnly value="https://…" />\n  <InputGroupAddon align="inline-end">\n    <InputGroupButton size="icon-xs"><CopyIcon /></InputGroupButton>\n  </InputGroupAddon>\n</InputGroup>`}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="link">Ссылка на отчёт</FieldLabel>
              <InputGroup>
                <InputGroupInput id="link" readOnly value="https://pk.mgc.local/report/2026-11-27" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton size="icon-xs" onClick={() => toast.success("Ссылка скопирована")}><CopyIcon /><span className="sr-only">Копировать</span></InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="serial">Серийный номер</FieldLabel>
              <InputGroup>
                <InputGroupInput id="serial" placeholder="Отсканируйте или введите" className="font-mono" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton variant="secondary"><CameraIcon />Сканировать</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel>Фото дефекта</FieldLabel>
            <label htmlFor="upload" className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed p-6 text-center text-sm transition-colors hover:bg-muted/50">
              <UploadIcon className="size-6 text-muted-foreground" />
              <span>Перетащите файлы или <span className="underline underline-offset-4">выберите</span></span>
              <span className="text-xs text-muted-foreground">JPG, PNG до 10 МБ</span>
              <input id="upload" type="file" accept="image/*" multiple className="sr-only" />
            </label>
          </Field>
        </Example>
      </DocSection>

      <DocSection title="Группы кнопок" description="ButtonGroup склеивает связанные действия: сегменты, кнопку с выпадающим меню, панель инструментов.">
        <Example code={`<ButtonGroup>\n  <Button variant="outline">Сохранить</Button>\n  <ButtonGroupSeparator />\n  <DropdownMenu>…</DropdownMenu>\n</ButtonGroup>`}>
          <ButtonGroup>
            <Button>Сохранить</Button>
            <ButtonGroupSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button size="icon" />}><ChevronDownIcon /><span className="sr-only">Ещё варианты</span></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Сохранить и закрыть</DropdownMenuItem>
                  <DropdownMenuItem>Сохранить как шаблон</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="icon"><BoldIcon /><span className="sr-only">Жирный</span></Button>
            <Button variant="outline">Абзац</Button>
            <Button variant="outline">Список</Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>Обновлять</ButtonGroupText>
            <Button variant="outline"><RefreshCwIcon data-icon="inline-start" />30 сек</Button>
          </ButtonGroup>
        </Example>
      </DocSection>
    </DocPage>
  )
}

/* ─────────────────────── Раскладка и списки ─────────────────────── */

export function LayoutPage() {
  const [open, setOpen] = React.useState(false)
  return (
    <DocPage
      title="Раскладка и списки"
      lead="Контейнеры для организации контента: раскрывающиеся блоки, списки сущностей, разделённые панели, прокрутка, медиа."
    >
      <DocSection title="Accordion" description="Свёрнутые разделы одного уровня: шаги инструкции, FAQ, группы настроек.">
        <Example className="block" code={`<Accordion defaultValue={["step-1"]}>\n  <AccordionItem value="step-1">\n    <AccordionTrigger>…</AccordionTrigger>\n    <AccordionContent>…</AccordionContent>\n  </AccordionItem>\n</Accordion>`}>
          <Accordion defaultValue={["s1"]} className="max-w-2xl">
            {[
              ["s1", "1. Подготовка и блокировка (LOTO)", "Остановите оборудование, установите замок и бирку на вводной автомат. Проверьте отсутствие напряжения."],
              ["s2", "2. Сброс давления", "Откройте вентиль сброса, дождитесь 0 бар по манометру М1."],
              ["s3", "3. Замена уплотнителя", "Снимите крышку (8 × М12), извлеките шток, замените манжету комплектом РК-114."],
              ["s4", "4. Пуск и проверка", "Снимите блокировку, выполните 5 холостых ходов, проверьте отсутствие течи."],
            ].map(([v, t, c]) => (
              <AccordionItem key={v} value={v}>
                <AccordionTrigger>{t}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{c}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Example>
      </DocSection>

      <DocSection title="Collapsible" description="Один скрываемый блок: «Расширенные фильтры», «Подробности».">
        <Example className="block" code={`<Collapsible open={open} onOpenChange={setOpen}>\n  <CollapsibleTrigger render={<Button variant="ghost" />}>Расширенные фильтры</CollapsibleTrigger>\n  <CollapsibleContent>…</CollapsibleContent>\n</Collapsible>`}>
          <Collapsible open={open} onOpenChange={setOpen} className="flex max-w-md flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">Расширенные фильтры</span>
              <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <ChevronsUpDownIcon />
                <span className="sr-only">{open ? "Свернуть" : "Развернуть"}</span>
              </CollapsibleTrigger>
            </div>
            <div className="rounded-lg border px-3 py-2 text-sm">Участок: все</div>
            <CollapsibleContent className="flex flex-col gap-2">
              <div className="rounded-lg border px-3 py-2 text-sm">Исполнитель: любой</div>
              <div className="rounded-lg border px-3 py-2 text-sm">Простой: от 10 мин</div>
            </CollapsibleContent>
          </Collapsible>
        </Example>
      </DocSection>

      <DocSection title="Item — список сущностей" description="Строка списка: медиа + заголовок + описание + действия. Для списков, где таблица избыточна: оборудование участка, вложения, уведомления.">
        <Example className="block" code={`<ItemGroup>\n  <Item variant="outline">\n    <ItemMedia variant="icon"><WrenchIcon /></ItemMedia>\n    <ItemContent>\n      <ItemTitle>Пресс гидравлический</ItemTitle>\n      <ItemDescription>ПР-114 · Линия сборки №1</ItemDescription>\n    </ItemContent>\n    <ItemActions>…</ItemActions>\n  </Item>\n</ItemGroup>`}>
          <div className="grid gap-6 lg:grid-cols-2">
            <ItemGroup>
              {REQUESTS.slice(0, 4).map((r, i) => (
                <React.Fragment key={r.id}>
                  {i > 0 && <ItemSeparator />}
                  <Item>
                    <ItemMedia variant="icon"><WrenchIcon /></ItemMedia>
                    <ItemContent>
                      <ItemTitle>{r.equipment}</ItemTitle>
                      <ItemDescription><span className="font-mono">{r.code}</span> · {r.area}</ItemDescription>
                    </ItemContent>
                    <ItemActions><StatusBadge status={r.status} /></ItemActions>
                  </Item>
                </React.Fragment>
              ))}
            </ItemGroup>
            <ItemGroup className="gap-2">
              {[["Акт приёмки ТО-250.pdf", "1,2 МБ · 27.11.2026"], ["Фото дефекта_01.jpg", "3,4 МБ · 27.11.2026"], ["Паспорт ПР-114.pdf", "8,9 МБ · 14.03.2024"]].map(([t, d]) => (
                <Item key={t} variant="outline" size="sm">
                  <ItemMedia variant="icon"><FileTextIcon /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>{t}</ItemTitle>
                    <ItemDescription>{d}</ItemDescription>
                  </ItemContent>
                  <ItemActions><Button variant="outline" size="sm">Открыть</Button></ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Resizable — разделённые панели" description="Список + детали в одном экране (мастер-деталь). Пользователь сам двигает границу.">
        <Example className="block p-0" code={`<ResizablePanelGroup orientation="horizontal">\n  <ResizablePanel defaultSize="35%" minSize="20%">Список</ResizablePanel>\n  <ResizableHandle withHandle />\n  <ResizablePanel>Детали</ResizablePanel>\n</ResizablePanelGroup>`}>
          <ResizablePanelGroup orientation="horizontal" className="min-h-72">
            <ResizablePanel defaultSize="38%" minSize="22%">
              <ScrollArea className="h-72">
                <div className="flex flex-col p-2">
                  {REQUESTS.slice(0, 14).map((r, i) => (
                    <button key={r.id} type="button" className={"flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted " + (i === 0 ? "bg-muted" : "")}>
                      <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                      <span className="truncate font-medium">{r.equipment}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex h-full flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm">{REQUESTS[0].id}</span>
                  <StatusBadge status={REQUESTS[0].status} />
                </div>
                <span className="text-lg font-medium">{REQUESTS[0].equipment} {REQUESTS[0].code}</span>
                <Separator />
                <p className="text-sm text-muted-foreground">Течь масла из-под крышки гидроцилиндра. Давление падает до 140 бар при норме 180.</p>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Example>
      </DocSection>

      <DocSection title="Медиа: AspectRatio и Carousel" description="Фото дефектов, оборудования. Фиксированные пропорции не дают вёрстке прыгать при загрузке.">
        <Example className="block" code={`<Carousel>\n  <CarouselContent>\n    <CarouselItem className="basis-1/3">\n      <AspectRatio ratio={4 / 3}><img src={photo} alt="Фото дефекта" className="object-cover" /></AspectRatio>\n    </CarouselItem>\n  </CarouselContent>\n  <CarouselPrevious /><CarouselNext />\n</Carousel>`}>
          <div className="px-12">
            <Carousel opts={{ align: "start" }}>
              <CarouselContent>
                {Array.from({ length: 6 }, (_, i) => (
                  <CarouselItem key={i} className="basis-1/2 md:basis-1/3">
                    <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-lg border bg-muted">
                      <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        {i % 2 ? <ImageIcon className="size-8" /> : <FactoryIcon className="size-8" />}
                        <span className="text-xs">Фото {i + 1} из 6</span>
                      </div>
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Мелочи: Avatar, Kbd, Separator">
        <Example code={`<AvatarGroup>\n  <Avatar><AvatarFallback>ИА</AvatarFallback></Avatar>\n  <AvatarGroupCount>+3</AvatarGroupCount>\n</AvatarGroup>\n<KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>`}>
          <AvatarGroup>
            {["ИА", "ПЕ", "СК"].map((x) => <Avatar key={x}><AvatarFallback>{x}</AvatarFallback></Avatar>)}
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
          <Separator orientation="vertical" className="h-6 self-center!" />
          <KbdGroup><Kbd>Ctrl</Kbd><span>+</span><Kbd>K</Kbd></KbdGroup>
          <span className="text-sm text-muted-foreground">— поиск</span>
          <Separator orientation="vertical" className="h-6 self-center!" />
          <KbdGroup><Kbd>Ctrl</Kbd><span>+</span><Kbd>B</Kbd></KbdGroup>
          <span className="text-sm text-muted-foreground">— свернуть меню</span>
        </Example>
      </DocSection>

      <Rules
        do={[
          "Accordion — для последовательных шагов и FAQ; несколько открытых одновременно — допустимо.",
          "Item — для коротких списков (до ~20); больше или нужна сортировка — Table.",
          "Resizable — когда пользователь работает со списком и деталями одновременно.",
        ]}
        dont={[
          "Не прячьте в Accordion обязательные поля формы.",
          "Не вкладывайте Accordion в Accordion.",
          "Не используйте Carousel для важного контента — его пролистывают не все.",
        ]}
      />
    </DocPage>
  )
}
