import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Compass,
  House,
  MapPin,
  UserRound,
  Utensils,
} from "lucide-react";
import { MascotPreview, MealMateLogo } from "@/components/mealmate-logo";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/hooks/use-preferences";
import { useSession } from "@/hooks/use-session";
import { EMPTY_PREFERENCES, markOnboardingSeen, type FoodPreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to MealMate" },
      { name: "description", content: "Set up your MealMate experience." },
    ],
  }),
  component: OnboardingPage,
});

type Phase = "welcome" | "tour" | "auth" | "taste" | "needs" | "details" | "building" | "complete";
type TourStep = { label: string; title: string; body: string; icon: typeof House };

const TOUR: TourStep[] = [
  {
    label: "Home",
    title: "Your MealMate home.",
    body: "Discover meals, restaurants, recommendations, and everything you need to make your next meal easier.",
    icon: House,
  },
  {
    label: "Dining",
    title: "Find somewhere to eat.",
    body: "Discover restaurants, explore menus, and find your next meal.",
    icon: MapPin,
  },
  {
    label: "Planner",
    title: "Plan your meals.",
    body: "Organize your meals for the week and make planning what to eat simple.",
    icon: Compass,
  },
  {
    label: "Recipes",
    title: "Turn ingredients into meals.",
    body: "Explore recipes, understand ingredients, and discover new things to cook.",
    icon: Utensils,
  },
  {
    label: "Profile",
    title: "Make MealMate yours.",
    body: "Manage your preferences, account, saved content, subscription, themes, and personal MealMate experience.",
    icon: UserRound,
  },
];

const TASTE = [
  "Home cooking",
  "Fast food",
  "Healthy",
  "High protein",
  "Vegetarian",
  "Vegan",
  "Comfort food",
  "African cuisine",
  "Italian",
  "Asian",
  "Desserts",
];
const NEEDS = [
  "Discover restaurants",
  "Cook at home",
  "Plan meals",
  "Eat healthier",
  "Save money",
  "Try new foods",
  "Order food",
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { preferences, save } = usePreferences();
  const [phase, setPhase] = useState<Phase>(user ? "taste" : "welcome");
  const [tourIndex, setTourIndex] = useState(0);
  const [draft, setDraft] = useState<FoodPreferences>(() => ({
    ...EMPTY_PREFERENCES,
    ...preferences,
  }));
  const [choice, setChoice] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const firstName = user?.user_metadata?.display_name?.split(" ")[0] ?? "there";

  useEffect(() => {
    if (user && phase === "welcome") setPhase("taste");
  }, [user, phase]);

  const tour = TOUR[tourIndex]!;
  const progress = phase === "tour" ? ((tourIndex + 1) / TOUR.length) * 100 : 0;

  function finishPersonalization() {
    setPhase("building");
    const next = {
      ...draft,
      favorite_foods: choice,
      preferred_features: needs,
      onboarding_completed: true,
    };
    void save(next).then(() => {
      markOnboardingSeen();
      window.setTimeout(() => setPhase("complete"), 650);
    });
  }

  if (phase === "welcome")
    return (
      <Welcome
        onExplore={() => setPhase("tour")}
        onSkip={() => {
          markOnboardingSeen();
          navigate({ to: "/auth" });
        }}
      />
    );
  if (phase === "tour")
    return (
      <Tour
        index={tourIndex}
        tour={tour}
        progress={progress}
        onBack={() => (tourIndex ? setTourIndex(tourIndex - 1) : setPhase("welcome"))}
        onNext={() =>
          tourIndex === TOUR.length - 1 ? setPhase("auth") : setTourIndex(tourIndex + 1)
        }
        onSkip={() => setPhase("auth")}
      />
    );
  if (phase === "auth")
    return (
      <AuthBridge
        onCreate={() => navigate({ to: "/auth", search: { mode: "signup" } as never })}
        onSignIn={() => navigate({ to: "/auth" })}
      />
    );
  if (phase === "taste")
    return (
      <ChoiceScreen
        eyebrow="01 / 03"
        title="What's your food style?"
        body="Choose a few things that already feel like you."
        options={TASTE}
        selected={choice}
        onChange={setChoice}
        onBack={() => setPhase("auth")}
        onNext={() => setPhase("needs")}
      />
    );
  if (phase === "needs")
    return (
      <ChoiceScreen
        eyebrow="02 / 03"
        title="What's most important to you?"
        body="MealMate will keep these priorities close as you explore."
        options={NEEDS}
        selected={needs}
        onChange={setNeeds}
        onBack={() => setPhase("taste")}
        onNext={() => setPhase("details")}
      />
    );
  if (phase === "details")
    return (
      <DetailsScreen
        draft={draft}
        setDraft={setDraft}
        onBack={() => setPhase("needs")}
        onNext={finishPersonalization}
      />
    );
  if (phase === "building") return <Building />;
  return <Complete firstName={firstName} onStart={() => navigate({ to: "/", replace: true })} />;
}

function Welcome({ onExplore, onSkip }: { onExplore: () => void; onSkip: () => void }) {
  return (
    <main className="fixed inset-0 z-[70] flex min-h-dvh flex-col bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="flex items-center justify-between">
          <MealMateLogo imageClassName="size-12" />
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={onSkip}>
            Skip
          </button>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="welcome-logo mb-10 rounded-[2rem] border border-border bg-card p-5 shadow-[0_24px_80px_-32px_rgba(0,0,0,.4)]">
            <MascotPreview theme="classic" className="size-36 rounded-[1.5rem]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Your everyday food companion
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[.95] tracking-tight">
            Welcome to
            <br />
            MealMate.
          </h1>
          <p className="mt-6 max-w-xs text-base leading-7 text-muted-foreground">
            Discover restaurants, order your food, plan your meals, and make every bite count.
          </p>
        </div>
        <Button className="h-14 w-full rounded-2xl text-base" onClick={onExplore}>
          Explore MealMate <ArrowRight data-icon="inline-end" />
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          A better way to decide what&apos;s for dinner.
        </p>
      </div>
    </main>
  );
}

function Tour({
  index,
  tour,
  progress,
  onBack,
  onNext,
  onSkip,
}: {
  index: number;
  tour: TourStep;
  progress: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const Icon = tour.icon;
  return (
    <main className="fixed inset-0 z-[70] flex min-h-dvh flex-col bg-background px-6 py-6 text-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <header className="flex items-center justify-between">
          <button
            className="flex size-11 items-center justify-center rounded-full border border-border"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex gap-1.5" aria-label={`Step ${index + 1} of ${TOUR.length}`}>
            {TOUR.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-colors",
                  i <= index ? "bg-foreground" : "bg-muted",
                )}
              />
            ))}
          </div>
          <button className="text-sm text-muted-foreground" onClick={onSkip}>
            Skip tour
          </button>
        </header>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-foreground transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grid flex-1 items-center gap-8 py-10 md:grid-cols-[1.1fr_.9fr] md:gap-14">
          <div className="relative flex min-h-[300px] items-center justify-center rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <div className="absolute inset-6 rounded-[1.5rem] border border-dashed border-border" />
            <div className="relative flex size-32 items-center justify-center rounded-[2rem] bg-foreground text-background shadow-xl">
              <Icon className="size-14" />
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between rounded-2xl border border-border bg-background/90 px-4 py-3 backdrop-blur">
              <span className="text-sm font-medium">{tour.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")} / {TOUR.length}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight">{tour.title}</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{tour.body}</p>
            <Button className="mt-8 h-13 rounded-2xl px-8" onClick={onNext}>
              {index === TOUR.length - 1 ? "Continue" : "Next"}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function AuthBridge({ onCreate, onSignIn }: { onCreate: () => void; onSignIn: () => void }) {
  return (
    <main className="fixed inset-0 z-[70] flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        <MealMateLogo imageClassName="mx-auto size-16" className="flex-col gap-3" />
        <h1 className="mt-10 font-display text-4xl">Ready to make every bite count?</h1>
        <p className="mx-auto mt-4 max-w-sm leading-7 text-muted-foreground">
          Create your MealMate account and personalize your experience.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button className="h-13 rounded-2xl" onClick={onCreate}>
            Create account
          </Button>
          <Button variant="outline" className="h-13 rounded-2xl" onClick={onSignIn}>
            Sign in
          </Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Your saved recipes and preferences stay with you.
        </p>
      </div>
    </main>
  );
}

function ChoiceScreen({
  eyebrow,
  title,
  body,
  options,
  selected,
  onChange,
  onBack,
  onNext,
}: {
  eyebrow: string;
  title: string;
  body: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <main className="fixed inset-0 z-[70] flex min-h-dvh flex-col bg-background px-6 py-6">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <header className="flex items-center justify-between">
          <button
            className="flex size-11 items-center justify-center rounded-full border border-border"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            MealMate setup
          </span>
          <span className="size-11" />
        </header>
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight">{title}</h1>
          <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                onClick={() =>
                  onChange(
                    active ? selected.filter((item) => item !== option) : [...selected, option],
                  )
                }
                className={cn(
                  "min-h-16 rounded-2xl border px-4 text-left text-sm font-medium transition-all active:scale-[.98]",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card hover:border-foreground/40",
                )}
                aria-pressed={active}
              >
                <span className="flex items-center justify-between gap-2">
                  {option}
                  {active && <Check className="size-4" />}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto pt-8">
          <Button className="h-13 w-full rounded-2xl" disabled={!selected.length} onClick={onNext}>
            Continue <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </main>
  );
}

function DetailsScreen({
  draft,
  setDraft,
  onBack,
  onNext,
}: {
  draft: FoodPreferences;
  setDraft: (next: FoodPreferences) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <main className="fixed inset-0 z-[70] flex min-h-dvh flex-col bg-background px-6 py-6">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <header className="flex items-center justify-between">
          <button
            className="flex size-11 items-center justify-center rounded-full border border-border"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            03 / 03
          </span>
          <span className="size-11" />
        </header>
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Preferences
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight">Tell us a little more.</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            These help us make recommendations feel more useful from the start.
          </p>
        </div>
        <div className="mt-8 grid gap-3">
          <button
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-left"
            onClick={() =>
              setDraft({
                ...draft,
                cooking_time: draft.cooking_time === "Under 15 minutes" ? null : "Under 15 minutes",
              })
            }
          >
            <span>
              <span className="block text-sm font-medium">Keep it practical</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Prioritize recipes under 15 minutes
              </span>
            </span>
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border",
                draft.cooking_time
                  ? "border-foreground bg-foreground text-background"
                  : "border-border",
              )}
            >
              {draft.cooking_time && <Check className="size-3" />}
            </span>
          </button>
          <button
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-left"
            onClick={() =>
              setDraft({
                ...draft,
                food_budget: draft.food_budget === "Budget friendly" ? null : "Budget friendly",
              })
            }
          >
            <span>
              <span className="block text-sm font-medium">Keep it considered</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Surface budget-friendly choices
              </span>
            </span>
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border",
                draft.food_budget
                  ? "border-foreground bg-foreground text-background"
                  : "border-border",
              )}
            >
              {draft.food_budget && <Check className="size-3" />}
            </span>
          </button>
        </div>
        <div className="mt-auto pt-8">
          <Button className="h-13 w-full rounded-2xl" onClick={onNext}>
            Build my MealMate <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </main>
  );
}

function Building() {
  return (
    <main className="fixed inset-0 z-[70] flex min-h-dvh items-center justify-center bg-background px-6 text-center">
      <div>
        <MealMateLogo imageClassName="mx-auto size-20" className="flex-col gap-3" />
        <div className="mx-auto mt-10 size-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        <h1 className="mt-8 font-display text-4xl">Building your MealMate.</h1>
        <p className="mt-3 text-muted-foreground">
          Saving your preferences and getting your kitchen ready.
        </p>
      </div>
    </main>
  );
}

function Complete({ firstName, onStart }: { firstName: string; onStart: () => void }) {
  return (
    <main className="fixed inset-0 z-[70] flex min-h-dvh items-center justify-center bg-background px-6 text-center">
      <div className="w-full max-w-md">
        <div className="mx-auto flex size-20 items-center justify-center rounded-[1.75rem] bg-foreground text-background">
          <Check className="size-9" />
        </div>
        <h1 className="mt-8 font-display text-5xl">You&apos;re all set.</h1>
        <p className="mt-4 text-lg text-muted-foreground">Welcome to MealMate, {firstName}.</p>
        <Button className="mt-10 h-13 w-full rounded-2xl" onClick={onStart}>
          Start exploring <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </main>
  );
}
