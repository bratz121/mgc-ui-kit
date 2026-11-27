import * as React from "react"
import { CheckIcon, CodeIcon, CopyIcon, XIcon } from "lucide-react"
import { cn } from "cn"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

/* Строительные блоки страниц документации витрины. */

export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "")

/** Оглавление страницы со скролл-шпионом — собирается из секций DocSection. */
function PageToc({ root }: { root: React.RefObject<HTMLElement | null> }) {
  const [items, setItems] = React.useState<{ id: string; title: string }[]>([])
  const [active, setActive] = React.useState<string>("")

  React.useEffect(() => {
    const el = root.current
    if (!el) return
    const sections = Array.from(el.querySelectorAll<HTMLElement>("section[data-toc]"))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- оглавление читается из DOM после рендера страницы
    setItems(sections.map((s) => ({ id: s.id, title: s.dataset.toc ?? "" })))
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-80px 0px -60% 0px" }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [root])

  if (items.length < 2) return null
  return (
    <nav aria-label="На этой странице" className="sticky top-24 flex max-h-[calc(100svh-7rem)] flex-col gap-1 overflow-y-auto text-sm">
      <span className="mb-1 text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">На этой странице</span>
      {items.map((it) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
            setActive(it.id)
          }}
          aria-current={active === it.id ? "location" : undefined}
          className="border-l-2 border-transparent py-1 pl-3 text-muted-foreground transition-colors hover:text-foreground aria-[current=location]:border-foreground aria-[current=location]:text-foreground"
        >
          {it.title}
        </a>
      ))}
    </nav>
  )
}

export function DocPage({
  title,
  lead,
  children,
}: {
  title: string
  lead?: React.ReactNode
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLElement>(null)
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-10 px-4 py-8 md:px-8 md:py-10">
      <article ref={ref} className="flex min-w-0 flex-1 flex-col gap-12">
        <header className="flex max-w-3xl flex-col gap-3">
          <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
          {lead && <p className="text-base text-pretty text-muted-foreground">{lead}</p>}
        </header>
        {children}
      </article>
      <aside className="hidden w-52 shrink-0 xl:block">
        <PageToc root={ref} />
      </aside>
    </div>
  )
}

export function DocSection({
  title,
  description,
  children,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section id={slug(title)} data-toc={title} className="flex min-w-0 scroll-mt-24 flex-col gap-5">
      <div className="flex max-w-3xl flex-col gap-1.5">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

type Viewport = "auto" | "tablet" | "phone"
const VIEWPORT_WIDTH: Record<Viewport, string | undefined> = { auto: undefined, tablet: "768px", phone: "375px" }

/** Живой пример + исходник по кнопке «Код». viewports — переключатель ширины превью. */
export function Example({
  code,
  children,
  className,
  viewports,
}: {
  code?: string
  children: React.ReactNode
  className?: string
  viewports?: boolean
}) {
  const [showCode, setShowCode] = React.useState(false)
  const [vp, setVp] = React.useState<Viewport>("auto")
  const width = VIEWPORT_WIDTH[vp]
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border bg-card">
      <div className={cn("min-w-0", width && "overflow-x-auto bg-muted/40 px-3 py-4")}>
        <div
          className={cn("flex flex-wrap items-center gap-3 p-6", width && "mx-auto rounded-lg border bg-card", className)}
          style={width ? { width, maxWidth: "none" } : undefined}
        >
          {children}
        </div>
      </div>
      {(code || viewports) && (
        <>
          <div className="flex items-center justify-end gap-1 border-t bg-muted/40 px-2 py-1.5">
            {viewports && (
              <div className="mr-auto flex items-center gap-0.5" role="radiogroup" aria-label="Ширина превью">
                {(["auto", "tablet", "phone"] as const).map((v) => (
                  <Button
                    key={v}
                    variant={vp === v ? "secondary" : "ghost"}
                    size="sm"
                    role="radio"
                    aria-checked={vp === v}
                    onClick={() => setVp(v)}
                  >
                    {v === "auto" ? "Авто" : v === "tablet" ? "Планшет · 768" : "Телефон · 375"}
                  </Button>
                ))}
              </div>
            )}
            {code && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowCode((v) => !v)}>
                  <CodeIcon data-icon="inline-start" />
                  {showCode ? "Скрыть код" : "Код"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(code.trim())
                    toast.success("Код скопирован")
                  }}
                >
                  <CopyIcon />
                  <span className="sr-only">Скопировать код</span>
                </Button>
              </>
            )}
          </div>
          {showCode && code && (
            <pre className="max-h-96 overflow-auto border-t bg-muted/40 p-4 font-mono text-xs leading-relaxed">
              <code>{code.trim()}</code>
            </pre>
          )}
        </>
      )}
    </div>
  )
}

/** Правила использования: «Делайте» / «Не делайте». */
export function Rules({ do: dos, dont }: { do: React.ReactNode[]; dont: React.ReactNode[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-success">
          <CheckIcon className="size-4" /> Делайте
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {dos.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
          <XIcon className="size-4" /> Не делайте
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {dont.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Таблица свойств/вариантов компонента. */
export function PropsTable({
  rows,
}: {
  rows: { name: string; values: string; note: string }[]
}) {
  return (
    <div className="@container min-w-0 rounded-xl border bg-card">
      {/* Широкий контейнер — таблица */}
      <table className="w-full text-left text-sm @max-xl:hidden">
        <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Свойство</th>
            <th className="px-4 py-2.5 font-medium">Значения</th>
            <th className="px-4 py-2.5 font-medium">Назначение</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b last:border-0">
              <td className="px-4 py-2.5 font-mono text-xs">{r.name}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.values}</td>
              <td className="px-4 py-2.5">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Узкий контейнер — список */}
      <dl className="divide-y @xl:hidden">
        {rows.map((r) => (
          <div key={r.name} className="flex flex-col gap-1 px-4 py-3 text-sm">
            <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-mono text-xs font-medium">{r.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{r.values}</span>
            </dt>
            <dd className="text-pretty">{r.note}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
  )
}
