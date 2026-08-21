import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6">
      <div className="w-full max-w-sm rounded-[28px] bg-surface p-7 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">แยกหลักสี่</p>
        <h1 className="mt-1 text-xl font-semibold">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-sm text-muted">
          ใช้บัญชีเพื่อบันทึกงานวิเคราะห์ — ข้อมูลสำรวจเปิดอ่านได้โดยไม่ต้องลงชื่อ
        </p>
        <div className="mt-6 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                ดำเนินการต่อด้วย {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">ระบบลงชื่อเข้าใช้ถูกปิดไว้</p>
          )}
        </div>
        <Link to="/" className="mt-5 inline-block text-sm text-accent hover:underline">
          กลับไปหน้าสรุป
        </Link>
      </div>
    </main>
  );
}
