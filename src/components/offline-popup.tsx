import { RefreshCw, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflinePopup() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-4 bottom-[calc(var(--app-nav-h)+1rem)] z-50 mx-auto max-w-sm transition-all duration-300 ${
        offline ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-[#E8D8CE] bg-[#FFF8F1] px-4 py-3 text-[#351E35] shadow-[0_12px_32px_rgba(53,30,53,0.16)]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3A77A]/30 text-[#C65D3A]" aria-hidden="true">
          <WifiOff className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">You&apos;re offline</p>
          <p className="text-xs text-[#786B68]">Check your internet connection and try again.</p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[#C65D3A] px-3 text-xs font-semibold text-white transition hover:bg-[#A94D30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#351E35]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    </div>
  );
}
