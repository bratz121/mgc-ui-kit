# UI-кит MGC GROUP — правила для агентов

Стек: Vite · React 19 · TS · Tailwind v4 · shadcn/ui `base-nova` (**Base UI**, не Radix) · lucide.
Спецификации — `docs/`. Перед изменениями прочитайте `docs/02-tokens.md` и `docs/03-components.md`.

- Токены — только в `src/styles/tokens.css` (`:root` и `.dark`) + связка в `src/index.css`. Никаких hex в компонентах.
- Основная кнопка — графитовая (`variant="default"`). Красный (`brand`, `destructive`) — только бренд и критичное.
- Триггеры: `render={<Button />}`, не `asChild`. Select требует `items`. ToggleGroup: `defaultValue` — массив.
- Формы — `FieldGroup` + `Field`; ошибки — `data-invalid` + `aria-invalid` + `FieldError`.
- Все тексты, включая `sr-only`, — на русском. Числа `toLocaleString("ru-RU")`, даты `ДД.ММ.ГГГГ`.
- Боковое меню — `PlatformSidebar` (структура как в текущих `SideBar.vue`), не менять общий вид.
- Новые компоненты shadcn: `NODE_USE_ENV_PROXY=1 npx shadcn@latest add <name>`.
- Каждое изменение компонента/токена → раздел в `docs/` + пример на витрине + `CHANGELOG.md`.
- Проверка: `npm run build && npm run lint`.
