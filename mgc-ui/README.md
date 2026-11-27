# UI-кит MGC GROUP

Дизайн-система для внутренних систем платформы «Производственный контур»:
Андон, Техобслуживание, Производственный отчёт, QRCI, Управление изменениями, Аудиты.

- **Стек:** React 19 · Vite · Tailwind CSS v4 · shadcn/ui (стиль `base-nova`, примитивы Base UI) · lucide-react · Recharts · TanStack Table · dnd-kit
- **Шрифты:** IBM Plex Sans + IBM Plex Mono
- **Темы:** светлая (по умолчанию) и тёмная
- **Бренд:** токены по брендбуку MGC GROUP (`../MGC_GROUP_identity_result_compressed (1).pdf`)

## Запуск витрины

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # проверка типов + сборка
npm run lint
```

Витрина — это одновременно и живая документация: каждый компонент показан в работе,
у каждого примера есть кнопка «Код» и правила «Делайте / Не делайте».

## Документация

| Документ | О чём |
|---|---|
| [docs/01-principles.md](docs/01-principles.md) | Принципы: для кого и как мы проектируем |
| [docs/02-tokens.md](docs/02-tokens.md) | Спецификация токенов: цвета, типографика, радиусы, отступы |
| [docs/03-components.md](docs/03-components.md) | Спецификация компонентов: назначение, варианты, состояния, правила |
| [docs/04-patterns.md](docs/04-patterns.md) | Паттерны: каркас приложения, дашборд, реестр, формы, статусы |
| [docs/05-integration.md](docs/05-integration.md) | Как подключить кит в React/Next.js и Vue 2/3-проекты |
| [docs/06-contributing.md](docs/06-contributing.md) | Как добавлять компоненты и менять токены |
| [CHANGELOG.md](CHANGELOG.md) | История изменений |

## Структура

```
src/
  styles/tokens.css          ← ИСТОЧНИК ПРАВДЫ: все токены (не зависит от фреймворка)
  index.css                  ← Tailwind v4 + связка токенов с утилитами (@theme inline)
  components/
    ui/                      ← компоненты shadcn/ui (добавляются через CLI)
    brand/logo.tsx           ← логотип MGC GROUP (5 вариантов, currentColor)
    platform/                ← каркас приложения: PlatformSidebar, PlatformHeader, модули
    mgc/                     ← продуктовые: DataTable, StatCard, StatusBadge, TagInput, DatePicker,
                               ChartCard, WidgetBoard / KanbanBoard / SortableList
    mobile/                  ← мобильные: MobileHeader, BottomNav, ActionBar, Fab, Numpad…
  assets/platform/           ← плитки модулей и знак «ПК» (из pc_ui_kit)
  showcase/                  ← витрина-документация (не входит в кит)
public/brand/                ← логотипы SVG
docs/                        ← спецификации
```

## Добавить компонент shadcn

В сети за прокси Node нужно явно разрешить использовать прокси из окружения:

```bash
NODE_USE_ENV_PROXY=1 npx shadcn@latest add accordion
```

После добавления — проверьте подписи на русском и добавьте раздел в
`docs/03-components.md` и пример на витрину. Подробнее — `docs/06-contributing.md`.
