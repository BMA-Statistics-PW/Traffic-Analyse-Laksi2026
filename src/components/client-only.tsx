import { useEffect, useState, type ReactNode } from "react";

export function ClientOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return (
      fallback ?? (
        <div className="h-64 animate-pulse rounded-[12px] bg-surface-2" aria-hidden />
      )
    );
  }
  return <>{children}</>;
}
