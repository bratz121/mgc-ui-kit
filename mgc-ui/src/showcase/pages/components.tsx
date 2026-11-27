import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  FactoryIcon,
  InfoIcon,
  OctagonXIcon,
  PlusIcon,
  SearchIcon,
  WrenchIcon,
} from "lucide-react"
import { toast } from "sonner"

import { StatCard } from "@/components/mgc/stat-card"
import { StatusBadge, STATUS_LIST } from "@/components/mgc/status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { DocPage, DocSection, Example, Mono, PropsTable, Rules } from "../doc"

/* ───────────────────────────── Формы ───────────────────────────── */

const LINES = [
  { label: "Выберите линию", value: null },
  { label: "Линия сборки №1", value: "l1" },
  { label: "Линия сборки №2", value: "l2" },
  { label: "Окрасочный цех", value: "paint" },
  { label: "Сварочный участок", value: "weld" },
]

export function FormsPage() {
  return (
    <DocPage
      title="Формы и поля"
      lead={<>Поля всегда собираются через <Mono>FieldGroup</Mono> + <Mono>Field</Mono>: подпись, контрол, подсказка, ошибка. Подпись — над полем.</>}
    >
      <DocSection title="Пример: заявка на ремонт">
        <Example
          className="block"
          code={`<FieldGroup>
  <Field>
    <FieldLabel htmlFor="equipment">Оборудование</FieldLabel>
    <InputGroup>
      <InputGroupAddon><SearchIcon /></InputGroupAddon>
      <InputGroupInput id="equipment" placeholder="Код или название" />
    </InputGroup>
  </Field>
  <Field data-invalid>
    <FieldLabel htmlFor="downtime">Простой</FieldLabel>
    <InputGroup>
      <InputGroupInput id="downtime" aria-invalid defaultValue="-5" />
      <InputGroupAddon align="inline-end"><InputGroupText>мин</InputGroupText></InputGroupAddon>
    </InputGroup>
    <FieldError>Простой не может быть отрицательным</FieldError>
  </Field>
</FieldGroup>`}
        >
          <form className="max-w-xl" onSubmit={(e) => { e.preventDefault(); toast.success("Заявка создана", { description: "ЗН-2026-00482 · Линия сборки №1" }) }}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="equipment">Оборудование</FieldLabel>
                <InputGroup>
                  <InputGroupAddon><SearchIcon /></InputGroupAddon>
                  <InputGroupInput id="equipment" placeholder="Код или название, например ПР-114" />
                </InputGroup>
                <FieldDescription>Начните вводить — подскажем из справочника.</FieldDescription>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Участок</FieldLabel>
                  <Select items={LINES} defaultValue={null}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {LINES.map((l) => (
                          <SelectItem key={l.label} value={l.value}>{l.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field data-invalid>
                  <FieldLabel htmlFor="downtime">Простой</FieldLabel>
                  <InputGroup>
                    <InputGroupInput id="downtime" aria-invalid defaultValue="-5" inputMode="numeric" />
                    <InputGroupAddon align="inline-end"><InputGroupText>мин</InputGroupText></InputGroupAddon>
                  </InputGroup>
                  <FieldError>Простой не может быть отрицательным</FieldError>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="descr">Описание неисправности</FieldLabel>
                <Textarea id="descr" placeholder="Что произошло, при каких условиях" rows={3} />
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="stop" />
                <FieldLabel htmlFor="stop" className="font-normal">Линия остановлена</FieldLabel>
              </Field>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">Отмена</Button>
                <Button type="submit">Создать заявку</Button>
              </div>
            </FieldGroup>
          </form>
        </Example>
      </DocSection>

      <DocSection title="Состояния поля">
        <Example className="grid gap-6 sm:grid-cols-3" code={`<Input placeholder="Обычное" />\n<Input disabled defaultValue="Недоступно" />\n<Input aria-invalid defaultValue="Ошибка" />`}>
          <Field><FieldLabel htmlFor="s1">Обычное</FieldLabel><Input id="s1" placeholder="Введите значение" /></Field>
          <Field data-disabled><FieldLabel htmlFor="s2">Недоступно</FieldLabel><Input id="s2" disabled defaultValue="ПР-114" /></Field>
          <Field data-invalid><FieldLabel htmlFor="s3">Ошибка</FieldLabel><Input id="s3" aria-invalid defaultValue="ПР-1" /><FieldError>Нет такого кода</FieldError></Field>
        </Example>
      </DocSection>

      <Rules
        do={[
          "Подпись над полем, коротко: «Оборудование», а не «Введите оборудование».",
          "Единицы измерения — в аддоне справа (мин, шт, кг).",
          "Ошибку пишите по-человечески и с выходом: что не так и как исправить.",
          "Валидируйте по потере фокуса и при отправке, не на каждый символ.",
        ]}
        dont={[
          "Не используйте placeholder вместо подписи.",
          "Не блокируйте кнопку отправки без объяснения — лучше покажите ошибки.",
          "Не верстайте форму div + space-y — только FieldGroup.",
        ]}
      />
    </DocPage>
  )
}

/* ─────────────────────────── Статусы ─────────────────────────── */

export function StatusesPage() {
  return (
    <DocPage
      title="Статусы и бейджи"
      lead={<>Единый словарь статусов для всех модулей — компонент <Mono>{"<StatusBadge />"}</Mono>. Статус = точка + слово. Цвет никогда не единственный носитель смысла.</>}
    >
      <DocSection title="Словарь статусов">
        <Example code={`import { StatusBadge } from "@/components/mgc/status-badge"\n\n<StatusBadge status="in_progress" />\n<StatusBadge status="stopped" label="Авария" />`}>
          {STATUS_LIST.map((s) => <StatusBadge key={s.key} status={s.key} />)}
        </Example>
        <PropsTable
          rows={STATUS_LIST.map((s) => ({ name: s.key, values: `variant="${s.variant}"`, note: s.label }))}
        />
      </DocSection>
      <DocSection title="Бейджи" description="Badge — короткая метка: категория, счётчик, тег. Для статусов используйте StatusBadge.">
        <Example code={`<Badge>Новое</Badge>\n<Badge variant="outline">Сварка</Badge>\n<Badge variant="success">+2,4%</Badge>\n<Badge variant="brand">MGC</Badge>`}>
          <Badge>По умолчанию</Badge>
          <Badge variant="secondary">Вторичный</Badge>
          <Badge variant="outline">Сварка</Badge>
          <Badge variant="info">Инфо</Badge>
          <Badge variant="success">+2,4%</Badge>
          <Badge variant="warning">Скоро срок</Badge>
          <Badge variant="destructive">−1,1%</Badge>
          <Badge variant="brand">MGC</Badge>
        </Example>
      </DocSection>
      <DocSection title="Уведомления в потоке" description="Alert — сообщение, привязанное к экрану или блоку. Не всплывает, не исчезает сам.">
        <div className="grid gap-3 md:grid-cols-2">
          <Alert variant="info"><InfoIcon /><AlertTitle>Плановое обслуживание</AlertTitle><AlertDescription>Пресс ПР-114 будет недоступен 28.11 с 08:00 до 12:00.</AlertDescription></Alert>
          <Alert variant="success"><CheckCircle2Icon /><AlertTitle>План смены выполнен</AlertTitle><AlertDescription>Выпущено 1 248 из 1 200 изделий.</AlertDescription></Alert>
          <Alert variant="warning"><AlertTriangleIcon /><AlertTitle>Отклонение от такта</AlertTitle><AlertDescription>Линия №2 отстаёт на 6% за последний час.</AlertDescription></Alert>
          <Alert variant="critical"><OctagonXIcon /><AlertTitle>Остановка линии</AlertTitle><AlertDescription>Сварочный участок стоит 14 мин. Ответственный уведомлён.</AlertDescription></Alert>
        </div>
      </DocSection>
    </DocPage>
  )
}

/* ─────────────────────── Карточки и KPI ─────────────────────── */

export function CardsPage() {
  return (
    <DocPage
      title="Карточки и KPI"
      lead="Card — контейнер блока на дашборде. StatCard — готовая KPI-карточка: подпись, значение, изменение. Цветная полоса сверху (tone) — когда карточка соответствует категории или статусу."
    >
      <DocSection title="StatCard">
        <Example
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          code={`<StatCard label="Выпуск за смену" value="1 248" unit="шт" delta={4.2} />
<StatCard label="Простои" value="47" unit="мин" delta={12} higherIsBetter={false} />
<StatCard label="Новые заявки" value="12" tone="steel" />`}
        >
          <StatCard label="Выпуск за смену" value="1 248" unit="шт" delta={4.2} icon={<FactoryIcon className="size-4" />} />
          <StatCard label="OEE" value="78,4" unit="%" delta={1.3} />
          <StatCard label="Простои" value="47" unit="мин" delta={12} higherIsBetter={false} />
          <StatCard label="Брак" value="0,8" unit="%" delta={-0.3} higherIsBetter={false} />
        </Example>
        <Example className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Новые" value="12" tone="steel" delta={2.7} deltaLabel="к прошлой неделе" />
          <StatCard label="Ожидают запчасти" value="20" tone="ochre" delta={2.7} higherIsBetter={false} deltaLabel="к прошлой неделе" />
          <StatCard label="В работе" value="57" tone="rose" delta={-0.6} deltaLabel="к прошлой неделе" />
          <StatCard label="Выполнены" value="98" tone="olive" delta={2.9} deltaLabel="к прошлой неделе" />
        </Example>
      </DocSection>
      <DocSection title="Card" description="Всегда полная композиция: CardHeader → CardTitle/CardDescription → CardContent → CardFooter.">
        <Example
          className="block"
          code={`<Card>
  <CardHeader>
    <CardTitle>Пресс ПР-114</CardTitle>
    <CardDescription>Линия сборки №1</CardDescription>
    <CardAction><StatusBadge status="in_progress" /></CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>`}
        >
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Пресс ПР-114</CardTitle>
              <CardDescription>Линия сборки №1 · ТО каждые 250 ч</CardDescription>
              <CardAction><StatusBadge status="in_progress" /></CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Наработка до ТО</span><span className="tabular-nums">212 / 250 ч</span></div>
              <Progress value={85} />
            </CardContent>
            <CardFooter className="justify-end gap-2 border-t py-3">
              <Button variant="outline" size="sm">История</Button>
              <Button size="sm">Открыть</Button>
            </CardFooter>
          </Card>
        </Example>
      </DocSection>
    </DocPage>
  )
}

/* ───────────────────────── Обратная связь ───────────────────────── */

export function FeedbackPage() {
  return (
    <DocPage
      title="Обратная связь"
      lead="Toast — результат действия, исчезает сам. Progress — известная длительность. Skeleton — загрузка структуры. Spinner — короткое ожидание в кнопке. Empty — пустое состояние с выходом."
    >
      <DocSection title="Toast">
        <Example code={`import { toast } from "sonner"\n\ntoast.success("Заявка создана", { description: "ЗН-2026-00482" })\ntoast.error("Не удалось сохранить", { description: "Нет связи с сервером" })`}>
          <Button variant="outline" onClick={() => toast.success("Заявка создана", { description: "ЗН-2026-00482 · Линия сборки №1" })}>Успех</Button>
          <Button variant="outline" onClick={() => toast.error("Не удалось сохранить", { description: "Нет связи с сервером. Повторите через минуту." })}>Ошибка</Button>
          <Button variant="outline" onClick={() => toast("Отчёт формируется", { description: "Пришлём ссылку, когда будет готов" })}>Нейтральный</Button>
          <span className="text-sm text-muted-foreground">Горячие клавиши: <Kbd>D</Kbd> — сменить тему</span>
        </Example>
      </DocSection>
      <DocSection title="Загрузка">
        <Example className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Выгрузка отчёта · 64%</span>
            <Progress value={64} />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Загрузка данных…</div>
        </Example>
      </DocSection>
      <DocSection title="Пустое состояние">
        <Example className="block">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><WrenchIcon /></EmptyMedia>
              <EmptyTitle>Заявок нет</EmptyTitle>
              <EmptyDescription>На выбранном участке за этот период заявок на ремонт не было.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button><PlusIcon data-icon="inline-start" />Создать заявку</Button>
            </EmptyContent>
          </Empty>
        </Example>
      </DocSection>
    </DocPage>
  )
}

