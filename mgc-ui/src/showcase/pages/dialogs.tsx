import * as React from "react"
import {
  AlertTriangleIcon,
  CalendarIcon,
  FilterIcon,
  InfoIcon,
  OctagonXIcon,
  PencilIcon,
  Trash2Icon,
  WrenchIcon,
} from "lucide-react"
import { ru } from "react-day-picker/locale"
import { toast } from "sonner"

import { DatePicker } from "@/components/mgc/date-picker"
import { StatusBadge, STATUS_LIST, type Status } from "@/components/mgc/status-badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"
import { REQUESTS } from "../data"

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  )
}

export function DialogsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 10, 28))
  const [status, setStatus] = React.useState<Status>("in_progress")
  const [moveDate, setMoveDate] = React.useState<Date | undefined>(new Date(2026, 10, 30))
  const r = REQUESTS[0]

  return (
    <DocPage
      title="Модальные окна и панели"
      lead="Окна поверх страницы. Чем серьёзнее действие и чем меньше в нём полей — тем «модальнее» окно. Длинные формы — отдельной страницей, не в окне."
    >
      <PropsTable
        rows={[
          { name: "Dialog", values: "sm · default · lg", note: "Короткая задача 1–6 полей или просмотр, не уходя со страницы" },
          { name: "AlertDialog", values: "default · sm", note: "Подтверждение необратимого или опасного действия. Не закрывается кликом мимо" },
          { name: "Sheet", values: "right · left · top · bottom", note: "Карточка записи рядом с таблицей, фильтры, настройки" },
          { name: "Drawer", values: "снизу, свайп", note: "Терминалы и планшеты: действия под большой палец" },
          { name: "Popover", values: "—", note: "Мини-форма у элемента: смена статуса, выбор даты" },
          { name: "HoverCard", values: "—", note: "Предпросмотр по наведению (карточка оборудования по коду). Только десктоп" },
          { name: "Tooltip", values: "top · right · bottom · left", note: "Подпись к иконке или сокращению. Без интерактива внутри" },
        ]}
      />

      {/* ── Dialog ── */}
      <DocSection title="Dialog" description="Размер задаётся шириной контента. Заголовок обязателен, описание — контекст (номер, объект).">
        <Example
          code={`<Dialog>
  <DialogTrigger render={<Button />}>Назначить исполнителя</DialogTrigger>
  <DialogContent className="sm:max-w-sm">        {/* sm */}
  <DialogContent>                                {/* default */}
  <DialogContent className="sm:max-w-2xl">       {/* lg */}
    <DialogHeader>
      <DialogTitle>…</DialogTitle>
      <DialogDescription>…</DialogDescription>
    </DialogHeader>
    …
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Отмена</DialogClose>
      <Button>Сохранить</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Маленький · sm</DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Перенести ТО</DialogTitle>
                <DialogDescription>Пресс ПР-114 · плановое ТО-250</DialogDescription>
              </DialogHeader>
              <Field>
                <FieldLabel htmlFor="d-date">Новая дата</FieldLabel>
                <DatePicker id="d-date" value={moveDate} onChange={setMoveDate} disabled={{ before: new Date(2026, 10, 27) }} className="sm:w-full" />
              </Field>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Отмена</DialogClose>
                <DialogClose render={<Button />} onClick={() => toast.success(`ТО перенесено на ${moveDate?.toLocaleDateString("ru-RU") ?? "—"}`)}>Перенести</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger render={<Button />}>Форма · default</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Закрыть заявку</DialogTitle>
                <DialogDescription>{r.id} · {r.equipment} {r.code}</DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend variant="label">Результат</FieldLegend>
                  <RadioGroup defaultValue="fixed">
                    {[["fixed", "Неисправность устранена"], ["partial", "Устранена частично, нужна повторная заявка"], ["none", "Не подтвердилась"]].map(([v, l]) => (
                      <Field key={v} orientation="horizontal">
                        <RadioGroupItem value={v} id={`res-${v}`} />
                        <FieldLabel htmlFor={`res-${v}`} className="font-normal">{l}</FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                </FieldSet>
                <Field>
                  <FieldLabel htmlFor="res-comment">Что сделано</FieldLabel>
                  <Textarea id="res-comment" rows={3} placeholder="Заменён уплотнитель гидроцилиндра…" />
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="res-photo" defaultChecked />
                  <FieldLabel htmlFor="res-photo" className="font-normal">Приложить фото к отчёту</FieldLabel>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Отмена</DialogClose>
                <DialogClose render={<Button />} onClick={() => toast.success("Заявка закрыта", { description: r.id })}>Закрыть заявку</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Большой · lg, прокрутка</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Инструкция: замена уплотнителя гидроцилиндра</DialogTitle>
                <DialogDescription>ИН-ТОиР-017 · ред. 3 от 12.09.2026</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-72 rounded-lg border">
                <ol className="flex list-decimal flex-col gap-3 p-4 pl-8 text-sm">
                  {Array.from({ length: 14 }, (_, i) => (
                    <li key={i}>
                      {["Остановите пресс и установите блокировку LOTO.", "Сбросьте давление в гидросистеме до 0 бар по манометру.", "Отсоедините рукава высокого давления, заглушите штуцеры.", "Снимите крышку гидроцилиндра (8 болтов М12).", "Извлеките шток, осмотрите зеркало на задиры."][i % 5]}
                    </li>
                  ))}
                </ol>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline">Печать</Button>
                <DialogClose render={<Button />}>Понятно</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger render={<Button variant="ghost" />}><InfoIcon data-icon="inline-start" />Просмотр записи</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-mono">{r.id}</DialogTitle>
                <DialogDescription>{r.equipment} · {r.area}</DialogDescription>
              </DialogHeader>
              <div className="divide-y">
                <DetailRow label="Статус"><StatusBadge status={r.status} /></DetailRow>
                <DetailRow label="Оборудование"><span className="font-mono">{r.code}</span> {r.equipment}</DetailRow>
                <DetailRow label="Простой"><span className="tabular-nums">{r.downtime} мин</span></DetailRow>
                <DetailRow label="Создана"><span className="tabular-nums">{r.created}</span></DetailRow>
              </div>
            </DialogContent>
          </Dialog>
        </Example>
      </DocSection>

      {/* ── AlertDialog ── */}
      <DocSection title="AlertDialog — подтверждение" description="Заголовок — вопрос с объектом. Описание — последствия. Кнопка действия называет действие, а не «Да».">
        <Example
          code={`<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>Удалить</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogMedia className="bg-destructive-soft text-destructive"><Trash2Icon /></AlertDialogMedia>
      <AlertDialogTitle>Удалить заявку ЗН-2026-00481?</AlertDialogTitle>
      <AlertDialogDescription>История работ будет удалена без возможности восстановления.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Отмена</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Удалить</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
        >
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}><Trash2Icon data-icon="inline-start" />Удалить заявку</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive-soft text-destructive"><Trash2Icon /></AlertDialogMedia>
                <AlertDialogTitle>Удалить заявку {r.id}?</AlertDialogTitle>
                <AlertDialogDescription>Заявка и история работ по ней будут удалены без возможности восстановления.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => toast("Заявка удалена")}>Удалить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}><OctagonXIcon data-icon="inline-start" />Остановить линию</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive-soft text-destructive"><OctagonXIcon /></AlertDialogMedia>
                <AlertDialogTitle>Остановить линию сборки №1?</AlertDialogTitle>
                <AlertDialogDescription>Конвейер остановится немедленно. Мастер смены и служба ТОиР получат андон-сигнал.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Не останавливать</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => toast.error("Линия сборки №1 остановлена")}>Остановить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}><AlertTriangleIcon data-icon="inline-start" />Предупреждение</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-warning-soft text-warning"><AlertTriangleIcon /></AlertDialogMedia>
                <AlertDialogTitle>Закрыть смену без отчёта?</AlertDialogTitle>
                <AlertDialogDescription>В отчёте не заполнены простои за 2 часа. Их можно будет внести позже, но показатели смены пересчитаются.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Заполнить отчёт</AlertDialogCancel>
                <AlertDialogAction>Закрыть смену</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="ghost" />}>Компактный · sm</AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Отменить изменения?</AlertDialogTitle>
                <AlertDialogDescription>Несохранённые правки пропадут.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Вернуться</AlertDialogCancel>
                <AlertDialogAction>Отменить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Example>
      </DocSection>

      {/* ── Sheet ── */}
      <DocSection title="Sheet — боковая панель" description="Справа — карточка записи и фильтры (таблица остаётся видна). Слева — навигация на узких экранах. Снизу — массовые действия.">
        <Example code={`<Sheet>\n  <SheetTrigger render={<Button variant="outline" />}>Открыть</SheetTrigger>\n  <SheetContent side="right" className="sm:max-w-md">\n    <SheetHeader>\n      <SheetTitle>…</SheetTitle>\n      <SheetDescription>…</SheetDescription>\n    </SheetHeader>\n    …\n    <SheetFooter>…</SheetFooter>\n  </SheetContent>\n</Sheet>`}>
          <Sheet>
            <SheetTrigger render={<Button />}><WrenchIcon data-icon="inline-start" />Карточка заявки</SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-mono">{r.id}</SheetTitle>
                <SheetDescription>{r.equipment} {r.code} · {r.area}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">
                <div className="divide-y">
                  <DetailRow label="Статус"><StatusBadge status={r.status} /></DetailRow>
                  <DetailRow label="Простой"><span className="tabular-nums">{r.downtime} мин</span></DetailRow>
                  <DetailRow label="Создана"><span className="tabular-nums">{r.created}</span></DetailRow>
                  <DetailRow label="Исполнитель">Иванов А. С.</DetailRow>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Ход работ</span>
                  <Progress value={60} />
                  <span className="text-xs text-muted-foreground">3 из 5 операций по инструкции</span>
                </div>
              </div>
              <SheetFooter className="flex-row justify-end">
                <Button variant="outline"><PencilIcon data-icon="inline-start" />Изменить</Button>
                <Button>Закрыть заявку</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {(["left", "top", "bottom"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger render={<Button variant="outline" />}>
                {side === "left" ? "Слева" : side === "top" ? "Сверху" : "Снизу"}
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>{side === "bottom" ? "Выбрано 3 заявки" : side === "top" ? "Объявление" : "Разделы"}</SheetTitle>
                  <SheetDescription>Панель с края «{side}»</SheetDescription>
                </SheetHeader>
                {side === "bottom" && (
                  <SheetFooter className="flex-row">
                    <Button variant="outline">Назначить</Button>
                    <Button variant="outline">В архив</Button>
                    <Button variant="destructive">Удалить</Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
          ))}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" />}><FilterIcon data-icon="inline-start" />Фильтры</SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Фильтры</SheetTitle><SheetDescription>Применяются к реестру заявок</SheetDescription></SheetHeader>
              <FieldGroup className="px-4">
                <FieldSet>
                  <FieldLegend variant="label">Статус</FieldLegend>
                  {STATUS_LIST.map((s) => (
                    <Field key={s.key} orientation="horizontal">
                      <Checkbox id={`fs-${s.key}`} defaultChecked={s.key !== "cancelled"} />
                      <FieldLabel htmlFor={`fs-${s.key}`} className="font-normal">{s.label}</FieldLabel>
                    </Field>
                  ))}
                </FieldSet>
              </FieldGroup>
              <SheetFooter className="flex-row justify-end"><Button variant="ghost">Сбросить</Button><Button>Применить</Button></SheetFooter>
            </SheetContent>
          </Sheet>
        </Example>
      </DocSection>

      {/* ── Drawer ── */}
      <DocSection title="Drawer — нижняя панель для терминалов" description="Выезжает снизу, закрывается свайпом. Кнопки крупные (size=lg), во всю ширину — под палец в перчатке.">
        <Example code={`<Drawer>\n  <DrawerTrigger render={<Button size="lg" />}>Зафиксировать простой</DrawerTrigger>\n  <DrawerContent>\n    <DrawerHeader>\n      <DrawerTitle>…</DrawerTitle>\n      <DrawerDescription>…</DrawerDescription>\n    </DrawerHeader>\n    …\n    <DrawerFooter>\n      <Button size="lg">Подтвердить</Button>\n      <DrawerClose render={<Button variant="outline" size="lg" />}>Отмена</DrawerClose>\n    </DrawerFooter>\n  </DrawerContent>\n</Drawer>`}>
          <Drawer>
            <DrawerTrigger render={<Button size="lg" />}><OctagonXIcon data-icon="inline-start" />Зафиксировать простой</DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle>Простой: линия сборки №1</DrawerTitle>
                  <DrawerDescription>Начало 14:18 · идёт 6 мин</DrawerDescription>
                </DrawerHeader>
                <div className="grid grid-cols-2 gap-2 px-4">
                  {["Поломка", "Наладка", "Нет комплектующих", "Нет персонала"].map((x) => (
                    <Button key={x} variant="outline" size="lg" className="h-14 whitespace-normal">{x}</Button>
                  ))}
                </div>
                <DrawerFooter>
                  <Button size="lg" onClick={() => toast.success("Простой зафиксирован")}>Подтвердить</Button>
                  <DrawerClose render={<Button variant="outline" size="lg" />}>Отмена</DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </Example>
      </DocSection>

      {/* ── Popover / HoverCard / Tooltip ── */}
      <DocSection title="Popover, HoverCard, Tooltip" description="Лёгкие слои у элемента: не блокируют страницу и закрываются кликом мимо.">
        <Example code={`<Popover>\n  <PopoverTrigger render={<Button variant="outline" />}>28.11.2026</PopoverTrigger>\n  <PopoverContent className="w-auto p-0">\n    <Calendar mode="single" locale={ru} selected={date} onSelect={setDate} />\n  </PopoverContent>\n</Popover>`}>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" className="w-48 justify-start font-normal" />}>
              <CalendarIcon data-icon="inline-start" />
              {date ? date.toLocaleDateString("ru-RU") : "Выберите дату"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" locale={ru} selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger render={<Button variant="ghost" className="h-auto py-1" />}>
              <StatusBadge status={status} />
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <PopoverHeader>
                <PopoverTitle>Сменить статус</PopoverTitle>
                <PopoverDescription>{r.id}</PopoverDescription>
              </PopoverHeader>
              <div className="flex flex-col gap-1">
                {STATUS_LIST.map((s) => (
                  <Button key={s.key} variant={s.key === status ? "secondary" : "ghost"} className="justify-start" onClick={() => setStatus(s.key)}>
                    <StatusBadge status={s.key} />
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <HoverCard>
            <HoverCardTrigger render={<a href="#" onClick={(e) => e.preventDefault()} className="font-mono text-sm underline decoration-dotted underline-offset-4" />}>
              РС-07
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Робот сварочный</span>
                  <StatusBadge status="stopped" />
                </div>
                <span className="text-xs text-muted-foreground">Сварочный участок · инв. № 004317</span>
                <Separator />
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Наработка</span><span className="tabular-nums">18 402 ч</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Последнее ТО</span><span className="tabular-nums">02.11.2026</span></div>
              </div>
            </HoverCardContent>
          </HoverCard>

          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger render={<Button variant="outline" size="icon" />}>
                <InfoIcon />
                <span className="sr-only">Подсказка {side}</span>
              </TooltipTrigger>
              <TooltipContent side={side}>OEE — общая эффективность оборудования</TooltipContent>
            </Tooltip>
          ))}
        </Example>
      </DocSection>

      <Rules
        do={[
          "В заголовке — объект действия: «Закрыть заявку», «Удалить ЗН-…?».",
          "Фокус при открытии — на первом поле; Esc закрывает (кроме AlertDialog с опасным действием).",
          "На терминалах — Drawer и крупные кнопки вместо Dialog.",
          "Карточку записи из таблицы открывайте в Sheet справа — контекст сохраняется.",
        ]}
        dont={[
          "Не открывайте окно из окна. Нужен второй шаг — замените содержимое первого.",
          "Не кладите в Dialog форму длиннее экрана — сделайте страницу.",
          "Не используйте HoverCard для важной информации — на планшете наведения нет.",
          "Не ставьте ссылки и кнопки внутрь Tooltip.",
        ]}
      />
    </DocPage>
  )
}
