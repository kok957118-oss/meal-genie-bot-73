import { cn } from "@/lib/utils";

export function MealMateLogo({ className, imageClassName }: { className?: string; imageClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src="/mealmate-logo.png"
        alt="MealMate — Eat better, live better"
        width={240}
        height={240}
        decoding="async"
        fetchPriority="high"
        className={cn("h-auto object-contain", imageClassName ?? "w-40")}
      />
    </span>
  );
}
