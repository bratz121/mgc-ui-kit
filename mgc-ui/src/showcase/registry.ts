import type * as React from "react"
import type { PlatformPage } from "@/components/platform/platform-sidebar"

/** Страница витрины: пункт меню + описание для поиска и содержания. */
export type ShowcasePage = PlatformPage & {
  /** Короткое описание — в поиске и в содержании. */
  summary: string
  /** Названия компонентов и синонимы для поиска. */
  keywords?: string[]
  render: (go: (id: string) => void) => React.ReactNode
}
