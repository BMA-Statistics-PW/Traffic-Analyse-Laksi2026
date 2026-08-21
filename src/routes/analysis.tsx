import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { ClientOnly } from "@/components/client-only";
import { ApproachBarChart, Eb5FifteenChart, QueueChart } from "@/components/charts";
import { APPROACH_LABEL, MOVEMENT_LABEL, survey } from "@/data/survey";
import { hourLabel, n } from "@/lib/utils";

export const Route = createFileRoute("/analysis")({ component: Analysis });

function Analysis() {
  const mix = survey.mixEb5;
  const mixTot = mix.c + mix.vn + mix.b + mix.mb + mix.tk + mix.tr;
  const used = ["NB1", "NB2", "NB3", "EB5", "EB6", "EB7", "EB8", "SB9", "SB10", "SB11", "WB13", "WB14"];

  return (
    <Shell>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        สำรวจ {survey.site.date} · {survey.site.dow} · อากาศ{survey.site.weather}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">ปริมาณจราจรและแถวคอย</h1>
      <p className="mt-2 max-w-2xl text-muted">
        จุดสำรวจ {survey.site.nameTh} พิกัด {survey.site.lat}, {survey.site.lng} นับทุก 15 นาที 07:00–19:00
        แปลง PCU ตามหัวไฟล์สำรวจ (รถยนต์/ตู้ = 1, เมล์ใหญ่ = 2.1, เมล์เล็ก = 1.5, บรรทุก = 2.5, สามล้อ = 0.93)
      </p>

      <section className="mt-8 rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">EB เลี้ยวซ้ายราย 15 นาที</h2>
        <p className="mb-4 text-sm text-muted">
          ค่าสูงสุด 94 คัน ช่วง 16:45–17:00 (อัตรา 376 คัน/ชม.) · พีครายชั่วโมงอยู่ช่วงเที่ยง ไม่ใช่เช้า
        </p>
        <ClientOnly>
          <Eb5FifteenChart />
        </ClientOnly>
      </section>

      <section className="mt-6 rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">ปริมาณรายขาเข้าแยก</h2>
        <p className="mb-4 text-sm text-muted">แจ้งวัฒนะ (EB+WB) เป็นเส้นหลัก · กำแพงเพชร 6 เป็นรอง</p>
        <ClientOnly>
          <ApproachBarChart />
        </ClientOnly>
      </section>

      <section className="mt-6 overflow-x-auto rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">ตารางชั่วโมง — ทิศทางเป้าหมาย EB5</h2>
        <table className="mt-4 w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <th className="py-2 pr-3 font-medium">ช่วงเวลา</th>
              <th className="py-2 pr-3 font-medium text-right">คัน</th>
              <th className="py-2 pr-3 font-medium text-right">PCU</th>
              <th className="py-2 pr-3 font-medium text-right">พีค 15 นาที</th>
              <th className="py-2 pr-3 font-medium text-right">PHF</th>
              <th className="py-2 pr-3 font-medium text-right">สัดส่วนขา EB</th>
              <th className="py-2 font-medium text-right">ทั้งแยก</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {survey.hourly.map((h) => {
              const share = (h.eb5.v / h.ap.EB) * 100;
              const hot = h.eb5.v >= 300;
              return (
                <tr key={h.h} className="border-b border-border/70">
                  <td className="py-2 pr-3">{hourLabel(h.h)}</td>
                  <td className="py-2 pr-3 text-right font-medium">{n(h.eb5.v)}</td>
                  <td className="py-2 pr-3 text-right">{n(h.eb5.p, 1)}</td>
                  <td className="py-2 pr-3 text-right">{h.eb5.p15}</td>
                  <td className="py-2 pr-3 text-right">{h.eb5.phf ?? "–"}</td>
                  <td className="py-2 pr-3 text-right">{share.toFixed(1)}%</td>
                  <td className="py-2 text-right">
                    {n(h.tot)}
                    {hot ? (
                      <Badge tone="target" className="ml-2">
                        สูง
                      </Badge>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            <tr className="font-medium">
              <td className="py-2 pr-3">รวม 12 ชม.</td>
              <td className="py-2 pr-3 text-right">{n(survey.eb5_12h)}</td>
              <td className="py-2 pr-3 text-right">{n(survey.eb5_12h_pcu, 1)}</td>
              <td className="py-2 pr-3 text-right">94</td>
              <td className="py-2 pr-3 text-right">–</td>
              <td className="py-2 pr-3 text-right">
                {((survey.eb5_12h / survey.hourly.reduce((s, h) => s + h.ap.EB, 0)) * 100).toFixed(1)}%
              </td>
              <td className="py-2 text-right">{n(survey.ix_12h)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-semibold">ส่วนประกอบยานพาหนะ EB5</h2>
          <p className="mt-1 text-sm text-muted">12 ชั่วโมง · หน่วย PCU ตามหัวสำรวจ</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["รถยนต์นั่ง", mix.c, survey.pcu.c],
              ["ตู้ / ปิคอัพ", mix.vn, survey.pcu.vn],
              ["รถเมล์ใหญ่", mix.b, survey.pcu.b],
              ["รถเมล์เล็ก", mix.mb, survey.pcu.mb],
              ["รถบรรทุก", mix.tk, survey.pcu.tk],
              ["สามล้อ", mix.tr, survey.pcu.tr],
            ].map(([label, count, pcu]) => (
              <li key={String(label)} className="flex items-center justify-between gap-3">
                <span>{label}</span>
                <span className="tabular-nums text-muted">
                  {n(Number(count))} คัน · PCU {pcu}
                  <span className="ml-2 text-fg">
                    {((Number(count) / mixTot) * 100).toFixed(1)}%
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-semibold">แถวคอยรายขา (เมตร)</h2>
          <p className="mt-1 text-sm text-muted">
            สำรวจเป็นคิวขาเข้าแยก ไม่แยกรายทิศเลี้ยว · บางชั่วโมงมีตัวอย่างน้อย
          </p>
          <ClientOnly>
            <QueueChart />
          </ClientOnly>
        </div>
      </section>

      <section className="mt-6 overflow-x-auto rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">คิวเฉลี่ย / สูงสุด รายขา</h2>
        <table className="mt-4 w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <th className="py-2 pr-3 font-medium">ช่วง</th>
              {(["EB", "NB", "SB", "WB"] as const).map((a) => (
                <th key={a} className="py-2 pr-3 font-medium text-right">
                  {a} เฉลี่ย / สูงสุด (n)
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {survey.queue.EB.map((q, i) => (
              <tr key={q.h} className="border-b border-border/70">
                <td className="py-2 pr-3">{hourLabel(q.h)}</td>
                {(["EB", "NB", "SB", "WB"] as const).map((a) => {
                  const row = survey.queue[a][i];
                  const thin = (row.n ?? 0) <= 2;
                  return (
                    <td key={a} className="py-2 pr-3 text-right">
                      {row.mean ?? "–"} / {row.max ?? "–"}
                      <span className={thin ? "ml-1 text-warn" : "ml-1 text-subtle"}>
                        ({row.n})
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted">
          ตัวเลขสีอำพันคือชั่วโมงที่ตัวอย่าง ≤ 2 จุด (เช่น EB 08–09 น. คิว 200 ม. จาก 1 จุด) — ใช้ประกอบ ไม่ใช่ค่าสถิติแน่น
        </p>
      </section>

      <section className="mt-6 overflow-x-auto rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">ปริมาณรายทิศทาง (คัน/ชม.)</h2>
        <p className="mt-1 text-sm text-muted">
          เลนที่นับได้ศูนย์ทั้งวัน (NB4, SB12, WB15–16 และทิศ U-turn) ตัดออก
        </p>
        <table className="mt-4 w-full min-w-[900px] text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted">
              <th className="py-2 pr-2 font-medium">เวลา</th>
              {used.map((k) => (
                <th
                  key={k}
                  className={`py-2 pr-2 font-medium text-right ${k === "EB5" ? "text-target" : ""}`}
                >
                  {MOVEMENT_LABEL[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {survey.hourly.map((h) => (
              <tr key={h.h} className="border-b border-border/70">
                <td className="py-1.5 pr-2 whitespace-nowrap">{hourLabel(h.h)}</td>
                {used.map((k) => (
                  <td
                    key={k}
                    className={`py-1.5 pr-2 text-right ${k === "EB5" ? "font-medium text-target" : ""}`}
                  >
                    {n(h.m[k]?.v ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted">
          {Object.entries(APPROACH_LABEL).map(([k, v]) => `${k} = ${v}`).join(" · ")}
        </p>
      </section>
    </Shell>
  );
}
