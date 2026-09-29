import { Link } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExpiredSessionState() {
  return <div role="alert" className="mx-auto flex min-h-[60vh] w-full max-w-md items-center justify-center px-4"><div className="w-full rounded-3xl border border-border bg-card p-6 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Clock3 className="h-6 w-6" /></div><h1 className="mt-5 font-display text-2xl">Your session has expired.</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Please sign in again to continue.</p><Button asChild className="mt-6 h-12 w-full rounded-xl"><Link to="/auth">Sign in</Link></Button></div></div>;
}
