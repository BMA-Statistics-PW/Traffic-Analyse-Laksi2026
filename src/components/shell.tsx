import { Link, useRouterState } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { DownloadReport } from "@/components/download-report";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "สรุปผลการวิเคราะห์" },
  { to: "/analysis", label: "ปริมาณจราจรและแถวคอย" },
  { to: "/geometry", label: "รูปแบบผายปาก" },
  { to: "/report", label: "ข้อเสนอแนะ" },
  { to: "/document", label: "รายงานวิเคราะห์" },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md no-print">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-primary text-primary-fg">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                <path
                  fill="currentColor"
                  d="M10 2h4v6h6v4h-6v6H10v-6H4V8h6V2zm-6 16 4 4H4v-4zm12 4 4-4v4h-4z"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold leading-tight">
                แยกหลักสี่
              </span>
              <span className="block truncate text-[11px] leading-tight text-muted">
                สัญญาณไฟจราจร 500 · ปาดผายมุมทางเลี้ยวซ้าย
              </span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-[10px] px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-fg"
                      : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-2">
            <DownloadReport label="Word" size="sm" className="shrink-0" />
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" />
            ) : user ? (
              <SignedIn>
                <UserButton />
              </SignedIn>
            ) : (
              <SignedOut>
                <Link
                  to="/login"
                  className="rounded-[10px] px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-fg"
                >
                  เข้าสู่ระบบ
                </Link>
              </SignedOut>
            )}
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-3 py-1.5 md:hidden">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm",
                  active ? "bg-primary text-primary-fg" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <footer className="border-t border-border no-print">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-xs text-muted">สำรวจ 20 พ.ค. 2569 · สัญญาณไฟ 500 · แยกหลักสี่พลาซ่า</p>
            <DownloadReport label="ดาวน์โหลดรายงาน Word" variant="link" size="sm" />
          </div>
          <aside className="mt-5 rounded-[12px] border border-border bg-surface-2 px-4 py-4 text-xs leading-relaxed text-fg">
            <p className="font-semibold tracking-wide">ลิขสิทธิ์ © Prapawadee_W.</p>
            <p className="mt-2">
              จัดทำและเป็นลิขสิทธิ์ของ
              <br />
              <span className="font-medium">นางสาวประภาวดี วชิรพุทธิ์</span>
              <br />
              นักวิชาการสถิติชำนาญการ · กลุ่มงานสถิติและวิจัย
              <br />
              กองนโยบายและแผนงาน · สำนักการจราจรและขนส่ง กรุงเทพมหานคร
            </p>
            <p className="mt-2 font-medium">ไม่อนุญาตให้นำไปใช้เพื่อผลประโยชน์ส่วนบุคคล</p>
          </aside>
        </div>
      </footer>
    </div>
  );
}
