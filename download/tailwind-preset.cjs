/* @mgc/ui 0.5.0 — пресет Tailwind v3. Сгенерировано scripts/build-package.mjs. */

/**
 * tailwind.config.js:  module.exports = { presets: [require("@mgc/ui/tailwind-preset")], content: [...] }
 * И подключите переменные: import "@mgc/ui/tokens.css" (+ "@mgc/ui/fonts.css").
 * Цвета — через CSS-переменные, поэтому тёмная тема переключается классом .dark на <html>.
 * Модификаторы прозрачности (bg-primary/50) в v3 с var() не работают — используйте *-soft токены.
 */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
            "background": "var(--background)",
            "foreground": "var(--foreground)",
            "card": {
                  "DEFAULT": "var(--card)",
                  "foreground": "var(--card-foreground)"
            },
            "popover": {
                  "DEFAULT": "var(--popover)",
                  "foreground": "var(--popover-foreground)"
            },
            "primary": {
                  "DEFAULT": "var(--primary)",
                  "foreground": "var(--primary-foreground)"
            },
            "secondary": {
                  "DEFAULT": "var(--secondary)",
                  "foreground": "var(--secondary-foreground)"
            },
            "muted": {
                  "DEFAULT": "var(--muted)",
                  "foreground": "var(--muted-foreground)"
            },
            "accent": {
                  "DEFAULT": "var(--accent)",
                  "foreground": "var(--accent-foreground)"
            },
            "brand": {
                  "DEFAULT": "var(--brand)",
                  "foreground": "var(--brand-foreground)",
                  "soft": "var(--brand-soft)"
            },
            "destructive": {
                  "DEFAULT": "var(--destructive)",
                  "foreground": "var(--destructive-foreground)",
                  "soft": "var(--destructive-soft)"
            },
            "success": {
                  "DEFAULT": "var(--success)",
                  "foreground": "var(--success-foreground)",
                  "soft": "var(--success-soft)"
            },
            "warning": {
                  "DEFAULT": "var(--warning)",
                  "foreground": "var(--warning-foreground)",
                  "soft": "var(--warning-soft)"
            },
            "info": {
                  "DEFAULT": "var(--info)",
                  "foreground": "var(--info-foreground)",
                  "soft": "var(--info-soft)"
            },
            "border": "var(--border)",
            "input": "var(--input)",
            "ring": "var(--ring)",
            "chart-1": "var(--chart-1)",
            "chart-2": "var(--chart-2)",
            "chart-3": "var(--chart-3)",
            "chart-4": "var(--chart-4)",
            "chart-5": "var(--chart-5)",
            "seq-1": "var(--seq-1)",
            "seq-2": "var(--seq-2)",
            "seq-3": "var(--seq-3)",
            "seq-4": "var(--seq-4)",
            "seq-5": "var(--seq-5)",
            "sidebar": {
                  "DEFAULT": "var(--sidebar)",
                  "foreground": "var(--sidebar-foreground)",
                  "accent": "var(--sidebar-accent)",
                  "accent-foreground": "var(--sidebar-accent-foreground)",
                  "border": "var(--sidebar-border)",
                  "ring": "var(--sidebar-ring)"
            },
            "module": {
                  "mark": "var(--module-mark)",
                  "strong": "var(--module-strong)",
                  "soft": "var(--module-soft)",
                  "solid": "var(--module-solid)",
                  "solid-foreground": "var(--module-solid-foreground)"
            }
      },
      borderRadius: { sm: "calc(var(--radius) - 2px)", md: "var(--radius)", lg: "calc(var(--radius) + 2px)", xl: "calc(var(--radius) + 6px)" },
      boxShadow: { "2xs": "var(--shadow-2xs)", xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", DEFAULT: "var(--shadow)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", "2xl": "var(--shadow-2xl)" },
      fontFamily: { sans: ["var(--font-sans-family)"], mono: ["var(--font-mono-family)"] },
      letterSpacing: { normal: "var(--tracking-normal)" },
    },
  },
}
