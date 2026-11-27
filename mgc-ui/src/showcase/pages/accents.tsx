import { CheckIcon, ClipboardListIcon, HouseIcon, UserIcon } from "lucide-react"
import { cn } from "cn"

import { useModule } from "@/components/platform/module-context"
import { MODULES_WITH_ACCENT, PLATFORM_MODULES } from "@/components/platform/modules"
import { ModuleTile } from "@/components/platform/platform-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"

/* Контраст рассчитан при генерации шкал (better-colors): strong на фоне / на soft, светлая и тёмная тема. */
const CONTRAST: Record<string, [number, number, number]> = {
  platform: [5.23, 4.56, 6.56], andon: [5.11, 4.53, 7.27], maintenance: [5.21, 4.57, 7.03], plantReport: [5.11, 4.5, 7.15],
  qrci: [5.17, 4.54, 7.07], change: [5.2, 4.54, 6.91], audits: [5.21, 4.56, 7.02], planning: [5.17, 4.54, 7.07],
  projects: [5.17, 4.54, 7.07], claims: [5.2, 4.54, 6.91], quotation: [5.2, 4.54, 6.91], docs: [5.2, 4.55, 6.91],
  drawings: [5.22, 4.55, 7.01], infoboards: [5.22, 4.56, 7.0],
}

/** Как акцент выглядит в интерфейсе — компоненты реагируют на data-module. */
function AccentPreview({ moduleKey }: { moduleKey: string }) {
  return (
    <div data-module={moduleKey} className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-2">
      <div className="flex flex-col gap-1 rounded-lg border bg-sidebar p-2">
        <span className="px-2 pb-1 text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">Разделы</span>
        {["Заявки", "План ТО", "Оборудование"].map((t, i) => (
          <span key={t} className={cn("relative py-2 pl-6 text-sm text-muted-foreground", i === 0 && "text-foreground")}>
            {i === 0 && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-xs bg-sidebar-primary" />}
            {t}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="a">
          <TabsList variant="line">
            <TabsTrigger value="a">Информация</TabsTrigger>
            <TabsTrigger value="b">История</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm"><span>План ТО выполнен</span><span className="tabular-nums">68%</span></div>
          <Progress value={68} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="module">{PLATFORM_MODULES[moduleKey as keyof typeof PLATFORM_MODULES].name}</Badge>
          <Avatar className="size-8"><AvatarFallback className="bg-module-soft text-xs font-semibold text-module-strong">ИА</AvatarFallback></Avatar>
          <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-medium text-module-strong underline underline-offset-4">Ссылка в модуле</a>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border md:col-span-2">
        <Table data-density="compact">
          <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-10"><Checkbox checked indeterminate aria-label="Выбрать все" /></TableHead><TableHead>Номер</TableHead><TableHead>Оборудование</TableHead></TableRow></TableHeader>
          <TableBody>
            <TableRow data-state="selected"><TableCell><Checkbox checked aria-label="Выбрана" /></TableCell><TableCell className="font-mono text-xs">ЗН-2026-00481</TableCell><TableCell>Пресс ПР-114 — выбранная строка</TableCell></TableRow>
            <TableRow><TableCell><Checkbox aria-label="Не выбрана" /></TableCell><TableCell className="font-mono text-xs">ЗН-2026-00480</TableCell><TableCell>Робот РС-07</TableCell></TableRow>
          </TableBody>
        </Table>
      </div>
      <nav className="grid grid-cols-3 rounded-lg border md:col-span-2" aria-label="Пример нижнего меню">
        {[[HouseIcon, "Сводка"], [ClipboardListIcon, "Заявки"], [UserIcon, "Профиль"]].map(([I, l], i) => {
          const Icon = I as typeof HouseIcon
          return (
            <span key={l as string} className={cn("relative flex flex-col items-center gap-0.5 py-2 text-[11px] text-muted-foreground", i === 1 && "font-medium text-foreground")}>
              {i === 1 && <span className="absolute inset-x-6 top-0 h-0.5 rounded-b-full bg-module-strong" />}
              <Icon className="size-5" />{l as string}
            </span>
          )
        })}
      </nav>
    </div>
  )
}

export function AccentsPage() {
  const { module, setModule } = useModule()
  const active = module === "uiKit" ? "platform" : module
  return (
    <DocPage
      title="Акценты модулей"
      lead="У каждого модуля платформы — свой цвет: «слеш» в его логотипе. Этот цвет — акцент интерфейса модуля: пользователь по нему понимает, где находится. Основа (кнопки, статусы, графики) остаётся общей — так модули узнаваемы, но работают одинаково."
    >
      <DocSection title="Модули и их цвета" description="Нажмите на модуль — акцент применится ко всей витрине: полоса активного пункта меню, вкладки, прогресс, выбранные строки, аватар. Логотипы белые — показываем их на тёмном фоне.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES_WITH_ACCENT.map((k) => {
            const m = PLATFORM_MODULES[k]
            const on = active === k
            const [cw, cs, cd] = CONTRAST[k]
            return (
              <button
                key={k}
                type="button"
                data-module={k}
                aria-pressed={on}
                onClick={() => setModule(k)}
                className={cn(
                  "flex flex-col overflow-hidden rounded-xl border bg-card text-left outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50",
                  on ? "ring-2 ring-module-strong" : "hover:border-foreground/30"
                )}
              >
                <div className="flex h-20 items-center bg-[oklch(0.2_0_0)] px-4">
                  {m.logo ? <img src={m.logo} alt={`ПК ${m.name}`} className="max-h-10 max-w-full object-contain" /> : null}
                </div>
                <div className="flex flex-col gap-3 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ModuleTile moduleKey={k} />
                    <span className="min-w-0 flex-1 text-sm font-medium">{m.name}</span>
                    {on && <Badge variant="module"><CheckIcon data-icon="inline-start" />Активен</Badge>}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    {[["mark", "var(--module-mark)", m.accent], ["strong", "var(--module-strong)", `${cw}:1`], ["soft", "var(--module-soft)", `${cs}:1`]].map(([n, v, note]) => (
                      <div key={n} className="flex flex-col gap-1">
                        <span className="h-6 rounded-md border" style={{ background: v }} />
                        <span className="font-mono text-muted-foreground">{n}</span>
                        <span className="font-mono tabular-nums">{note}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums">Тёмная тема: strong {cd}:1 на карточке</span>
                </div>
              </button>
            )
          })}
        </div>
      </DocSection>

      <DocSection title="Как акцент выглядит в интерфейсе" description={`Сейчас: ${PLATFORM_MODULES[active].name}. Те же компоненты в каждом модуле — меняется только акцент.`}>
        <AccentPreview moduleKey={active} />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setModule("platform")}>Сбросить на платформу</Button>
        </div>
      </DocSection>

      <DocSection title="Токены">
        <PropsTable
          rows={[
            { name: "--module-mark", values: "цвет логотипа", note: "Только декоративные метки (слеш, точка) и тёмные поверхности. На светлом фоне часто < 3:1 — не для текста" },
            { name: "--module-strong", values: "≥ 4.5:1", note: "Текст, иконки, ссылки модуля, полоса активного пункта, линия вкладки, прогресс" },
            { name: "--module-soft", values: "подложка", note: "Выбранная строка, панель выделения, аватар, бейдж модуля" },
            { name: "--module-solid / -foreground", values: "≥ 4.5:1", note: "Заливка с текстом поверх (редко: чип модуля на тёмном фоне)" },
            { name: "data-module", values: "andon | maintenance | …", note: "На <html> (ModuleProvider) или на любом контейнере — для превью чужого модуля" },
          ]}
        />
        <Example className="block" code={`// Приложение «Техобслуживание»
<ModuleProvider module="maintenance">
  <App />
</ModuleProvider>

// Vue / обычный HTML — достаточно атрибута
<html data-module="maintenance">

// Классы Tailwind
<span className="text-module-strong" />
<tr className="bg-module-soft" />
<Badge variant="module">Техобслуживание</Badge>`}>
          <span className="text-sm text-muted-foreground">Подключение — по кнопке «Код».</span>
        </Example>
      </DocSection>

      <Rules
        do={[
          "Акцент модуля = «где я»: активный пункт меню, вкладка, выбранное, прогресс, ссылки модуля.",
          "В навигации между модулями показывайте плитку и цвет целевого модуля.",
          "Цвет логотипа (--module-mark) — только для меток и на тёмном фоне.",
          "Проверяйте новые модули: strong ≥ 4.5:1 на фоне и на soft в обеих темах.",
        ]}
        dont={[
          "Не красьте основную кнопку в цвет модуля — основное действие везде графитовое.",
          "Не используйте акцент для статусов: «Простои и дефекты» зелёные, как статус «Успех» — смысл смешается.",
          "Не используйте акцент в графиках — у серий своя проверенная палитра.",
          "Не пишите текст цветом логотипа на светлом фоне (песок — 1.5:1).",
        ]}
      />
    </DocPage>
  )
}
