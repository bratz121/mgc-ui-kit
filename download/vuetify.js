/* @mgc/ui 0.6.0 — темы Vuetify. Сгенерировано scripts/build-package.mjs. */

/**
 * Vuetify 3:
 *   import { mgcVuetifyThemes } from "@mgc/ui/vuetify"
 *   createVuetify({ theme: { defaultTheme: "mgcLight", themes: mgcVuetifyThemes } })
 * Vuetify 2:
 *   new Vuetify({ theme: { dark: false, themes: mgcVuetify2Themes } })
 * Акцент модуля: mgcModuleColors.andon.light.strong и т. д. — или подключите @mgc/ui/tokens.css
 * и используйте var(--module-strong) с атрибутом data-module на корне.
 */
export const mgcVuetifyThemes = {
  "mgcLight": {
    "dark": false,
    "colors": {
      "background": "#f5f5f5",
      "on-background": "#161616",
      "surface": "#ffffff",
      "on-surface": "#161616",
      "surface-variant": "#eeeeee",
      "on-surface-variant": "#5b5b5b",
      "primary": "#161616",
      "on-primary": "#ffffff",
      "secondary": "#eeeeee",
      "on-secondary": "#161616",
      "accent": "#ec0000",
      "brand": "#ec0000",
      "on-brand": "#ffffff",
      "error": "#d40000",
      "on-error": "#ffffff",
      "warning": "#915b18",
      "on-warning": "#ffffff",
      "info": "#43629c",
      "on-info": "#ffffff",
      "success": "#427138",
      "on-success": "#ffffff",
      "border": "#e8e8e8",
      "sidebar": "#161616",
      "on-sidebar": "#f5f5f5"
    }
  },
  "mgcDark": {
    "dark": true,
    "colors": {
      "background": "#0e0e0e",
      "on-background": "#f5f5f5",
      "surface": "#191919",
      "on-surface": "#f5f5f5",
      "surface-variant": "#292929",
      "on-surface-variant": "#ababab",
      "primary": "#f5f5f5",
      "on-primary": "#161616",
      "secondary": "#292929",
      "on-secondary": "#f5f5f5",
      "accent": "#ff3b3b",
      "brand": "#ff3b3b",
      "on-brand": "#161616",
      "error": "#fc5855",
      "on-error": "#161616",
      "warning": "#e3b667",
      "on-warning": "#161616",
      "info": "#88abea",
      "on-info": "#161616",
      "success": "#8bc27f",
      "on-success": "#161616",
      "border": "#ffffff17",
      "sidebar": "#070707",
      "on-sidebar": "#f5f5f5"
    }
  }
}

const strip = (c) => Object.fromEntries(Object.entries(c).filter(([k]) => !k.startsWith("on-")))
/** Vuetify 2 не знает on-* цветов и флага dark внутри темы. */
export const mgcVuetify2Themes = { light: strip(mgcVuetifyThemes.mgcLight.colors), dark: strip(mgcVuetifyThemes.mgcDark.colors) }

/** Скругление и шрифты кита — для defaults Vuetify и глобальных стилей. */
export const mgcShape = { radius: "0.375rem", fontSans: "\"IBM Plex Sans Variable\", \"IBM Plex Sans\", system-ui, sans-serif", fontMono: "\"IBM Plex Mono\", ui-monospace, \"SFMono-Regular\", monospace" }

export const mgcModuleColors = {
  "platform": {
    "light": {
      "mark": "#ec0000",
      "strong": "#db0000",
      "soft": "#feebe8",
      "solid": "#db0000",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#ec0000",
      "strong": "#ff7362",
      "soft": "#590000",
      "solid": "#ff7362",
      "solid-foreground": "#161616"
    }
  },
  "andon": {
    "light": {
      "mark": "#9ab98c",
      "strong": "#557744",
      "soft": "#e5f6de",
      "solid": "#557744",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#9ab98c",
      "strong": "#8cb17b",
      "soft": "#213119",
      "solid": "#8cb17b",
      "solid-foreground": "#161616"
    }
  },
  "maintenance": {
    "light": {
      "mark": "#5b77aa",
      "strong": "#4b6ca9",
      "soft": "#e9f1fe",
      "solid": "#4b6ca9",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#5b77aa",
      "strong": "#81a5e5",
      "soft": "#1c2b46",
      "solid": "#81a5e5",
      "solid-foreground": "#161616"
    }
  },
  "plantReport": {
    "light": {
      "mark": "#92915d",
      "strong": "#737130",
      "soft": "#f2f2d6",
      "solid": "#737130",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#92915d",
      "strong": "#aaa968",
      "soft": "#2e2d10",
      "solid": "#aaa968",
      "solid-foreground": "#161616"
    }
  },
  "qrci": {
    "light": {
      "mark": "#d9c791",
      "strong": "#806b2a",
      "soft": "#f9f0d5",
      "solid": "#806b2a",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#d9c791",
      "strong": "#b8a362",
      "soft": "#342a0d",
      "solid": "#b8a362",
      "solid-foreground": "#161616"
    }
  },
  "change": {
    "light": {
      "mark": "#c19478",
      "strong": "#946140",
      "soft": "#feece1",
      "solid": "#946140",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#c19478",
      "strong": "#cd9775",
      "soft": "#3c2516",
      "solid": "#cd9775",
      "solid-foreground": "#161616"
    }
  },
  "audits": {
    "light": {
      "mark": "#d5cabb",
      "strong": "#826945",
      "soft": "#f7efe3",
      "solid": "#826945",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#d5cabb",
      "strong": "#bba07b",
      "soft": "#322a1f",
      "solid": "#bba07b",
      "solid-foreground": "#161616"
    }
  },
  "planning": {
    "light": {
      "mark": "#d9c791",
      "strong": "#806b2a",
      "soft": "#f9f0d5",
      "solid": "#806b2a",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#d9c791",
      "strong": "#b8a362",
      "soft": "#342a0d",
      "solid": "#b8a362",
      "solid-foreground": "#161616"
    }
  },
  "projects": {
    "light": {
      "mark": "#d9c791",
      "strong": "#806b2a",
      "soft": "#f9f0d5",
      "solid": "#806b2a",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#d9c791",
      "strong": "#b8a362",
      "soft": "#342a0d",
      "solid": "#b8a362",
      "solid-foreground": "#161616"
    }
  },
  "claims": {
    "light": {
      "mark": "#c19478",
      "strong": "#946140",
      "soft": "#feece1",
      "solid": "#946140",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#c19478",
      "strong": "#cd9775",
      "soft": "#3c2516",
      "solid": "#cd9775",
      "solid-foreground": "#161616"
    }
  },
  "quotation": {
    "light": {
      "mark": "#c19478",
      "strong": "#946140",
      "soft": "#feece1",
      "solid": "#946140",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#c19478",
      "strong": "#cd9775",
      "soft": "#3c2516",
      "solid": "#cd9775",
      "solid-foreground": "#161616"
    }
  },
  "docs": {
    "light": {
      "mark": "#b3814c",
      "strong": "#9a6015",
      "soft": "#feeddc",
      "solid": "#9a6015",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#b3814c",
      "strong": "#d49653",
      "soft": "#3e2507",
      "solid": "#d49653",
      "solid-foreground": "#161616"
    }
  },
  "drawings": {
    "light": {
      "mark": "#7c6e6c",
      "strong": "#796967",
      "soft": "#faedeb",
      "solid": "#796967",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#7c6e6c",
      "strong": "#b1a09e",
      "soft": "#342826",
      "solid": "#b1a09e",
      "solid-foreground": "#161616"
    }
  },
  "infoboards": {
    "light": {
      "mark": "#aa9a9a",
      "strong": "#796969",
      "soft": "#fbecec",
      "solid": "#796969",
      "solid-foreground": "#ffffff"
    },
    "dark": {
      "mark": "#aa9a9a",
      "strong": "#b1a0a0",
      "soft": "#342828",
      "solid": "#b1a0a0",
      "solid-foreground": "#161616"
    }
  }
}
