import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "cn"

/*
 * TagInput — множественный ввод значений: ввели → Enter → чип → вводите следующее.
 * Разделители: Enter, «,», «;», Tab (если в поле есть текст). Вставка списка (из Excel,
 * через запятую или с новой строки) разбивается на отдельные значения.
 * Backspace в пустом поле удаляет последний чип. Дубли не добавляются.
 * Спецификация: docs/03-components.md → TagInput.
 */

export type TagInputProps = {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  /** Вернуть текст ошибки, если значение недопустимо. */
  validate?: (v: string) => string | null
  /** Нормализация перед добавлением (например, toUpperCase для кодов). */
  transform?: (v: string) => string
  max?: number
  /** Моноширинные чипы — для кодов, серийных номеров. */
  mono?: boolean
  disabled?: boolean
  id?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  onError?: (message: string | null) => void
  className?: string
}

const SPLIT = /[,;\n\t]+/

export function TagInput({
  value,
  onChange,
  placeholder = "Введите и нажмите Enter",
  validate,
  transform = (v) => v.trim(),
  max,
  mono,
  disabled,
  id,
  onError,
  className,
  ...aria
}: TagInputProps) {
  const [draft, setDraft] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const full = max !== undefined && value.length >= max

  const add = (raw: string[]) => {
    const next = [...value]
    let error: string | null = null
    for (const r of raw) {
      const v = transform(r)
      if (!v) continue
      if (max !== undefined && next.length >= max) {
        error = `Не больше ${max}`
        break
      }
      if (next.some((x) => x.toLowerCase() === v.toLowerCase())) {
        error = `«${v}» уже добавлено`
        continue
      }
      const e = validate?.(v) ?? null
      if (e) {
        error = e
        continue
      }
      next.push(v)
    }
    if (next.length !== value.length) onChange(next)
    onError?.(error)
    return error === null
  }

  const commit = () => {
    if (!draft.trim()) return false
    const ok = add([draft])
    if (ok) setDraft("")
    return true
  }

  const remove = (i: number) => {
    onChange(value.filter((_, j) => j !== i))
    onError?.(null)
    inputRef.current?.focus()
  }

  return (
    <div
      data-slot="tag-input"
      aria-invalid={aria["aria-invalid"]}
      data-disabled={disabled ? "" : undefined}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "flex min-h-8 w-full cursor-text flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent px-1.5 py-1 text-sm transition-colors",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-disabled:pointer-events-none data-disabled:opacity-50 dark:bg-input/30",
        className
      )}
    >
      {value.map((v, i) => (
        <span
          key={v}
          className={cn(
            "inline-flex h-6 max-w-full items-center gap-0.5 rounded-md bg-secondary pr-0.5 pl-2 text-secondary-foreground",
            mono && "font-mono text-xs"
          )}
        >
          <span className="truncate">{v}</span>
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation()
              remove(i)
            }}
            className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <XIcon className="size-3" />
            <span className="sr-only">Удалить {v}</span>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        value={draft}
        disabled={disabled || full}
        aria-describedby={aria["aria-describedby"]}
        placeholder={full ? `Максимум ${max}` : value.length ? "" : placeholder}
        onChange={(e) => {
          const v = e.target.value
          if (SPLIT.test(v)) {
            const parts = v.split(SPLIT)
            const tail = parts.pop() ?? ""
            add(parts)
            setDraft(tail)
          } else {
            setDraft(v)
            onError?.(null)
          }
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return
          if (e.key === "Enter") {
            e.preventDefault()
            commit()
          } else if (e.key === "Tab" && draft.trim()) {
            e.preventDefault()
            commit()
          } else if (e.key === "Backspace" && draft === "" && value.length) {
            e.preventDefault()
            remove(value.length - 1)
          } else if (e.key === "Escape") {
            setDraft("")
          }
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text")
          if (SPLIT.test(text)) {
            e.preventDefault()
            add(text.split(SPLIT))
          }
        }}
        onBlur={() => commit()}
        className={cn(
          "h-6 min-w-24 flex-1 bg-transparent px-1 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          mono && "font-mono text-xs"
        )}
      />
    </div>
  )
}
