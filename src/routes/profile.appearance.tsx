import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { APP_THEMES, type AppThemeId } from "@/lib/theme-system";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/profile/appearance")({ component: AppearancePage });

function ThemePreview({ colors }: { colors: string[] }) {
  return <div className="overflow-hidden rounded-xl border border-black/10 bg-white p-2 shadow-sm"><div className="flex gap-1">{colors.map((color) => <span key={color} className="h-3 flex-1 rounded-full" style={{ backgroundColor: color }} />)}</div><div className="mt-2 flex items-center gap-2"><span className="h-6 w-6 rounded-full" style={{ backgroundColor: colors[0] }} /><span className="h-2 w-14 rounded-full" style={{ backgroundColor: colors[2] }} /><span className="ml-auto h-5 w-9 rounded-md" style={{ backgroundColor: colors[1] }} /></div></div>;
}

function AppearancePage() {
  const { appTheme, setAppTheme } = useTheme();
  const [lockedTheme, setLockedTheme] = useState<AppThemeId | null>(null);
  const selected = APP_THEMES.find((theme) => theme.id === lockedTheme);
  return <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6">
    <Link to="/profile" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Profile</Link>
    <header className="mb-7"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Make it yours</p><h1 className="mt-1 font-display text-4xl tracking-tight">Appearance</h1><p className="mt-2 max-w-xl text-muted-foreground">Choose a visual mood for your recipes, planner and kitchen rituals.</p></header>
    <section aria-labelledby="themes-heading"><div className="mb-4 flex items-end justify-between"><div><h2 id="themes-heading" className="text-xl font-semibold">Themes</h2><p className="mt-1 text-sm text-muted-foreground">Sunset Kitchen is included with every MealMate account.</p></div><span className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-semibold text-secondary-foreground">{APP_THEMES.length} styles</span></div><div className="grid gap-4 sm:grid-cols-2">{APP_THEMES.map((theme) => { const active = appTheme === theme.id; return <button key={theme.id} type="button" onClick={() => theme.premium ? setLockedTheme(theme.id) : setAppTheme(theme.id)} aria-pressed={active} className={`group rounded-3xl border bg-card p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-primary ring-2 ring-primary/15" : "border-border"}`}><ThemePreview colors={theme.colors} /><div className="mt-4 flex items-start gap-3"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="font-semibold">{theme.name}</h3>{theme.premium ? <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"><Lock className="h-3 w-3" /> Premium</span> : <span className="rounded-full bg-[#7D9B76]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#55704F]">Free</span>}</div><p className="mt-1 text-sm text-muted-foreground">{theme.description}</p></div>{active && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></span>}</div></button>; })}</div></section>
    <Dialog open={!!lockedTheme} onOpenChange={(open) => !open && setLockedTheme(null)}><DialogContent className="rounded-3xl sm:max-w-md"><DialogHeader><div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/40 text-primary"><Sparkles className="h-5 w-5" /></div><DialogTitle className="font-display text-3xl">Unlock more ways to make MealMate yours.</DialogTitle><DialogDescription className="text-base">Get Premium to unlock exclusive themes, logos, icons and personalization.</DialogDescription></DialogHeader><div className="rounded-2xl p-3" style={{ background: `linear-gradient(135deg, ${selected?.colors[0]}, ${selected?.colors[1]})` }}><ThemePreview colors={selected?.colors ?? []} /></div><DialogFooter className="gap-2 sm:justify-start"><Button type="button" onClick={() => setLockedTheme(null)} className="rounded-xl">Unlock Premium</Button><Button type="button" variant="ghost" onClick={() => setLockedTheme(null)} className="rounded-xl">Maybe later</Button></DialogFooter></DialogContent></Dialog>
  </main>;
}
