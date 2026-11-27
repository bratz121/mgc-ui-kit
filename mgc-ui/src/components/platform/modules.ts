/*
 * Модули платформы «Производственный контур».
 * Плитки меню — из pc_ui_kit (vendor/icons), те же, что в текущих Vue-проектах.
 * Логотипы и акценты — promo/logos_pk.zip (белый логотип + цветной «слеш» модуля).
 * Акцентные токены модуля — src/styles/modules.css, атрибут data-module.
 */
import andon from "@/assets/platform/sidebar-0.svg"
import andonDark from "@/assets/platform/sidebar-dark-0.svg"
import maintenance from "@/assets/platform/sidebar-1.svg"
import maintenanceDark from "@/assets/platform/sidebar-dark-1.svg"
import docsTile from "@/assets/platform/sidebar-2.svg"
import docsTileDark from "@/assets/platform/sidebar-dark-2.svg"
import qrci from "@/assets/platform/sidebar-3.svg"
import qrciDark from "@/assets/platform/sidebar-dark-3.svg"
import plantReport from "@/assets/platform/sidebar-4.svg"
import plantReportDark from "@/assets/platform/sidebar-dark-4.svg"
import change from "@/assets/platform/sidebar-5.svg"
import changeDark from "@/assets/platform/sidebar-dark-5.svg"
import planningTile from "@/assets/platform/sidebar-6.svg"
import planningTileDark from "@/assets/platform/sidebar-dark-6.svg"
import uiKit from "@/assets/platform/sidebar-7.svg"
import uiKitDark from "@/assets/platform/sidebar-dark-7.svg"
import audits from "@/assets/platform/sidebar-tools.svg"
import auditsDark from "@/assets/platform/sidebar-dark-tools.svg"

import logoAndon from "@/assets/platform/logos/andon.png"
import logoAudits from "@/assets/platform/logos/audits.png"
import logoChange from "@/assets/platform/logos/change.png"
import logoClaims from "@/assets/platform/logos/claims.png"
import logoDocs from "@/assets/platform/logos/docs.png"
import logoDrawings from "@/assets/platform/logos/drawings.png"
import logoInfoboards from "@/assets/platform/logos/infoboards.png"
import logoMaintenance from "@/assets/platform/logos/maintenance.png"
import logoPlanning from "@/assets/platform/logos/planning.png"
import logoPlantReport from "@/assets/platform/logos/plantReport.png"
import logoPlatform from "@/assets/platform/logos/platform.png"
import logoProjects from "@/assets/platform/logos/projects.png"
import logoQrci from "@/assets/platform/logos/qrci.png"
import logoQuotation from "@/assets/platform/logos/quotation.png"

export type PlatformModuleKey =
  | "platform"
  | "andon"
  | "maintenance"
  | "plantReport"
  | "qrci"
  | "change"
  | "audits"
  | "planning"
  | "projects"
  | "claims"
  | "quotation"
  | "docs"
  | "drawings"
  | "infoboards"
  | "uiKit"

export type PlatformModule = {
  key: PlatformModuleKey
  name: string
  /** Точный цвет логотипа (--module-mark). */
  accent: string
  /** Белый логотип модуля — только на тёмном фоне. */
  logo?: string
  icon?: string
  iconDark?: string
  /** Смежные модули — куда чаще всего переходят из этого (навигация «в соседние приложения»). */
  related?: PlatformModuleKey[]
}

export const PLATFORM_MODULES: Record<PlatformModuleKey, PlatformModule> = {
  platform: { key: "platform", name: "Производственный контур", accent: "#ec0000", logo: logoPlatform },
  andon: { key: "andon", name: "Простои и дефекты", accent: "#9ab98c", logo: logoAndon, icon: andon, iconDark: andonDark, related: ["maintenance", "plantReport", "qrci"] },
  maintenance: { key: "maintenance", name: "Техобслуживание", accent: "#5b77aa", logo: logoMaintenance, icon: maintenance, iconDark: maintenanceDark, related: ["andon", "planning", "docs"] },
  plantReport: { key: "plantReport", name: "Производственный отчёт", accent: "#92915d", logo: logoPlantReport, icon: plantReport, iconDark: plantReportDark, related: ["andon", "planning", "qrci"] },
  qrci: { key: "qrci", name: "Постоянные улучшения", accent: "#d9c791", logo: logoQrci, icon: qrci, iconDark: qrciDark, related: ["andon", "claims", "projects"] },
  change: { key: "change", name: "Управление изменениями", accent: "#c19478", logo: logoChange, icon: change, iconDark: changeDark, related: ["drawings", "docs", "projects"] },
  audits: { key: "audits", name: "Аудиты", accent: "#d5cabb", logo: logoAudits, icon: audits, iconDark: auditsDark, related: ["qrci", "docs"] },
  planning: { key: "planning", name: "Оперативное планирование", accent: "#d9c791", logo: logoPlanning, icon: planningTile, iconDark: planningTileDark, related: ["plantReport", "maintenance"] },
  projects: { key: "projects", name: "Развитие проектов", accent: "#d9c791", logo: logoProjects, related: ["change", "quotation"] },
  claims: { key: "claims", name: "Рекламации", accent: "#c19478", logo: logoClaims, related: ["qrci", "andon", "quotation"] },
  quotation: { key: "quotation", name: "Запрос на квотацию", accent: "#c19478", logo: logoQuotation, related: ["projects", "drawings"] },
  docs: { key: "docs", name: "Управление документацией", accent: "#b3814c", logo: logoDocs, icon: docsTile, iconDark: docsTileDark, related: ["drawings", "change", "audits"] },
  drawings: { key: "drawings", name: "Управление чертежами", accent: "#7c6e6c", logo: logoDrawings, related: ["docs", "change"] },
  infoboards: { key: "infoboards", name: "Информационные доски", accent: "#aa9a9a", logo: logoInfoboards, related: ["plantReport", "andon"] },
  uiKit: { key: "uiKit", name: "UI-кит MGC", accent: "#ec0000", icon: uiKit, iconDark: uiKitDark },
}

/** Модули с логотипами — порядок для витрины акцентов. */
export const MODULES_WITH_ACCENT: PlatformModuleKey[] = [
  "platform", "andon", "maintenance", "plantReport", "qrci", "change", "audits",
  "planning", "projects", "claims", "quotation", "docs", "drawings", "infoboards",
]
