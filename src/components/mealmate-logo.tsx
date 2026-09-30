import { cn } from "@/lib/utils";
import { MASCOT_ART_URL, mascotPosition, mascotSize, useTheme } from "@/components/theme-provider";
import type { MealMateTheme } from "@/lib/preferences";

export function MealMateLogo({
  className,
  imageClassName,
  showWordmark = true,
  theme,
}: {
  className?: string;
  imageClassName?: string;
  showWordmark?: boolean;
  theme?: MealMateTheme;
}) {
  const { mascotTheme } = useTheme();
  const activeTheme = theme ?? mascotTheme;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-label={`${activeTheme} MealMate mascot`}
        role="img"
        className={cn(
          "relative size-10 shrink-0 overflow-hidden rounded-full bg-black bg-cover bg-no-repeat ring-1 ring-border/70",
          imageClassName,
        )}
        style={{
          backgroundImage: `url(${MASCOT_ART_URL})`,
          backgroundPosition: mascotPosition(activeTheme),
          backgroundSize: mascotSize(activeTheme),
        }}
      />
      {showWordmark && <span className="font-display text-2xl leading-none">MealMate</span>}
    </span>
  );
}

export function MascotPreview({ theme, className }: { theme: MealMateTheme; className?: string }) {
  return (
    <span
      className={cn(
        "relative block aspect-square overflow-hidden rounded-2xl bg-black bg-cover bg-no-repeat",
        className,
      )}
      style={{
        backgroundImage: `url(${MASCOT_ART_URL})`,
        backgroundPosition: mascotPosition(theme),
        backgroundSize: mascotSize(theme),
      }}
      aria-label={`${theme} mascot preview`}
      role="img"
    />
  );
}
