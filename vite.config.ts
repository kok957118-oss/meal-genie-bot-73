// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    vite: {
      envPrefix: ["VITE_", "NEXT_PUBLIC_", "SUPABASE_"],
      define: {
        "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
          env.VITE_SUPABASE_URL ||
            env.NEXT_PUBLIC_SUPABASE_URL ||
            env.SUPABASE_URL ||
            process.env.VITE_SUPABASE_URL ||
            process.env.NEXT_PUBLIC_SUPABASE_URL ||
            process.env.SUPABASE_URL,
        ),
        "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
          env.VITE_SUPABASE_ANON_KEY ||
            env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
            env.SUPABASE_ANON_KEY ||
            process.env.VITE_SUPABASE_ANON_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
            process.env.SUPABASE_ANON_KEY,
        ),
        "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
          env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
            env.SUPABASE_PUBLISHABLE_KEY ||
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
            process.env.SUPABASE_PUBLISHABLE_KEY,
        ),
        "import.meta.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL),
        "import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY),
        "import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
          env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY,
        ),
        "import.meta.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
        "import.meta.env.SUPABASE_ANON_KEY": JSON.stringify(env.SUPABASE_ANON_KEY),
        "import.meta.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(env.SUPABASE_PUBLISHABLE_KEY),
        "import.meta.env.VITE_SUPABASE_REDIRECT_URL": JSON.stringify(
          env.VITE_SUPABASE_REDIRECT_URL || env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL,
        ),
        "import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL": JSON.stringify(env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL),
        "process.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL),
        "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        "process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
        "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
        "process.env.SUPABASE_ANON_KEY": JSON.stringify(env.SUPABASE_ANON_KEY),
        "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(env.SUPABASE_PUBLISHABLE_KEY),
      },
    },
  };
});
