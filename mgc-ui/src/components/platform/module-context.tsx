import * as React from "react"

import type { PlatformModuleKey } from "./modules"

/*
 * Активный модуль = акцент интерфейса. Ставит data-module на <html>, поэтому
 * акцент получают и порталы (меню, диалоги, выезжающие панели).
 * В продукте модуль фиксирован (каждое приложение знает, кто оно): <ModuleProvider module="maintenance">.
 */

type Ctx = { module: PlatformModuleKey; setModule: (m: PlatformModuleKey) => void }
const ModuleContext = React.createContext<Ctx>({ module: "platform", setModule: () => {} })

export function ModuleProvider({
  module: fixed,
  storageKey,
  children,
}: {
  /** Фиксированный модуль приложения. */
  module?: PlatformModuleKey
  /** Запоминать выбор (только для витрины). */
  storageKey?: string
  children: React.ReactNode
}) {
  const [module, setModuleState] = React.useState<PlatformModuleKey>(() => {
    if (fixed) return fixed
    try {
      const v = storageKey ? localStorage.getItem(storageKey) : null
      return (v as PlatformModuleKey) || "platform"
    } catch {
      return "platform"
    }
  })

  React.useEffect(() => {
    document.documentElement.dataset.module = module === "uiKit" ? "platform" : module
  }, [module])

  const setModule = React.useCallback(
    (m: PlatformModuleKey) => {
      setModuleState(m)
      try {
        if (storageKey) localStorage.setItem(storageKey, m)
      } catch {
        /* хранилище недоступно */
      }
    },
    [storageKey]
  )

  return <ModuleContext.Provider value={{ module, setModule }}>{children}</ModuleContext.Provider>
}

export const useModule = () => React.useContext(ModuleContext)
