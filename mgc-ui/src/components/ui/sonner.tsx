"use client"

import { useTheme } from "@/components/theme-provider"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      // MGC: статусные тосты окрашены токенами кита (мягкая подложка + цветной текст и рамка)
      richColors
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--success-soft)",
          "--success-text": "var(--success)",
          "--success-border": "color-mix(in oklch, var(--success) 30%, transparent)",
          "--error-bg": "var(--destructive-soft)",
          "--error-text": "var(--destructive)",
          "--error-border": "color-mix(in oklch, var(--destructive) 30%, transparent)",
          "--warning-bg": "var(--warning-soft)",
          "--warning-text": "var(--warning)",
          "--warning-border": "color-mix(in oklch, var(--warning) 30%, transparent)",
          "--info-bg": "var(--info-soft)",
          "--info-text": "var(--info)",
          "--info-border": "color-mix(in oklch, var(--info) 30%, transparent)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
