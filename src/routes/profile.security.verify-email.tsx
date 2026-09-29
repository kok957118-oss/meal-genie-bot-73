import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MailCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SecurityShell, CalmNotice } from "@/components/security-ui";

export const Route = createFileRoute("/profile/security/verify-email")({ component: VerifyEmailPage });
function VerifyEmailPage() { const [sent, setSent] = useState(false); return <SecurityShell title="Verify your email" description="A verified email helps keep your MealMate account secure."><div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><MailCheck className="h-8 w-8" /></div><h2 className="mt-5 font-display text-2xl">Check your inbox</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">We sent a verification link to your email address. The real email action will connect here later.</p>{sent && <CalmNotice><CheckCircle2 className="mr-2 inline h-4 w-4" />Verification email requested.</CalmNotice>}<div className="mt-6 grid gap-3"><Button onClick={() => setSent(true)} disabled={sent} className="h-12 rounded-xl">{sent ? "Email sent" : "Resend email"}</Button><Button variant="outline" className="h-12 rounded-xl">Change email</Button><Button variant="ghost" className="h-12 rounded-xl">Back to MealMate</Button></div></div></SecurityShell>; }
