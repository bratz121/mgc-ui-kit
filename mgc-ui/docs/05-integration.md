# 05. Подключение в проекты

Проекты платформы на разных стеках:

| Проект | Стек | Как подключать |
|---|---|---|
| AdminPanel | Next.js 15 · React 19 · Tailwind 4 | Полностью: токены + компоненты |
| pk-planning, rfid | Vite · React 19 | Полностью: токены + компоненты (+ Tailwind 4) |
| change-management | Vue 2 · Tailwind 3 | Токены + Tailwind-пресет |
| Андон, Maintenance, plant, plant-report-group | Vue 2 · Vuetify 2 | Только токены (CSS-переменные) |
| qrci | Vue 3 | Токены (+ Tailwind по желанию) |

## React (Vite / Next.js) — полное подключение

1. Установить зависимости:
   ```bash
   npm i tailwindcss @tailwindcss/vite tw-animate-css shadcn cn class-variance-authority \
     @base-ui/react lucide-react @fontsource-variable/ibm-plex-sans @fontsource/ibm-plex-mono
   ```
2. Скопировать из кита:
   - `src/styles/tokens.css`
   - `src/index.css` (блок `@theme inline` и `@layer base`) → в глобальный CSS проекта
   - `components.json` (поправить пути, если `src` нет)
   - нужные `src/components/ui/*`, `src/components/{mgc,platform,brand}`, `src/assets/platform`
3. Новые компоненты shadcn добавлять через CLI в проекте — стиль подтянется из `components.json`.
4. Next.js App Router: файлы с хуками/обработчиками — с `"use client"` (в ките они уже помечены, где нужно).

> Цель на следующий этап — вынести кит в npm-пакет / shadcn-реестр на Gitea, чтобы
> подключать `npx shadcn add @mgc/stat-card` вместо копирования. См. CHANGELOG → «Планы».

## Vue 2 + Vuetify — только токены

```js
// main.js
import "@/styles/mgc/tokens.css" // копия src/styles/tokens.css
import "@fontsource-variable/ibm-plex-sans"
import "@fontsource/ibm-plex-mono/400.css"
```

```scss
// пример: компонент
.pc-sidebar-link--active::before { background-color: var(--brand); }
.card { background: var(--card); border: 1px solid var(--border); border-radius: calc(var(--radius) * 1.4); }
```

Тёмная тема: класс `.dark` на `<html>`. Цвета темы Vuetify (`plugins/vuetify.js`) можно
задать литералами из таблицы в `02-tokens.md`.

## Vue 2/3 + Tailwind 3 (change-management) — пресет

```js
// tailwind.config.js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: { sans: "var(--font-sans-family)", mono: "var(--font-mono-family)" },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) * 0.8)", xl: "calc(var(--radius) * 1.4)" },
      colors: Object.fromEntries(
        ["background","foreground","card","card-foreground","popover","popover-foreground",
         "primary","primary-foreground","secondary","secondary-foreground","muted","muted-foreground",
         "accent","accent-foreground","brand","brand-foreground","brand-soft",
         "destructive","destructive-foreground","destructive-soft",
         "success","success-soft","warning","warning-soft","info","info-soft",
         "border","input","ring","chart-1","chart-2","chart-3","chart-4","chart-5"]
          .map((n) => [n, `var(--${n})`])
      ),
    },
  },
}
```

## Связь с pc_ui_kit (ДС ГК Туран)

В Vue-проектах сейчас вендорится `pc_ui_kit` (Bootstrap 5.3, Inter, бренд `#B22029`).
Отличия этого кита:

| | pc_ui_kit | UI-кит MGC |
|---|---|---|
| Основа | Bootstrap 5.3 | Tailwind 4 + shadcn/ui |
| Шрифт | Inter | IBM Plex Sans + Mono (брендбук MGC) |
| Красный | `#B22029` (Pantone 7621 C) | `#EC0000` (брендбук MGC, стр. 6) |
| Основная кнопка | красная (`--pc-brand`) | графитовая; красный — сигнальный |
| Тёмная тема | нет (добавлена локально) | есть |

Каркас (боковое меню, плитки модулей, шапка) сохранён таким же, как в текущих проектах.
Какой красный считать эталонным — решение владельца бренда; меняется одной переменной `--mgc-red`.
