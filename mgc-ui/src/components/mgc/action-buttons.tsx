import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/*
 * Кнопки с поведением. Спецификация: docs/03-components.md → AsyncButton / HoldButton.
 */

type ButtonProps = React.ComponentProps<typeof Button>

/**
 * AsyncButton — действие с ожиданием сервера.
 * idle → loading (спиннер, блокировка, текст процесса) → success (галочка 1.5 с) → idle.
 * Ошибка — возврат в idle; сообщение показывает вызывающий код (toast.error).
 * Повторное нажатие во время загрузки невозможно — защита от двойной отправки.
 */
export function AsyncButton({
  onAction,
  loadingText = "Сохранение…",
  successText = "Готово",
  children,
  disabled,
  ...props
}: Omit<ButtonProps, "onClick"> & {
  onAction: () => Promise<unknown>
  loadingText?: string
  successText?: string
}) {
  const [state, setState] = React.useState<"idle" | "loading" | "success">("idle")
  const timer = React.useRef<number>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <Button
      {...props}
      disabled={disabled || state === "loading"}
      aria-busy={state === "loading"}
      data-state={state}
      onClick={async () => {
        if (state !== "idle") return
        setState("loading")
        try {
          await onAction()
          setState("success")
          timer.current = window.setTimeout(() => setState("idle"), 1500)
        } catch {
          setState("idle")
        }
      }}
    >
      {state === "loading" ? (
        <>
          <Spinner data-icon="inline-start" />
          {loadingText}
        </>
      ) : state === "success" ? (
        <>
          <CheckIcon data-icon="inline-start" />
          {successText}
        </>
      ) : (
        children
      )}
      <span className="sr-only" aria-live="polite">
        {state === "loading" ? loadingText : state === "success" ? successText : ""}
      </span>
    </Button>
  )
}

/**
 * HoldButton — подтверждение удержанием (критичные действия на терминалах:
 * «Остановить линию», «Списать партию»). Отпустили раньше — отмена.
 * Клавиатура: удерживайте Пробел или Enter.
 */
export function HoldButton({
  onConfirm,
  holdMs = 1500,
  children,
  className,
  variant = "destructive",
  ...props
}: Omit<ButtonProps, "onClick" | "onPointerDown" | "onPointerUp"> & {
  onConfirm: () => void
  holdMs?: number
}) {
  const [progress, setProgress] = React.useState(0)
  const raf = React.useRef<number>(0)
  const start = React.useRef<number>(0)
  const done = React.useRef(false)

  const stop = React.useCallback(() => {
    cancelAnimationFrame(raf.current)
    if (!done.current) setProgress(0)
  }, [])

  const begin = React.useCallback(() => {
    done.current = false
    start.current = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start.current) / holdMs)
      setProgress(p)
      if (p >= 1) {
        done.current = true
        onConfirm()
        window.setTimeout(() => {
          done.current = false
          setProgress(0)
        }, 600)
        return
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [holdMs, onConfirm])

  React.useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <Button
      {...props}
      variant={variant}
      className={cn("relative touch-none overflow-hidden select-none", className)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        begin()
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault()
          begin()
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") stop()
      }}
      aria-describedby={undefined}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-current opacity-15"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative inline-flex items-center gap-1.5">{children}</span>
      <span className="sr-only">Удерживайте для подтверждения</span>
    </Button>
  )
}
