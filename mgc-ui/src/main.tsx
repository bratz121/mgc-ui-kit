import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { ModuleProvider } from "@/components/platform/module-context"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="mgc-ui-theme">
      <ModuleProvider storageKey="mgc-ui-module">
        <TooltipProvider>
          <App />
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </ModuleProvider>
    </ThemeProvider>
  </StrictMode>
)
