import { cn } from "@/lib/utils";

export function Kpi({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "bad" | "ok" | "target";
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] bg-surface p-4 shadow-card sm:p-5",
        tone === "bad" && "bg-bad-bg",
        tone === "ok" && "bg-ok-bg",
        tone === "target" && "bg-target-bg",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl font-medium tabular-nums tracking-tight sm:text-3xl">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
