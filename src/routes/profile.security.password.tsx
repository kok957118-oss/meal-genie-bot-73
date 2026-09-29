import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, EyeOff, KeyRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SecurityShell, CalmNotice } from "@/components/security-ui";

export const Route = createFileRoute("/profile/security/password")({ component: PasswordPage });

function PasswordPage() {
  const [show, setShow] = useState(false); const [status, setStatus] = useState<"idle" | "success" | "error">("idle"); const [password, setPassword] = useState("");
  const requirements = useMemo(() => [{ label: "At least 8 characters", ok: password.length >= 8 }, { label: "One uppercase letter", ok: /[A-Z]/.test(password) }, { label: "One number", ok: /\d/.test(password) }], [password]);
  const strength = requirements.filter((item) => item.ok).length;
  return <SecurityShell title="Change password" description="Use a strong password you do not reuse elsewhere.">
    <form className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm" onSubmit={(event) => { event.preventDefault(); setStatus("success"); }}>
      {status === "success" && <CalmNotice>Your password change is ready to connect to the secure account action. No password was stored or displayed.</CalmNotice>}
      {status === "error" && <div role="alert" className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">Something went wrong. Please try again.</div>}
      {["Current password", "New password", "Confirm new password"].map((label) => <label key={label} className="block text-sm font-medium">{label}<div className="relative mt-2"><Input type={show ? "text" : "password"} autoComplete={label === "Current password" ? "current-password" : "new-password"} value={label === "New password" ? password : undefined} onChange={label === "New password" ? (event) => setPassword(event.target.value) : undefined} className="h-12 rounded-xl pr-12" aria-label={label} />{<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setShow((value) => !value)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}</div></label>)}
      <div><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Password strength</span><span>{strength === 3 ? "Strong" : strength === 2 ? "Good" : "Keep going"}</span></div><div className="flex gap-1" aria-label={`Password strength ${strength} of 3`}>{[0,1,2].map((bar) => <span key={bar} className={`h-1.5 flex-1 rounded-full ${bar < strength ? "bg-[#7D9B76]" : "bg-muted"}`} />)}</div></div>
      <ul className="space-y-2 text-sm text-muted-foreground" aria-label="Password requirements">{requirements.map((item) => <li key={item.label} className="flex items-center gap-2">{item.ok ? <Check className="h-4 w-4 text-[#7D9B76]" /> : <X className="h-4 w-4" />} {item.label}</li>)}</ul>
      <Button type="submit" className="h-12 w-full rounded-xl" disabled={strength < 3}>Update password</Button>
    </form>
  </SecurityShell>;
}
