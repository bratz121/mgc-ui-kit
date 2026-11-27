import * as React from "react"
import { CameraIcon, ChevronRightIcon, MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "cn"

import { ShowMoreList, ExpandableText } from "@/components/mgc/disclosure"
import { OkNok, type OkNokValue } from "@/components/mgc/ok-nok"
import { StatusBadge } from "@/components/mgc/status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"
import { REQUESTS } from "../data"

/* ── Чекбоксы: выбрать все ── */

const SHIFT_AREAS = { "Сборка": ["Линия №1", "Линия №2", "Испытания"], "Кузов": ["Сварка", "Окраска"] }

function CheckboxTree() {
  const all = Object.values(SHIFT_AREAS).flat()
  const [sel, setSel] = React.useState<Set<string>>(new Set(["Линия №1", "Сварка"]))
  const toggle = (items: string[], on: boolean) =>
    setSel((s) => {
      const n = new Set(s)
      items.forEach((i) => (on ? n.add(i) : n.delete(i)))
      return n
    })
  const state = (items: string[]) => {
    const c = items.filter((i) => sel.has(i)).length
    return { checked: c === items.length, indeterminate: c > 0 && c < items.length }
  }
  const root = state(all)
  return (
    <FieldSet>
      <FieldLegend variant="label">Участки в отчёте</FieldLegend>
      <Field orientation="horizontal">
        <Checkbox id="t-all" checked={root.checked} indeterminate={root.indeterminate} onCheckedChange={(v) => toggle(all, !!v)} />
        <FieldLabel htmlFor="t-all">Все участки <span className="font-normal text-muted-foreground tabular-nums">{sel.size} из {all.length}</span></FieldLabel>
      </Field>
      <div className="flex flex-col gap-3 pl-6">
        {Object.entries(SHIFT_AREAS).map(([g, items]) => {
          const st = state(items)
          return (
            <div key={g} className="flex flex-col gap-2.5">
              <Field orientation="horizontal">
                <Checkbox id={`t-${g}`} checked={st.checked} indeterminate={st.indeterminate} onCheckedChange={(v) => toggle(items, !!v)} />
                <FieldLabel htmlFor={`t-${g}`}>{g}</FieldLabel>
              </Field>
              <div className="flex flex-col gap-2.5 pl-6">
                {items.map((i) => (
                  <Field key={i} orientation="horizontal">
                    <Checkbox id={`t-${i}`} checked={sel.has(i)} onCheckedChange={(v) => toggle([i], !!v)} />
                    <FieldLabel htmlFor={`t-${i}`} className="font-normal">{i}</FieldLabel>
                  </Field>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </FieldSet>
  )
}

/* ── Чек-лист контроля OK / NOK ── */

const CHECKPOINTS = [
  { id: "c1", title: "Момент затяжки болтов крепления М12", norm: "85 ± 5 Н·м" },
  { id: "c2", title: "Зазор двери / крыло", norm: "4,0 ± 0,5 мм" },
  { id: "c3", title: "Отсутствие подтёков ЛКП", norm: "Визуально" },
  { id: "c4", title: "Маркировка VIN читается", norm: "Визуально" },
  { id: "c5", title: "Герметичность гидросистемы", norm: "0 капель / 10 мин" },
  { id: "c6", title: "Фаркоп (если установлен)", norm: "По комплектации" },
]

function InspectionChecklist({ terminal }: { terminal?: boolean }) {
  const [vals, setVals] = React.useState<Record<string, OkNokValue>>({ c1: "ok", c2: "ok", c3: "nok" })
  const [notes, setNotes] = React.useState<Record<string, string>>({ c3: "Подтёк на заднем крыле справа" })
  const ok = Object.values(vals).filter((v) => v === "ok").length
  const nok = Object.values(vals).filter((v) => v === "nok").length
  const na = Object.values(vals).filter((v) => v === "na").length
  const done = ok + nok + na
  const total = CHECKPOINTS.length
  const missingNotes = CHECKPOINTS.filter((c) => vals[c.id] === "nok" && !notes[c.id]?.trim()).length
  return (
    <div data-module="qrci" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="font-medium">Кузов VIN …4471 · пост ОТК-2</span>
        <span className="flex gap-3 tabular-nums">
          <span className="text-success">ОК {ok}</span>
          <span className="text-destructive">НОК {nok}</span>
          <span className="text-muted-foreground">Н/П {na}</span>
          <span className="text-muted-foreground">Не проверено {total - done}</span>
        </span>
        <Progress value={(done / total) * 100} className="min-w-32 flex-1" />
      </div>
      <ul className="flex flex-col divide-y rounded-xl border bg-card">
        {CHECKPOINTS.map((c, i) => {
          const v = vals[c.id] ?? null
          return (
            <li key={c.id} className={cn("flex flex-col gap-3 p-3 md:p-4", v === "nok" && "bg-destructive-soft/50")}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="w-6 font-mono text-xs text-muted-foreground tabular-nums">{i + 1}.</span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className={cn("font-medium", terminal && "text-base")}>{c.title}</span>
                  <span className="text-xs text-muted-foreground">Норма: {c.norm}</span>
                </div>
                <OkNok label={c.title} value={v} onChange={(nv) => setVals((s) => ({ ...s, [c.id]: nv }))} allowNa={c.id === "c6"} size={terminal ? "lg" : "default"} />
              </div>
              {v === "nok" && (
                <div className="flex flex-col gap-2 pl-10 sm:flex-row sm:items-start">
                  <Textarea
                    rows={2}
                    aria-label={`Описание несоответствия: ${c.title}`}
                    aria-invalid={!notes[c.id]?.trim()}
                    placeholder="Обязательно: что не так и где"
                    value={notes[c.id] ?? ""}
                    onChange={(e) => setNotes((s) => ({ ...s, [c.id]: e.target.value }))}
                    className="flex-1"
                  />
                  <Button variant="outline"><CameraIcon data-icon="inline-start" />Фото</Button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {done === total && nok === 0 && (
        <Alert variant="success"><AlertTitle>Кузов годен</AlertTitle><AlertDescription>Все точки контроля в норме.</AlertDescription></Alert>
      )}
      {nok > 0 && (
        <Alert variant="critical"><AlertTitle>Несоответствий: {nok}</AlertTitle><AlertDescription>Кузов уйдёт на доработку. {missingNotes ? `Опишите несоответствия (${missingNotes}).` : "Описания заполнены."}</AlertDescription></Alert>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setVals({}); setNotes({}) }}>Сбросить</Button>
        <Button disabled={done < total || missingNotes > 0} onClick={() => toast.success(nok ? "Отправлено на доработку" : "Кузов принят ОТК")}>
          {nok ? "Отправить на доработку" : "Принять"}
        </Button>
      </div>
    </div>
  )
}

/* ── Страница ── */

export function ControlsPage() {
  const [device, setDevice] = React.useState("desktop")
  const [advanced, setAdvanced] = React.useState(false)
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const [single, setSingle] = React.useState<OkNokValue>(null)
  return (
    <DocPage
      title="Выбор, «под кат» и OK / NOK"
      lead="Чекбоксы, радио и переключатели — для выбора; «под кат» — чтобы не вываливать всё сразу; OK / NOK — для результатов контроля качества. Выпадающие списки — на отдельной странице."
    >
      <PropsTable
        rows={[
          { name: "Checkbox", values: "независимые флаги", note: "Можно выбрать несколько; «выбрать все» — с промежуточным состоянием" },
          { name: "RadioGroup", values: "один из 2–5", note: "Все варианты видны сразу; для сложных вариантов — карточки" },
          { name: "Switch", values: "вкл / выкл", note: "Применяется сразу, без кнопки «Сохранить»" },
          { name: "ToggleGroup", values: "режим / период", note: "Короткие варианты в одну строку" },
          { name: "OkNok", values: "ОК / НОК / Н/П", note: "Результат проверки точки контроля" },
          { name: "Под кат", values: "ShowMore · Collapsible · раскрытие строки", note: "Второстепенное — по запросу" },
        ]}
      />

      {/* ── Чекбоксы ── */}
      <DocSection title="Чекбоксы" description="«Выбрать все» показывает промежуточное состояние, если выбрана часть. Подпись кликабельна. Описание — под подписью.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Example className="block"><CheckboxTree /></Example>
          <Example className="block" code={`<Field orientation="horizontal">
  <Checkbox id="n1" />
  <FieldContent>
    <FieldLabel htmlFor="n1">Уведомлять об остановках</FieldLabel>
    <FieldDescription>Push и e-mail мастеру смены</FieldDescription>
  </FieldContent>
</Field>`}>
            <FieldGroup>
              {[["Уведомлять об остановках", "Push и e-mail мастеру смены", true], ["Ежедневный отчёт", "В 08:00 на почту", false], ["Только мои заявки", "Скрыть заявки других исполнителей", false]].map(([t, d, c]) => (
                <Field key={t as string} orientation="horizontal">
                  <Checkbox id={`cb-${t}`} defaultChecked={c as boolean} />
                  <FieldContent>
                    <FieldLabel htmlFor={`cb-${t}`}>{t as string}</FieldLabel>
                    <FieldDescription>{d as string}</FieldDescription>
                  </FieldContent>
                </Field>
              ))}
              <Field orientation="horizontal" data-disabled>
                <Checkbox id="cb-dis" disabled defaultChecked />
                <FieldLabel htmlFor="cb-dis">Недоступно (задано администратором)</FieldLabel>
              </Field>
            </FieldGroup>
          </Example>
        </div>
      </DocSection>

      {/* ── Радио ── */}
      <DocSection title="Радиокнопки" description="Список — для коротких вариантов; карточки — когда у варианта есть описание или иконка.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Example className="block" code={`<RadioGroup defaultValue="high">
  <Field orientation="horizontal">
    <RadioGroupItem value="high" id="p-high" />
    <FieldLabel htmlFor="p-high">Высокий</FieldLabel>
  </Field>
</RadioGroup>`}>
            <FieldSet>
              <FieldLegend variant="label">Приоритет заявки</FieldLegend>
              <RadioGroup defaultValue="high">
                {[["critical", "Критичный — линия стоит"], ["high", "Высокий"], ["normal", "Обычный"], ["low", "Низкий"]].map(([v, l]) => (
                  <Field key={v} orientation="horizontal">
                    <RadioGroupItem value={v} id={`r-${v}`} />
                    <FieldLabel htmlFor={`r-${v}`} className="font-normal">{l}</FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
            </FieldSet>
          </Example>
          <Example className="block" code={`<RadioGroup value={device} onValueChange={setDevice}>
  <FieldLabel htmlFor="d-tablet">
    <Field orientation="horizontal">
      <FieldContent><FieldTitle>Планшет</FieldTitle><FieldDescription>…</FieldDescription></FieldContent>
      <RadioGroupItem value="tablet" id="d-tablet" />
    </Field>
  </FieldLabel>
</RadioGroup>`}>
            <FieldSet className="w-full">
              <FieldLegend variant="label">Устройство поста</FieldLegend>
              <RadioGroup value={device} onValueChange={(v) => setDevice(v as string)}>
                {[["desktop", "Рабочее место", "Монитор, мышь, клавиатура", MonitorIcon], ["tablet", "Планшет", "Обход оборудования", TabletIcon], ["phone", "Телефон", "Мастер смены на ходу", SmartphoneIcon]].map(([v, t, d, I]) => {
                  const Icon = I as typeof MonitorIcon
                  return (
                    <FieldLabel key={v as string} htmlFor={`d-${v}`} className="rounded-xl border p-0 has-data-checked:border-module-strong has-data-checked:bg-module-soft">
                      <Field orientation="horizontal" className="p-3">
                        <Icon className="size-5 text-muted-foreground" />
                        <FieldContent>
                          <FieldTitle>{t as string}</FieldTitle>
                          <FieldDescription>{d as string}</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value={v as string} id={`d-${v}`} />
                      </Field>
                    </FieldLabel>
                  )
                })}
              </RadioGroup>
            </FieldSet>
          </Example>
        </div>
      </DocSection>

      {/* ── Переключатели ── */}
      <DocSection title="Переключатели и сегменты" description="Switch — настройка, которая применяется сразу. ToggleGroup — режим или период.">
        <Example className="grid gap-6 md:grid-cols-2">
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldContent><FieldLabel htmlFor="sw1">Автообновление дашборда</FieldLabel><FieldDescription>Каждые 30 секунд</FieldDescription></FieldContent>
              <Switch id="sw1" defaultChecked />
            </Field>
            <Field orientation="horizontal">
              <FieldContent><FieldLabel htmlFor="sw2">Звук андон-сигнала</FieldLabel><FieldDescription>На терминале участка</FieldDescription></FieldContent>
              <Switch id="sw2" />
            </Field>
          </FieldGroup>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">Период</span>
            <ToggleGroup defaultValue={["week"]} variant="outline">
              <ToggleGroupItem value="shift">Смена</ToggleGroupItem>
              <ToggleGroupItem value="day">День</ToggleGroupItem>
              <ToggleGroupItem value="week">Неделя</ToggleGroupItem>
              <ToggleGroupItem value="month">Месяц</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Example>
      </DocSection>

      {/* ── Под кат ── */}
      <DocSection title="«Под кат»" description="Второстепенное — по запросу: «Показать ещё» для длинных списков, «Читать полностью» для длинного текста, «Дополнительно» для редких полей формы, раскрытие строки таблицы.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Example className="block" code={`<ShowMoreList items={events} initial={4} step={4} renderItem={(e) => …} />`}>
            <span className="mb-2 block text-sm font-medium">История заявки</span>
            <ShowMoreList
              items={Array.from({ length: 11 }, (_, i) => ({ t: `${String(8 + i).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`, e: ["Создана заявка", "Назначен исполнитель", "Работы начаты", "Запрошена запчасть", "Запчасть выдана", "Комментарий мастера"][i % 6] }))}
              initial={4}
              step={4}
              renderItem={(it) => (
                <div className="flex gap-3 border-b py-2 text-sm last:border-0">
                  <span className="w-12 text-muted-foreground tabular-nums">{it.t}</span>
                  <span>{it.e}</span>
                </div>
              )}
            />
          </Example>
          <Example className="block" code={`<ExpandableText lines={3}>{description}</ExpandableText>`}>
            <span className="mb-2 block text-sm font-medium">Описание неисправности</span>
            <ExpandableText lines={3}>
              При рабочем ходе пресса давление в гидросистеме падает со 180 до 140 бар в течение 3–4 секунд. Течь масла
              видна из-под крышки гидроцилиндра, на полу под прессом лужа около 20 см. Оператор остановил пресс в 08:12,
              детали последней партии (12 шт.) отложены в изолятор брака. Предположительно износ уплотнителя штока,
              последняя замена — 14.03.2026 при наработке 16 400 ч. Требуется комплект РК-114 и 2 часа работы.
            </ExpandableText>
          </Example>
          <Example className="block" code={`<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger render={<Button variant="ghost" />}>Дополнительно</CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>`}>
            <FieldGroup className="max-w-md">
              <Field><FieldLabel htmlFor="f-eq">Оборудование</FieldLabel><Input id="f-eq" defaultValue="ПР-114" /></Field>
              <Collapsible open={advanced} onOpenChange={setAdvanced}>
                <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="-ml-2" />}>
                  <ChevronRightIcon data-icon="inline-start" className={cn("transition-transform", advanced && "rotate-90")} />
                  Дополнительные параметры
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-4 pt-3">
                  <Field><FieldLabel htmlFor="f-cost">Центр затрат</FieldLabel><Input id="f-cost" placeholder="Необязательно" /></Field>
                  <Field><FieldLabel htmlFor="f-ext">Внешний подрядчик</FieldLabel><Input id="f-ext" placeholder="Необязательно" /></Field>
                </CollapsibleContent>
              </Collapsible>
            </FieldGroup>
          </Example>
          <Example className="block p-0">
            <Table data-density="compact">
              <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-8" /><TableHead>Номер</TableHead><TableHead>Оборудование</TableHead><TableHead>Статус</TableHead></TableRow></TableHeader>
              <TableBody>
                {REQUESTS.slice(0, 4).map((r) => (
                  <React.Fragment key={r.id}>
                    <TableRow className="cursor-pointer" onClick={() => setExpanded((x) => (x === r.id ? null : r.id))} aria-expanded={expanded === r.id}>
                      <TableCell><ChevronRightIcon className={cn("size-4 text-muted-foreground transition-transform", expanded === r.id && "rotate-90")} /></TableCell>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="max-w-40 truncate">{r.equipment}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                    {expanded === r.id && (
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableCell />
                        <TableCell colSpan={3} className="whitespace-normal text-sm text-muted-foreground">
                          {r.area} · простой {r.downtime} мин · исполнитель {r.assignee} · создана {r.created}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </Example>
        </div>
      </DocSection>

      {/* ── OK / NOK ── */}
      <DocSection title="OK / NOK — результат контроля" description="ОК — годен, НОК — не годен, Н/П — не применимо. Цвет + иконка + слово. При НОК описание обязательно, можно приложить фото. Пока все точки не проверены — принять нельзя.">
        <Example className="flex-col items-start" code={`<OkNok label="Зазор двери" value={v} onChange={setV} />
<OkNok label="Фаркоп" value={v} onChange={setV} allowNa />
<OkNok label="…" value={v} onChange={setV} size="lg" />   // терминал`}>
          <div className="flex flex-wrap items-center gap-6">
            <OkNok label="Пример" value={single} onChange={setSingle} />
            <OkNok label="Пример с Н/П" value={single} onChange={setSingle} allowNa />
            <span className="text-sm text-muted-foreground">Стрелки ← → — переключение с клавиатуры</span>
          </div>
          <OkNok label="Пример для терминала" value={single} onChange={setSingle} allowNa size="lg" />
        </Example>
        <Example className="block" code={`// Чек-лист: OkNok в строке + обязательный комментарий при НОК + итог`}>
          <InspectionChecklist />
        </Example>
      </DocSection>

      <Rules
        do={[
          "Чекбокс — независимый выбор; радио — один из видимых вариантов.",
          "«Выбрать все» с промежуточным состоянием, если выбрана часть.",
          "OK / NOK — всегда со словом и иконкой; при НОК — обязательное описание.",
          "«Под кат» прячет второстепенное, но счётчик показывает, сколько скрыто.",
        ]}
        dont={[
          "Не используйте чекбокс для мгновенной настройки — для этого Switch.",
          "Не делайте радио из одного варианта и не ставьте больше 5 — тогда Select.",
          "Не кодируйте ОК/НОК только цветом — дальтоник не отличит.",
          "Не прячьте «под кат» обязательные поля и ошибки.",
        ]}
      />
    </DocPage>
  )
}
