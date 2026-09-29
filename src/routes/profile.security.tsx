import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, KeyRound, MailCheck, Shield, Smartphone, Trash2, UserRoundCheck } from "lucide-react";
import { SecurityRow, SecuritySection, SecurityShell, CalmNotice } from "@/components/security-ui";

export const Route = createFileRoute("/profile/security")({ component: SecurityPage });

function SecurityPage() {
  return <SecurityShell title="Security & Privacy" description="Manage how your account is protected and how MealMate uses your information.">
    <SecuritySection title="Account security">
      <SecurityRow icon={MailCheck} label="Email address" description="Your verified sign-in email" to="/profile/security/verify-email" />
      <SecurityRow icon={KeyRound} label="Change password" description="Update your password securely" to="/profile/security/password" />
      <SecurityRow icon={Shield} label="Reset password" description="Request a secure reset link by email" to="/reset-password" />
      <SecurityRow icon={Smartphone} label="Active sessions" description="Review devices signed in to MealMate" to="/profile/security/sessions" />
      <SecurityRow icon={Shield} label="Sign out of all devices" description="End sessions everywhere except this device" to="/profile/security/sessions" />
    </SecuritySection>
    <SecuritySection title="Privacy">
      <SecurityRow icon={Eye} label="Privacy settings" description="Control visibility and sharing preferences" />
      <SecurityRow icon={UserRoundCheck} label="Data preferences" description="Choose how your MealMate data is used" />
      <SecurityRow icon={UserRoundCheck} label="Personalization preferences" description="Manage recommendations and tailored content" />
      <SecurityRow icon={MailCheck} label="Marketing preferences" description="Choose which updates you receive" />
    </SecuritySection>
    <SecuritySection title="Account">
      <SecurityRow icon={Download} label="Download my data" description="Request a copy of your MealMate information" />
      <SecurityRow icon={Trash2} label="Delete my account" description="Permanently remove your account and data" to="/profile/security/delete" />
    </SecuritySection>
    <CalmNotice>MealMate security controls will connect to your existing account services when the backend implementation is enabled. UI states never replace server-side authorization.</CalmNotice>
  </SecurityShell>;
}
