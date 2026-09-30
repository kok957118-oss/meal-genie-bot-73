import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "@/hooks/use-session";
import { getMyPreferences, saveMyPreferences } from "@/lib/preferences.functions";
import { readLocalPreferences, writeLocalPreferences, type MealMateTheme } from "@/lib/preferences";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "mealmate-theme-mode";
export const MASCOT_ART_URL = "/mealmate-mascot-themes.png";
export const LEGACY_MASCOT_ART_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_000000006b44820885d02f97d6a7c81b-ZTSvA8hP8k0v8QGsP1YTCwZyu16ABR.png";

export const MASCOT_THEMES: Array<{
  id: MealMateTheme;
  name: string;
  accent: string;
  position: string;
  size: string;
  description: string;
}> = [
  {
    id: "classic",
    name: "Classic",
    accent: "#f5f5f5",
    position: "0% 0%",
    size: "400% 200%",
    description: "The original MealMate mark",
  },
  {
    id: "sunset",
    name: "Sunset Kitchen",
    accent: "#f97316",
    position: "0% 0%",
    size: "300% 200%",
    description: "Warm, bright kitchen energy",
  },
  {
    id: "midnight",
    name: "Midnight",
    accent: "#8b5cf6",
    position: "50% 0%",
    size: "300% 200%",
    description: "A rich violet after-dark mood",
  },
  {
    id: "ocean",
    name: "Ocean",
    accent: "#06b6d4",
    position: "100% 0%",
    size: "300% 200%",
    description: "Fresh blue with citrus lift",
  },
  {
    id: "cherry",
    name: "Cherry",
    accent: "#f43f5e",
    position: "0% 100%",
    size: "200% 200%",
    description: "Playful berry red",
  },
  {
    id: "matcha",
    name: "Matcha",
    accent: "#84cc16",
    position: "100% 100%",
    size: "200% 200%",
    description: "Leafy, grounded green",
  },
  {
    id: "monochrome",
    name: "Monochrome Luxe",
    accent: "#d4d4d8",
    position: "100% 100%",
    size: "300% 200%",
    description: "Quiet black-and-white polish",
  },
];

const ThemeContext = createContext<{
  mode: ThemeMode;
  resolved: ResolvedTheme;
  mascotTheme: MealMateTheme;
  setMode: (mode: ThemeMode) => void;
  setMascotTheme: (theme: MealMateTheme) => void;
} | null>(null);

function systemPref(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: ResolvedTheme, mascotTheme: MealMateTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  root.dataset.mascot = mascotTheme;
  const accent = MASCOT_THEMES.find((theme) => theme.id === mascotTheme)?.accent ?? "#f5f5f5";
  root.style.setProperty("--mascot-accent", accent);
  const icon =
    resolved === "dark"
      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000a36c81f8b4fffeafdc65d6a2-FOrsF6KRQeSU2lpiLAhmNK89JDZVeZ.png"
      : "/favicon.png";
  for (const rel of ["icon", "apple-touch-icon"]) {
    const link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (link) link.href = icon;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  const [mascotTheme, setMascotThemeState] = useState<MealMateTheme>("classic");

  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initialMode =
      storedMode === "light" || storedMode === "dark" || storedMode === "system"
        ? storedMode
        : "system";
    const storedTheme = readLocalPreferences()?.theme ?? "classic";
    setModeState(initialMode);
    setMascotThemeState(storedTheme);
    const initialResolved = initialMode === "system" ? systemPref() : initialMode;
    setResolved(initialResolved);
    applyTheme(initialResolved, storedTheme);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void getMyPreferences()
      .then((prefs) => {
        if (!cancelled && prefs?.theme) {
          setMascotThemeState(prefs.theme);
          applyTheme(resolved, prefs.theme);
          writeLocalPreferences(prefs);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user, resolved]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = systemPref();
      setResolved(next);
      applyTheme(next, mascotTheme);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode, mascotTheme]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      const nextResolved = next === "system" ? systemPref() : next;
      setResolved(nextResolved);
      applyTheme(nextResolved, mascotTheme);
    },
    [mascotTheme],
  );

  const setMascotTheme = useCallback(
    (next: MealMateTheme) => {
      setMascotThemeState(next);
      const local = readLocalPreferences();
      const updated = {
        ...(local ?? {
          theme: "classic" as MealMateTheme,
          goal: null,
          favorite_foods: [],
          allergies: [],
          dietary_restrictions: [],
          disliked_foods: [],
          meals_per_day: null,
          cooking_level: null,
          cooking_time: null,
          food_budget: null,
          preferred_features: [],
          onboarding_completed: false,
          updated_at: null,
        }),
        theme: next,
      };
      writeLocalPreferences(updated);
      applyTheme(resolved, next);
      if (user) {
        const { updated_at: _updatedAt, ...data } = updated;
        void saveMyPreferences({ data }).catch(() => undefined);
      }
    },
    [resolved, user],
  );

  const value = useMemo(
    () => ({ mode, resolved, mascotTheme, setMode, setMascotTheme }),
    [mode, resolved, mascotTheme, setMode, setMascotTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export function mascotArtUrl(theme: MealMateTheme) {
  return theme === "classic" || theme === "monochrome" ? LEGACY_MASCOT_ART_URL : MASCOT_ART_URL;
}

export function mascotPosition(theme: MealMateTheme) {
  return MASCOT_THEMES.find((item) => item.id === theme)?.position ?? "0% 0%";
}

export function mascotSize(theme: MealMateTheme) {
  return MASCOT_THEMES.find((item) => item.id === theme)?.size ?? "400% 200%";
}
