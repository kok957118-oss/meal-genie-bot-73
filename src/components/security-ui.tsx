import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SecurityShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-6">
    <Link to="/profile" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Profile</Link>
    <div className="mb-6 rounded-3xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start gap-3"><div className="rounded-2xl bg-primary/10 p-3 text-primary"><ShieldCheck className="h-5 w-5" /></div><div><h1 className="font-display text-3xl leading-tight">{title}</h1>{description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>}</div></div></div>{children}
  </main>;
}

export function SecuritySection({ title, children }: { title: string; children: ReactNode }) { return <section className="mb-6"><h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{title}</h2><div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">{children}</div></section>; }

export function SecurityRow({ icon: Icon, label, description, to, onClick, trailing }: { icon: LucideIcon; label: string; description: string; to?: string; onClick?: () => void; trailing?: ReactNode }) {
  const content = <><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary"><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="font-medium">{label}</p><p className="mt-0.5 text-sm leading-5 text-muted-foreground">{description}</p></div>{trailing ?? <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />}</>;
  const className = "flex min-h-[76px] w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";
  return to ? <Link to={to} className={className}>{content}</Link> : <button type="button" onClick={onClick} className={className}>{content}</button>;
}

export function CalmNotice({ children }: { children: ReactNode }) { return <div role="status" className="rounded-2xl border border-[#E8D8CE] bg-[#FFF8F1] p-4 text-sm leading-6 text-[#351E35]">{children}</div>; }
