import { Logo } from "@/components/brand/logo"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ShowcasePage } from "../registry"
import { DocPage, DocSection, Example, Mono, Rules } from "../doc"

/* ───────────────────────────── Обзор ───────────────────────────── */

export function OverviewPage({ go, pages }: { go: (id: string) => void; pages: ShowcasePage[] }) {
  const groups = Array.from(new Set(pages.filter((p) => p.group).map((p) => p.group!)))
  return (
    <DocPage
      title="UI-кит MGC GROUP"
      lead="Единая дизайн-система для внутренних систем платформы «Производственный контур». Tailwind CSS v4 и shadcn/ui (Base UI), токены — по брендбуку MGC GROUP. Каждая страница — живые примеры, код и правила."
    >
      <div className="relative overflow-hidden rounded-2xl bg-[oklch(0.2_0_0)] p-8 text-white md:p-12">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-1/2 opacity-90 [background:repeating-linear-gradient(115deg,transparent_0_22px,var(--mgc-red)_22px_26px,transparent_26px_48px)] [mask-image:linear-gradient(to_left,black,transparent)]"
        />
        <div className="relative flex max-w-xl flex-col gap-6">
          <Logo className="h-10 max-w-full text-white" />
          <p className="text-lg text-white/80">
            Один набор компонентов, одни токены, одни правила — для Андона, ТОиР, производственного отчёта и всех модулей платформы.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="brand">v0.2</Badge>
            <Badge className="bg-white/10 text-white">Tailwind v4</Badge>
            <Badge className="bg-white/10 text-white">shadcn/ui · Base UI</Badge>
            <Badge className="bg-white/10 text-white">Светлая и тёмная темы</Badge>
            <Badge className="bg-white/10 text-white">Телефон, планшет, терминал</Badge>
          </div>
        </div>
      </div>

      <DocSection title="Содержание" description="Поиск по всем страницам и компонентам — Ctrl + K.">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((g) => (
            <div key={g} className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">{g}</h4>
              <ul className="flex flex-col">
                {pages.filter((p) => p.group === g).map((p) => (
                  <li key={p.id}>
                    <a
                      href={`#${p.id}`}
                      onClick={(e) => { e.preventDefault(); go(p.id) }}
                      className="group -mx-2 flex flex-col rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                    >
                      <span className="font-medium underline-offset-4 group-hover:underline">{p.title}</span>
                      <span className="text-sm text-muted-foreground">{p.summary}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Быстрый старт" description="Подробно — docs/05-integration.md.">
        <Example
          className="block"
          code={`# 1. Токены — в любой проект (React, Vue 2/3, HTML)
@import "./styles/tokens.css";

# 2. React + Tailwind v4: компоненты shadcn берут стиль из components.json кита
NODE_USE_ENV_PROXY=1 npx shadcn@latest add button data-table

# 3. Каркас приложения
<SidebarProvider style={{ "--sidebar-width": "22.5rem" }}>
  <PlatformSidebar … />
  <SidebarInset>
    <PlatformHeader title="Заявки" />
    …
  </SidebarInset>
</SidebarProvider>`}
        >
          <dl className="grid w-full gap-x-8 gap-y-4 text-sm md:grid-cols-3">
            {[
              ["Данные прежде всего", "Экран — рабочий инструмент мастера, инженера, аналитика. Плотно, читаемо, без декора, который не несёт смысла."],
              ["Красный — сигнал", "Фирменный красный — бренд и критичные состояния (остановка, ошибка). Основное действие — графитовая кнопка."],
              ["Одни токены везде", "Цвета, радиусы и шрифты — только через токены. Никаких #hex в компонентах. Тёмная тема — бесплатно."],
            ].map(([t, d]) => (
              <div key={t} className="flex flex-col gap-1">
                <dt className="font-medium">{t}</dt>
                <dd className="text-muted-foreground">{d}</dd>
              </div>
            ))}
          </dl>
        </Example>
      </DocSection>
    </DocPage>
  )
}

/* ───────────────────────────── Цвета ───────────────────────────── */

function Swatch({ name, varName, hex, light }: { name: string; varName: string; hex?: string; light?: boolean }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <div
        className="h-20 border-b"
        style={{ background: `var(${varName})` }}
        data-light={light ? "" : undefined}
      />
      <div className="flex flex-col gap-0.5 p-3">
        <span className="text-sm font-medium">{name}</span>
        <span className="font-mono text-xs text-muted-foreground">{varName}</span>
        {hex && <span className="font-mono text-xs text-muted-foreground">{hex}</span>}
      </div>
    </div>
  )
}

export function ColorsPage() {
  return (
    <DocPage
      title="Цвета"
      lead="Палитра взята из брендбука MGC GROUP (стр. 6–7). В коде используются только семантические токены — они сами переключаются между светлой и тёмной темой."
    >
      <DocSection title="Бренд-палитра" description="Основные цвета айдентики. В компонентах напрямую не используются — только через семантику.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <Swatch name="Красный" varName="--mgc-red" hex="#EC0000" />
          <Swatch name="Чёрный" varName="--mgc-black" hex="#161616" />
          <Swatch name="Серый 900" varName="--mgc-gray-900" hex="#2D2D2D" />
          <Swatch name="Серый 700" varName="--mgc-gray-700" hex="#5B5B5B" />
          <Swatch name="Серый 500" varName="--mgc-gray-500" hex="#8A8A8A" />
          <Swatch name="Серый 300" varName="--mgc-gray-300" hex="#B9B9B9" />
          <Swatch name="Серый 100" varName="--mgc-gray-100" hex="#E8E8E8" />
          <Swatch name="Белый" varName="--mgc-white" hex="#FFFFFF" />
        </div>
      </DocSection>

      <DocSection title="Дополнительная палитра" description="Приглушённые цвета из брендбука — для графиков, категорий и цветовых маркеров карточек.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <Swatch name="Сталь" varName="--mgc-steel" hex="#5B77AA" />
          <Swatch name="Охра" varName="--mgc-ochre" hex="#B3814C" />
          <Swatch name="Шалфей" varName="--mgc-sage" hex="#9AB98C" />
          <Swatch name="Роза" varName="--mgc-rose" hex="#BE8281" />
          <Swatch name="Сланец" varName="--mgc-slate" hex="#718896" />
          <Swatch name="Песок" varName="--mgc-sand" hex="#D9C791" />
          <Swatch name="Олива" varName="--mgc-olive" hex="#92915D" />
          <Swatch name="Кирпич" varName="--mgc-brick" hex="#983221" />
        </div>
      </DocSection>

      <DocSection title="Семантические токены" description="Используйте эти имена в Tailwind: bg-primary, text-muted-foreground, border-border…">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Swatch name="Фон" varName="--background" />
          <Swatch name="Карточка" varName="--card" />
          <Swatch name="Текст" varName="--foreground" />
          <Swatch name="Вторичный текст" varName="--muted-foreground" />
          <Swatch name="Основное действие" varName="--primary" />
          <Swatch name="Бренд" varName="--brand" />
          <Swatch name="Подложка" varName="--muted" />
          <Swatch name="Граница" varName="--border" />
          <Swatch name="Граница поля" varName="--input" />
          <Swatch name="Фокус" varName="--ring" />
          <Swatch name="Сайдбар" varName="--sidebar" />
          <Swatch name="Бренд мягкий" varName="--brand-soft" />
        </div>
      </DocSection>

      <DocSection title="Статусы" description="Каждый статус — пара: насыщенный цвет для текста/иконки и мягкая подложка. Контраст текста на подложке ≥ 4.5:1.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Успех", "success", "Выполнено, норма, в плане"],
            ["Внимание", "warning", "В работе, отклонение, скоро срок"],
            ["Информация", "info", "Новое, справка, нейтральный акцент"],
            ["Критично", "destructive", "Остановка, ошибка, удаление"],
          ].map(([name, key, use]) => (
            <div key={key} className="flex flex-col gap-3 rounded-xl border bg-card p-4">
              <div className="flex gap-2">
                <div className="h-12 flex-1 rounded-lg" style={{ background: `var(--${key})` }} />
                <div className="h-12 flex-1 rounded-lg" style={{ background: `var(--${key}-soft)` }} />
              </div>
              <div>
                <div className="text-sm font-medium">{name}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  --{key} · --{key}-soft
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{use}</div>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Графики" description="Порядок серий фиксирован: chart-1 → chart-5. Красный в графиках не используется — он читается как «плохо».">
        <div className="flex h-16 overflow-hidden rounded-xl border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-1 items-end p-2" style={{ background: `var(--chart-${i})` }}>
              <span className="rounded-sm bg-background/80 px-1.5 font-mono text-[11px]">chart-{i}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Правила">
        <Rules
          do={[
            "Основное действие на экране — графитовая кнопка (variant=\"default\").",
            "Красный — для логотипа, активного пункта меню и критичных статусов.",
            "Цвет статуса всегда дублируйте текстом или иконкой.",
            "В коде пишите bg-card, text-muted-foreground — не hex и не bg-gray-500.",
          ]}
          dont={[
            "Не красьте обычные кнопки «Сохранить», «Добавить» в красный.",
            "Не используйте --mgc-* переменные в компонентах напрямую.",
            "Не используйте серый 500 (#8A8A8A) для текста на белом — контраст 3.4:1.",
            "Не придумывайте новые оттенки — добавьте токен в tokens.css и в спеку.",
          ]}
        />
      </DocSection>
    </DocPage>
  )
}

/* ─────────────────────────── Типографика ─────────────────────────── */

export function TypographyPage() {
  const scale = [
    { cls: "text-4xl font-semibold", tw: "text-4xl / 600", px: "36", use: "Заголовок раздела витрины, промо-экраны" },
    { cls: "text-3xl font-semibold", tw: "text-3xl / 600", px: "30", use: "Крупные KPI-значения" },
    { cls: "text-2xl font-semibold", tw: "text-2xl / 600", px: "24", use: "Заголовок страницы" },
    { cls: "text-lg font-medium", tw: "text-lg / 500", px: "18", use: "Заголовок в шапке, название системы" },
    { cls: "text-base font-medium", tw: "text-base / 500", px: "16", use: "Заголовок карточки, пункт меню" },
    { cls: "text-sm", tw: "text-sm / 400", px: "14", use: "Основной текст интерфейса, таблицы, поля" },
    { cls: "text-xs text-muted-foreground", tw: "text-xs / 400", px: "12", use: "Подписи, мета, бейджи" },
  ]
  return (
    <DocPage
      title="Типографика"
      lead="IBM Plex Sans — основной шрифт интерфейса (есть в брендбуке среди фирменных). IBM Plex Mono из той же семьи — для кодов, номеров, артикулов и выравнивания цифр."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Основной · font-sans</CardDescription>
            <CardTitle className="text-4xl font-semibold">IBM Plex Sans</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-2xl">Аа Бб Вв Гг Дд Ее Жж 0123456789</p>
            <p className="text-muted-foreground">Вариативный, 100–700. В интерфейсе используем 400, 500, 600.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Моноширинный · font-mono</CardDescription>
            <CardTitle className="font-mono text-4xl font-medium">IBM Plex Mono</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="font-mono text-2xl">ЗН-2026-00481 · 12:45:08</p>
            <p className="text-muted-foreground">400 и 500. Номера заявок, коды оборудования, время, версии.</p>
          </CardContent>
        </Card>
      </div>

      <DocSection title="Шкала" description="Только эти размеры. Межстрочные интервалы — встроенные в Tailwind.">
        <div className="divide-y rounded-xl border bg-card">
          {scale.map((s) => (
            <div key={s.tw} className="grid items-baseline gap-2 p-4 md:grid-cols-[1fr_140px_220px]">
              <span className={s.cls + " truncate"}>Сменное задание выполнено</span>
              <span className="font-mono text-xs text-muted-foreground">{s.tw} · {s.px}px</span>
              <span className="text-xs text-muted-foreground">{s.use}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Цифры" description="В таблицах и KPI всегда tabular-nums — цифры одной ширины, столбцы не «пляшут».">
        <Example
          code={`<td className="text-right tabular-nums">1 302,38</td>\n<span className="font-mono">ЗН-2026-00481</span>`}
          className="grid grid-cols-2 gap-8"
        >
          <div>
            <div className="mb-2 text-xs text-muted-foreground">Пропорциональные</div>
            <div className="text-right text-lg">111,11<br />888,88<br />1 017,40</div>
          </div>
          <div>
            <div className="mb-2 text-xs text-muted-foreground">tabular-nums</div>
            <div className="text-right text-lg tabular-nums">111,11<br />888,88<br />1 017,40</div>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Правила">
        <Rules
          do={[
            "Числа форматируйте по-русски: 1 302,38 (toLocaleString(\"ru-RU\")).",
            "Даты — ДД.ММ.ГГГГ, время — ЧЧ:ММ.",
            "Заголовки — с заглавной буквы, без точки в конце.",
            "Длинные названия обрезайте truncate + title с полным текстом.",
          ]}
          dont={[
            "Не используйте ВЕРХНИЙ РЕГИСТР для текста — только для коротких меток групп.",
            "Не используйте жирный 700 в интерфейсе — максимум 600.",
            "Не смешивайте Plex с другими шрифтами.",
            "Не делайте текст мельче 12px.",
          ]}
        />
      </DocSection>
    </DocPage>
  )
}

/* ───────────────────────────── Логотип ───────────────────────────── */

export function LogoPage() {
  return (
    <DocPage
      title="Логотип"
      lead={<>Векторы взяты из брендбука. Компонент <Mono>{"<Logo />"}</Mono> наследует цвет от текста — задавайте его через text-foreground, text-brand или text-white.</>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex h-44 items-center justify-center rounded-xl border bg-card p-6">
          <Logo className="h-10 max-w-full text-foreground" />
        </div>
        <div className="flex h-44 items-center justify-center rounded-xl bg-[oklch(0.2_0_0)] p-6">
          <Logo className="h-10 max-w-full text-white" />
        </div>
        <div className="flex h-44 items-center justify-center rounded-xl bg-brand p-6">
          <Logo className="h-10 max-w-full text-white" />
        </div>
      </div>
      <Example
        code={`import { Logo } from "@/components/brand/logo"\n\n<Logo variant="horizontal" className="h-8" />\n<Logo variant="vertical" className="h-16" />\n<Logo variant="mark" className="h-8 text-brand" />\n<Logo variant="mgc-horizontal" className="h-8" />`}
        className="items-end gap-10"
      >
        <div className="flex flex-col items-center gap-3"><Logo variant="horizontal" className="h-8" /><Mono>horizontal</Mono></div>
        <div className="flex flex-col items-center gap-3"><Logo variant="vertical" className="h-16" /><Mono>vertical</Mono></div>
        <div className="flex flex-col items-center gap-3"><Logo variant="mark" className="h-10 text-brand" /><Mono>mark</Mono></div>
        <div className="flex flex-col items-center gap-3"><Logo variant="mgc-horizontal" className="h-8" /><Mono>mgc-horizontal</Mono></div>
        <div className="flex flex-col items-center gap-3"><Logo variant="mgc-vertical" className="h-16" /><Mono>mgc-vertical</Mono></div>
      </Example>
      <Rules
        do={[
          "Минимальная высота горизонтальной версии — 20px, знака — 16px.",
          "Охранное поле — не меньше высоты буквы «M» со всех сторон.",
          "На фото и цветном фоне — белая версия.",
        ]}
        dont={[
          "Не перекрашивайте логотип в цвета дополнительной палитры.",
          "Не растягивайте, не поворачивайте, не добавляйте тени.",
          "Не набирайте «MGC GROUP» шрифтом вместо логотипа.",
        ]}
      />
    </DocPage>
  )
}
