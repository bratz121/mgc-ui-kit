import * as React from "react"
import { ChevronDownIcon, ClockIcon, LogOutIcon, PanelLeftIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "cn"

import { StatusBadge } from "@/components/mgc/status-badge"
import { BackLink, ModuleLink, ModuleSwitcher, RecordPager, RelatedRecords } from "@/components/platform/cross-nav"
import { PLATFORM_MODULES, type PlatformModuleKey } from "@/components/platform/modules"
import { ModuleTile } from "@/components/platform/platform-sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocPage, DocSection, Example, PropsTable, Rules } from "../doc"
import { REQUESTS } from "../data"
import { NavigationComponentSections } from "./more"

const prevent = (e: React.MouseEvent) => e.preventDefault()

/* ── Анатомия бокового меню (статичная копия для схемы) ── */

function SidebarAnatomy() {
  const callout = (n: number) => (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background tabular-nums">{n}</span>
  )
  const apps: PlatformModuleKey[] = ["andon", "maintenance", "plantReport", "qrci"]
  return (
    <div data-module="maintenance" className="w-full max-w-[360px] overflow-hidden rounded-xl border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b px-3">
        {callout(1)}
        <span className="flex-1 truncate text-base">Производственный контур</span>
        <PanelLeftIcon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-0.5 p-2">
        <div className="flex items-center gap-2 px-2 pb-1">{callout(2)}<span className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">Площадка Липецк</span></div>
        {apps.map((k) =>
          k === "maintenance" ? (
            <div key={k} className="rounded-lg bg-sidebar-accent">
              <div className="flex items-center gap-2.5 px-2 py-2">
                <ModuleTile moduleKey={k} />
                <span className="flex-1 text-sm">{PLATFORM_MODULES[k].name}</span>
                {callout(4)}
                <ChevronDownIcon className="size-4 rotate-180 text-muted-foreground" />
              </div>
              <div className="pb-2">
                {["Заявки", "План ТО", "Оборудование"].map((t, i) => (
                  <div key={t} className={cn("relative flex items-center gap-2 py-1.5 pr-3 pl-[50px] text-sm text-muted-foreground", i === 0 && "text-foreground")}>
                    {i === 0 && <span className="absolute inset-y-1 left-0 w-[3px] rounded-r-xs bg-sidebar-primary" />}
                    <span className="flex-1">{t}</span>
                    {i === 0 && callout(5)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div key={k} className="flex items-center gap-2.5 px-2 py-2 text-sm text-muted-foreground">
              <ModuleTile moduleKey={k} />
              <span className="flex-1">{PLATFORM_MODULES[k].name}</span>
              {k === "andon" && callout(3)}
            </div>
          )
        )}
      </div>
      <div className="flex items-center gap-2.5 border-t px-3 py-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-module-soft text-xs font-semibold text-module-strong">PZ</span>
        <span className="flex flex-1 flex-col text-xs"><span>p.zheludkov</span><span className="text-muted-foreground tabular-nums">Сессия: 07:42:15</span></span>
        {callout(6)}
        <LogOutIcon className="size-4 text-muted-foreground" />
      </div>
    </div>
  )
}

/* ── Страница записи: путь внутри приложения ── */

function RecordHeaderDemo() {
  const [i, setI] = React.useState(0)
  const r = REQUESTS[i]
  return (
    <div data-module="maintenance" className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackLink onClick={() => toast("Возврат к реестру с сохранёнными фильтрами")}>К реестру заявок</BackLink>
        <RecordPager index={i} total={REQUESTS.length} onPrev={() => setI((x) => Math.max(0, x - 1))} onNext={() => setI((x) => Math.min(REQUESTS.length - 1, x + 1))} />
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#" onClick={prevent}>Техобслуживание</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="max-sm:hidden"><BreadcrumbLink href="#" onClick={prevent}>{r.area}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem><BreadcrumbLink href="#" onClick={prevent} className="font-mono">{r.code}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage className="font-mono">{r.id}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-2xl font-semibold">{r.equipment}</h3>
        <StatusBadge status={r.status} />
      </div>
      <Tabs defaultValue="info">
        <div className="-mx-1 overflow-x-auto px-1 pb-1.5 [scrollbar-width:none]">
        <TabsList variant="line">
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="history">История <Badge variant="secondary">4</Badge></TabsTrigger>
          <TabsTrigger value="docs">Документы</TabsTrigger>
        </TabsList>
        </div>
        <TabsContent value="info" className="pt-3 text-sm text-muted-foreground">Участок {r.area} · простой {r.downtime} мин · исполнитель {r.assignee}</TabsContent>
        <TabsContent value="history" className="pt-3 text-sm text-muted-foreground">4 события по заявке.</TabsContent>
        <TabsContent value="docs" className="pt-3 text-sm text-muted-foreground">Акт и инструкция.</TabsContent>
      </Tabs>
    </div>
  )
}

export function NavigationPage() {
  const [current, setCurrent] = React.useState<PlatformModuleKey>("andon")
  return (
    <DocPage
      title="Навигация"
      lead="Три уровня: платформа (какое приложение), модуль (какой раздел), запись (где я внутри). У каждого уровня — свой инструмент, и они не подменяют друг друга."
    >
      <PropsTable
        rows={[
          { name: "Платформа", values: "Боковое меню · лаунчер · ModuleLink", note: "Переход в смежное приложение: всегда видно, куда (плитка и цвет модуля), открывается в новой вкладке с контекстом" },
          { name: "Модуль", values: "Разделы в меню · Tabs", note: "Разделы текущего модуля — под его плиткой в меню; виды данных одного раздела — вкладки" },
          { name: "Запись", values: "BackLink · Breadcrumb · RecordPager · Tabs line", note: "Откуда пришёл, где в иерархии, соседние записи, разделы карточки" },
        ]}
      />

      <DocSection title="Боковое меню" description="То же меню, что слева на этой странице и в текущих Vue-проектах. Цифры — зоны меню.">
        <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
          <SidebarAnatomy />
          <ol className="flex flex-col gap-3 text-sm">
            {[
              ["Шапка", "Знак «ПК» и название платформы → на главную. Кнопка сворачивает меню полностью (Ctrl + B)."],
              ["Площадка", "Название площадки из config.js — на разных заводах разный набор модулей."],
              ["Другие модули", "Плитка + название. Открываются в новой вкладке. Модуль без ссылки скрыт."],
              ["Текущий модуль", "Подложка, стрелка сворачивает разделы. Группы разделов тоже сворачиваются."],
              ["Активный раздел", "Полоса слева цветом акцента модуля (--module-strong)."],
              ["Пользователь", "Инициалы, логин, таймер сессии, выход."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background tabular-nums">{i + 1}</span>
                <span><span className="font-medium">{t}.</span> <span className="text-muted-foreground">{d}</span></span>
              </li>
            ))}
            <li className="mt-2 rounded-lg bg-muted/60 p-3 text-muted-foreground">
              Ширина 360px. Постоянно — с 1024px; уже (планшет, телефон) — выезжающая панель по кнопке в шапке. На телефоне внутри модуля основная навигация — нижнее меню (BottomNav).
            </li>
          </ol>
        </div>
      </DocSection>

      <DocSection title="Путь внутри приложения" description="Карточка записи: возврат к списку с сохранёнными фильтрами, путь по иерархии, листание соседних записей без возврата к списку, разделы карточки.">
        <Example code={`<BackLink onClick={backToList}>К реестру заявок</BackLink>
<RecordPager index={i} total={total} onPrev={prev} onNext={next} />
<Breadcrumb>…Техобслуживание › Линия сборки №1 › ПР-114 › ЗН-2026-00481</Breadcrumb>
<Tabs><TabsList variant="line">…</TabsList></Tabs>`} className="block p-3">
          <RecordHeaderDemo />
        </Example>
      </DocSection>

      <DocSection title="Путь в смежные приложения" description="Записи связаны между модулями: простой в Андоне → заявка в ТОиР → отчёт смены → карточка улучшения. Переход несёт контекст (код оборудования, номер записи) и показывает, в какое приложение ведёт.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Example className="block" code={`<ModuleSwitcher current="andon" urls={config.PROJECT_URLS[location]} />`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <ModuleSwitcher current={current} onSelect={(m) => { setCurrent(m); toast(`Открыть «${PLATFORM_MODULES[m].name}» в новой вкладке`) }} />
                <span className="text-sm text-muted-foreground">Лаунчер приложений в шапке — все модули площадки</span>
              </div>
            </div>
          </Example>
          <Example className="block" code={`<ModuleLink module="maintenance" href={tooirUrl + "/requests/new?equipment=ПР-114"}>
  Создать заявку на ремонт
</ModuleLink>`}>
            <div data-module="andon" className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm">
                <ModuleTile moduleKey="andon" />
                <span className="font-medium">Простой · Линия сборки №1 · ПР-114</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <ModuleLink module="maintenance">Создать заявку на ремонт</ModuleLink>
                <ModuleLink module="plantReport">Смена 2 · 27.11.2026</ModuleLink>
                <ModuleLink module="qrci">Карточка улучшения</ModuleLink>
              </div>
            </div>
          </Example>
        </div>
        <Example className="block" code={`<RelatedRecords items={[
  { module: "maintenance", title: "ЗН-2026-00481 · Пресс ПР-114", meta: "Иванов А. С.", status: <StatusBadge status="in_progress" /> },
  { module: "qrci", title: "QRCI-0192 · Течь гидравлики" },
]} />`}>
          <div className="flex w-full flex-col gap-2">
            <span className="text-sm font-medium">Связанные записи</span>
            <RelatedRecords
              items={[
                { module: "maintenance", title: "ЗН-2026-00481 · Пресс ПР-114", meta: "Иванов А. С.", status: <StatusBadge status="in_progress" /> },
                { module: "andon", title: "Простой 14:18–15:00 · 42 мин", meta: "Линия сборки №1", status: <StatusBadge status="done" label="Закрыт" /> },
                { module: "qrci", title: "QRCI-0192 · Течь гидравлики прессов", meta: "8D, этап D4", status: <StatusBadge status="in_progress" /> },
                { module: "claims", title: "РК-2026-031 · Подтёк масла у клиента", meta: "Связь по партии", status: <StatusBadge status="new" /> },
              ]}
            />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Недавние" description="Последние открытые записи — быстрый возврат без поиска. В шапке модуля или на главной.">
        <Example className="block">
          <ul className="flex flex-wrap gap-2">
            {REQUESTS.slice(0, 4).map((r) => (
              <li key={r.id}>
                <a href="#" onClick={prevent} data-module="maintenance" className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-module-soft">
                  <ClockIcon className="size-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs">{r.id}</span>
                  <span className="max-w-40 truncate">{r.equipment}</span>
                </a>
              </li>
            ))}
          </ul>
        </Example>
      </DocSection>

      <NavigationComponentSections />

      <Rules
        do={[
          "Ссылка в другой модуль — всегда с его плиткой и названием, в новой вкладке.",
          "Передавайте контекст в ссылке: код оборудования, номер записи, дату смены.",
          "Возврат к списку сохраняет фильтры, сортировку и прокрутку (состояние в URL).",
          "В карточке записи — листание соседних записей, чтобы не возвращаться к списку.",
          "Хлебные крошки — только для иерархии глубже 2 уровней.",
        ]}
        dont={[
          "Не дублируйте пункты бокового меню вкладками и наоборот.",
          "Не открывайте модули платформы в том же окне — пользователь потеряет свою работу.",
          "Не прячьте переход в смежный модуль только в меню «⋯» — это частое действие.",
          "Не делайте хлебные крошки кликабельными на текущей странице.",
        ]}
      />
    </DocPage>
  )
}
