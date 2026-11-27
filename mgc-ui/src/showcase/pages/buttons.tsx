import * as React from "react"
import {
  BellIcon,
  BoldIcon,
  ChevronDownIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FilterIcon,
  ItalicIcon,
  OctagonXIcon,
  PinIcon,
  PlusIcon,
  PrinterIcon,
  SaveIcon,
  Trash2Icon,
  UnderlineIcon,
} from "lucide-react"
import { toast } from "sonner"

import { AsyncButton, HoldButton } from "@/components/mgc/action-buttons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"

const VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const
const SIZES = ["xs", "sm", "default", "lg"] as const
const VARIANT_RU: Record<(typeof VARIANTS)[number], string> = {
  default: "Основная",
  outline: "Вторичная",
  secondary: "Альтернативная",
  ghost: "Тихая",
  destructive: "Опасная",
  link: "Ссылка",
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function ButtonsPage() {
  const [pinned, setPinned] = React.useState(false)
  const [failNext, setFailNext] = React.useState(false)
  return (
    <DocPage
      title="Кнопки"
      lead="Кнопка запускает действие. Вид кнопки говорит о важности действия, а не о красоте: основная — одна на экран, опасная — красная, остальные — спокойные. Ниже — все форматы, составные кнопки, поведение и кнопки в формах."
    >
      {/* ── Форматы ── */}
      <DocSection title="Форматы: вид × размер" description="6 видов и 4 размера. default (32px) — стандарт для форм и таблиц; lg (36px) — шапка и сенсорные экраны (на тач-экране кнопки автоматически ≥ 44px).">
        <Example className="block p-0">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-medium">Вид</th>
                {SIZES.map((s) => <th key={s} className="px-3 py-2.5 text-left font-mono font-medium">{s}</th>)}
                <th className="px-3 py-2.5 text-left font-mono font-medium">icon</th>
              </tr>
            </thead>
            <tbody>
              {VARIANTS.map((v) => (
                <tr key={v} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{VARIANT_RU[v]}</div>
                    <div className="font-mono text-xs text-muted-foreground">{v}</div>
                  </td>
                  {SIZES.map((s) => (
                    <td key={s} className="px-3 py-3"><Button variant={v} size={s}>Сохранить</Button></td>
                  ))}
                  <td className="px-3 py-3">
                    <Button variant={v} size="icon"><SaveIcon /><span className="sr-only">Сохранить</span></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Example>
      </DocSection>

      <DocSection title="С иконкой, счётчиком, ссылкой">
        <Example code={`<Button><PlusIcon data-icon="inline-start" />Добавить</Button>
<Button variant="outline">Экспорт<ChevronDownIcon data-icon="inline-end" /></Button>
<Button variant="outline">Фильтры <Badge variant="secondary">3</Badge></Button>
<Button variant="link" render={<a href="…" target="_blank" />} nativeButton={false}>
  Инструкция<ExternalLinkIcon data-icon="inline-end" />
</Button>`}>
          <Button><PlusIcon data-icon="inline-start" />Добавить</Button>
          <Button variant="outline">Экспорт<ChevronDownIcon data-icon="inline-end" /></Button>
          <Button variant="outline"><FilterIcon data-icon="inline-start" />Фильтры <Badge variant="secondary" className="tabular-nums">3</Badge></Button>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
              <BellIcon />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-brand" />
              <span className="sr-only">Уведомления: 3 новых</span>
            </TooltipTrigger>
            <TooltipContent>Уведомления · 3 новых</TooltipContent>
          </Tooltip>
          <Button variant="link" render={<a href="#" onClick={(e) => e.preventDefault()} />} nativeButton={false}>
            Инструкция<ExternalLinkIcon data-icon="inline-end" />
          </Button>
        </Example>
      </DocSection>

      {/* ── Составные ── */}
      <DocSection title="Составные кнопки" description="Кнопка с вариантами (split), переключатель-кнопка (Toggle), сегменты (ToggleGroup), панель инструментов (ButtonGroup).">
        <Example code={`<ButtonGroup>
  <Button>Сохранить</Button>
  <ButtonGroupSeparator />
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button size="icon" />}><ChevronDownIcon /></DropdownMenuTrigger>
    …
  </DropdownMenu>
</ButtonGroup>

<Toggle pressed={pinned} onPressedChange={setPinned}><PinIcon />Закрепить</Toggle>`}>
          <ButtonGroup>
            <Button onClick={() => toast.success("Сохранено")}>Сохранить</Button>
            <ButtonGroupSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button size="icon" />}><ChevronDownIcon /><span className="sr-only">Другие варианты сохранения</span></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Сохранить и закрыть</DropdownMenuItem>
                  <DropdownMenuItem>Сохранить как черновик</DropdownMenuItem>
                  <DropdownMenuItem>Сохранить как шаблон</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <Toggle variant="outline" pressed={pinned} onPressedChange={setPinned} aria-label="Закрепить на дашборде">
            <PinIcon />{pinned ? "Закреплено" : "Закрепить"}
          </Toggle>
          <ToggleGroup defaultValue={["day"]} variant="outline">
            <ToggleGroupItem value="shift">Смена</ToggleGroupItem>
            <ToggleGroupItem value="day">День</ToggleGroupItem>
            <ToggleGroupItem value="week">Неделя</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup multiple variant="outline" aria-label="Форматирование">
            <ToggleGroupItem value="b" aria-label="Жирный"><BoldIcon /></ToggleGroupItem>
            <ToggleGroupItem value="i" aria-label="Курсив"><ItalicIcon /></ToggleGroupItem>
            <ToggleGroupItem value="u" aria-label="Подчёркнутый"><UnderlineIcon /></ToggleGroupItem>
          </ToggleGroup>
          <ButtonGroup>
            <Button variant="outline"><DownloadIcon data-icon="inline-start" />Excel</Button>
            <Button variant="outline"><PrinterIcon data-icon="inline-start" />Печать</Button>
          </ButtonGroup>
        </Example>
      </DocSection>

      {/* ── Поведение ── */}
      <DocSection title="Поведение" description="Каждая кнопка проходит одни и те же состояния. Нажмите, чтобы увидеть.">
        <PropsTable
          rows={[
            { name: "Покой", values: "default", note: "Подпись — глагол: «Сохранить», «Создать заявку»" },
            { name: "Наведение", values: ":hover", note: "Фон темнее на шаг. На тач-экране наведения нет — ничего важного не прячем в hover" },
            { name: "Нажатие", values: ":active", note: "Сдвиг на 1px вниз — тактильный отклик" },
            { name: "Фокус", values: ":focus-visible", note: "Кольцо 3px. Только с клавиатуры — после клика мышью не появляется" },
            { name: "Недоступна", values: "disabled", note: "50% прозрачности. Если причина неочевидна — подсказка, почему" },
            { name: "Загрузка", values: "aria-busy", note: "Спиннер + текст процесса, кнопка заблокирована — двойная отправка невозможна" },
            { name: "Успех", values: "1.5 с", note: "Галочка + «Сохранено», затем покой. Для фоновых действий — toast" },
          ]}
        />
        <Example code={`<AsyncButton onAction={() => api.save(data)} loadingText="Сохранение…" successText="Сохранено">
  <SaveIcon data-icon="inline-start" />Сохранить
</AsyncButton>

<HoldButton onConfirm={stopLine}>
  <OctagonXIcon />Удерживайте, чтобы остановить
</HoldButton>`}>
          <AsyncButton
            onAction={async () => {
              await wait(1200)
              if (failNext) {
                setFailNext(false)
                toast.error("Не удалось сохранить", { description: "Нет связи с сервером. Повторите через минуту." })
                throw new Error("fail")
              }
            }}
            successText="Сохранено"
          >
            <SaveIcon data-icon="inline-start" />Сохранить
          </AsyncButton>
          <Button variant="ghost" size="sm" onClick={() => setFailNext(true)} disabled={failNext}>
            {failNext ? "Следующее сохранение упадёт" : "Сымитировать ошибку"}
          </Button>
          <HoldButton onConfirm={() => toast.error("Линия сборки №1 остановлена")}>
            <OctagonXIcon />Удерживайте, чтобы остановить линию
          </HoldButton>
          <Tooltip>
            <TooltipTrigger render={<span tabIndex={0} className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />}>
              <Button disabled>Закрыть смену</Button>
            </TooltipTrigger>
            <TooltipContent>Нельзя закрыть: не заполнены простои за 2 часа</TooltipContent>
          </Tooltip>
          <Button disabled><Spinner data-icon="inline-start" />Загрузка…</Button>
        </Example>
      </DocSection>

      {/* ── Кнопки в формах ── */}
      <DocSection title="Кнопки в формах" description="Основная справа, вторичная слева от неё; опасное действие — отдельно, слева. На телефоне — во всю ширину, основная сверху (ближе к пальцу).">
        <Example className="block" code={`<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
  <Button variant="ghost" className="sm:mr-auto"><Trash2Icon />Удалить</Button>
  <Button variant="outline">Отмена</Button>
  <Button type="submit">Сохранить</Button>
</div>`}>
          <form className="flex max-w-xl flex-col gap-6" onSubmit={(e) => { e.preventDefault(); toast.success("Сохранено") }}>
            <FieldGroup>
              <Field><FieldLabel htmlFor="b-title">Название операции</FieldLabel><Input id="b-title" defaultValue="Замена уплотнителя" /></Field>
              <Field><FieldLabel htmlFor="b-desc">Описание</FieldLabel><Textarea id="b-desc" rows={2} /></Field>
            </FieldGroup>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" className="text-destructive hover:text-destructive sm:mr-auto"><Trash2Icon data-icon="inline-start" />Удалить</Button>
              <Button type="button" variant="outline">Отмена</Button>
              <Button type="submit">Сохранить</Button>
            </div>
          </form>
        </Example>
      </DocSection>

      <Rules
        do={[
          "Одна основная кнопка на экран или форму; остальные — outline/ghost.",
          "Подпись — глагол с объектом: «Создать заявку», «Экспорт в Excel».",
          "Долгое действие — AsyncButton: спиннер, блокировка, «Сохранено».",
          "Критичное на терминале — HoldButton (удержание), в офисе — AlertDialog.",
          "Недоступная кнопка объясняет причину подсказкой.",
        ]}
        dont={[
          "Не красьте обычные действия в красный — красный только для опасных.",
          "Не пишите «ОК», «Да», «Применить» без объекта.",
          "Не делайте кнопку-иконку без подписи для экранного диктора и подсказки.",
          "Не меняйте местами основную и вторичную кнопку между экранами.",
          "Не ставьте больше 3 кнопок в ряд — остальные в меню «⋯».",
        ]}
      />
    </DocPage>
  )
}
