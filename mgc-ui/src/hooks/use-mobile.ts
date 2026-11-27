import * as React from "react"

/** true, если окно уже breakpoint (по умолчанию 768px — телефон). */
export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 1}px)`
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query]
  )
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
