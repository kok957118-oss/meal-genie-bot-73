import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { APP_THEME_STORAGE_KEY, DEFAULT_APP_THEME, getAppTheme, type AppTheme, type AppThemeId } from "@/lib/theme-system";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = { mode: ThemeMode; resolved: ResolvedTheme; setMode: (m: ThemeMode) => void; appTheme: AppThemeId; setAppTheme: (id: AppThemeId) => void; theme: AppTheme };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "mealmate-theme";

function systemPref(): ResolvedTheme { return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
const DARK_APP_ICON = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000a36c81f8b4fffeafdc65d6a2-FOrsF6KRQeSU2lpiLAhmNK89JDZVeZ.png";
const LIGHT_APP_ICON = "/favicon.png";

function applyTheme(resolved: ResolvedTheme, appTheme: AppThemeId) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  root.dataset.appTheme = appTheme;
  const tokens = getAppTheme(appTheme).tokens;
  for (const [key, value] of Object.entries(tokens)) root.style.setProperty(`--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value);
  const icon = resolved === "dark" ? DARK_APP_ICON : LIGHT_APP_ICON;
  for (const rel of ["icon", "apple-touch-icon"]) document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)?.setAttribute("href", icon);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  const [appTheme, setAppThemeState] = useState<AppThemeId>(DEFAULT_APP_THEME);
  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const nextMode = storedMode === "light" || storedMode === "dark" || storedMode === "system" ? storedMode : "system";
    const storedApp = window.localStorage.getItem(APP_THEME_STORAGE_KEY) as AppThemeId | null;
    const nextApp = storedApp && getAppTheme(storedApp).id === storedApp ? storedApp : DEFAULT_APP_THEME;
    setModeState(nextMode); setAppThemeState(nextApp); const nextResolved = nextMode === "system" ? systemPref() : nextMode; setResolved(nextResolved); applyTheme(nextResolved, nextApp);
  }, []);
  useEffect(() => { if (mode !== "system") return; const mq = window.matchMedia("(prefers-color-scheme: dark)"); const onChange = () => { const next = systemPref(); setResolved(next); applyTheme(next, appTheme); }; mq.addEventListener("change", onChange); return () => mq.removeEventListener("change", onChange); }, [mode, appTheme]);
  const setMode = useCallback((next: ThemeMode) => { setModeState(next); window.localStorage.setItem(STORAGE_KEY, next); const nextResolved = next === "system" ? systemPref() : next; setResolved(nextResolved); applyTheme(nextResolved, appTheme); }, [appTheme]);
  const setAppTheme = useCallback((next: AppThemeId) => { setAppThemeState(next); window.localStorage.setItem(APP_THEME_STORAGE_KEY, next); applyTheme(resolved, next); }, [resolved]);
  const value = useMemo(() => ({ mode, resolved, setMode, appTheme, setAppTheme, theme: getAppTheme(appTheme) }), [mode, resolved, setMode, appTheme, setAppTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() { const ctx = useContext(ThemeContext); if (!ctx) throw new Error("useTheme must be used within ThemeProvider"); return ctx; }
