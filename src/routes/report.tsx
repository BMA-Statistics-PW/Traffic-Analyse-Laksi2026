import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { survey } from "@/data/survey";
import {
  losFromVc,
  losSignal,
  losUnsig,
  signalDelay,
  twscDelay,
  vcRatio,
  yieldCapacity,
  SAT_LEFT,
} from "@/lib/traffic";
import { n } from "@/lib/utils";

export const Route = createFileRoute("/report")({ component: Report });

function Report() {
  const demand = 342;
  const peak15rate = 376;
  const [cycle, setCycle] = useState(150);
  const [gOverC, setG] = useState(0.18);
  const [conflict, setConflict] = useState(500);
  const [tc, setTc] = useState(6.5);

  const sigCap = SAT_LEFT * gOverC;
  const sigX = vcRatio(demand, sigCap);
  const sigD = signalDelay({ cycle, gOverC, volume: demand });
  const freeCap = yieldCapacity(conflict, tc, 3.3);
  const freeX = vcRatio(demand, freeCap);
  const freeD = twscDelay(demand, freeCap, 0.25);
  const savePerVeh = Math.max(0, sigD - freeD);
  const savePeakHour = (savePerVeh * demand) / 3600;

  const rows = useMemo(
    () => [
      { g: 0.12, c: 120 },
      { g: 0.12, c: 150 },
      { g: 0.18, c: 150 },
      { g: 0.18, c: 180 },
      { g: 0.25, c: 150 },
    ],
    [],
  );

  return (
    <Shell>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        ข้อเสนอแนะทางวิศวกรรมจราจร · แยกหลักสี่ (แยกไอทีสแควร์)
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">ข้อเสนอแนะทางวิศวกรรมจราจร</h1>
      <p className="mt-2 max-w-2xl text-muted">
        สรุปผลการวิเคราะห์สามประเด็นหลัก ได้แก่ ปริมาณจราจรช่วงเร่งด่วน
        ปริมาณจราจรที่ใช้ทิศทางนี้ทั้งวัน และการผายปากแล้วจะช่วยแก้ไขปัญหาจราจรติดขัดได้มากน้อยเพียงใด
      </p>

      <section className="mt-8 rounded-[18px] bg-primary p-5 text-primary-fg sm:p-7">
        <p className="text-xs font-medium uppercase tracking-wider opacity-70">สรุปผลการวิเคราะห์</p>
        <ol className="mt-3 space-y-3 text-sm leading-relaxed sm:text-base">
          <li>
            <strong>ปริมาณจราจรช่วงเร่งด่วน</strong> — เช้า 07:00–09:00 น. รวม {n(249 + 223)} คัน (เฉลี่ย {n((249 + 223) / 2)} คัน/ชม.)
            เย็น 16:00–18:00 น. รวม {n(324 + 304)} คัน (เฉลี่ย {n((324 + 304) / 2)} คัน/ชม.) ช่วงพีคของทิศทางนี้คือ 12:00–13:00 น. ที่ {n(342)} คัน/ชม.
          </li>
          <li>
            <strong>ปริมาณจราจรที่ใช้ทิศทางนี้ทั้งวัน</strong> — {n(survey.eb5_12h)} คัน ใน 12 ชั่วโมง ({n(survey.eb5_12h_pcu, 0)} PCU) คิดเป็น{" "}
            {((survey.eb5_12h / survey.ix_12h) * 100).toFixed(1)}% ของรถทั้งแยก และประมาณ 19% ของขาเข้าถนนแจ้งวัฒนะ
          </li>
          <li>
            <strong>ผลจากการผายปาก</strong> — สามารถดึงรถเลี้ยวซ้ายออกจากสัญญาณไฟ 15–20% ของขา EB ซึ่งเป็นขาที่ความยาวแถวคอยยาวที่สุด (สูงสุด 200 ม.)
            ความจุซ้ายผ่านตลอดแบบให้ทางประมาณ {n(Math.round(freeCap))} PCU/ชม. ต่อความต้องการ {n(demand)} คัน/ชม. ค่า v/c ≈ {freeX.toFixed(2)} LOS{" "}
            {losFromVc(freeX)} การหน่วงต่อคันลดจากประมาณ {n(sigD, 0)} วินาที เหลือ {n(freeD, 0)} วินาที
          </li>
        </ol>
      </section>

      <section className="mt-8 rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">ความจุปัจจุบัน (สมมติสัญญาณ) เทียบซ้ายผ่านตลอด</h2>
        <p className="mt-1 text-sm text-muted">
          ไฟล์สำรวจไม่มีเวลาเขียว (g) และรอบไฟ (C) — ใช้ความไหวต่อค่าทั่วไปของแยกใหญ่ กทม. ความอิ่มตัวเลี้ยวซ้าย {n(SAT_LEFT)} PCU/ชม./ช่อง
          ความต้องการใช้ชั่วโมงพีค {n(demand)} คัน (12:00–13:00) และอัตราพีค 15 นาที {n(peak15rate)} คัน/ชม.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            รอบไฟ C (วินาที) · {cycle}
            <input
              type="range"
              min={90}
              max={180}
              step={10}
              value={cycle}
              onChange={(e) => setCycle(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <label className="text-sm">
            สัดส่วนเขียวเลี้ยวซ้าย g/C · {gOverC.toFixed(2)}
            <input
              type="range"
              min={0.1}
              max={0.3}
              step={0.01}
              value={gOverC}
              onChange={(e) => setG(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <label className="text-sm">
            ปริมาณขัดแย้งบนกำแพงเพชร 6 NB (คัน/ชม.) · {conflict}
            <input
              type="range"
              min={200}
              max={1200}
              step={50}
              value={conflict}
              onChange={(e) => setConflict(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <label className="text-sm">
            ช่องว่างวิกฤต t<sub>c</sub> (วินาที) · {tc.toFixed(1)}
            <input
              type="range"
              min={5}
              max={8}
              step={0.1}
              value={tc}
              onChange={(e) => setTc(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[12px] bg-bad-bg p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-bad">สถานะปัจจุบัน · สัญญาณไฟ</p>
            <p className="mt-2 font-mono text-2xl tabular-nums">
              {n(sigCap, 0)} PCU/ชม.
            </p>
            <p className="mt-1 text-sm">
              v/c {sigX.toFixed(2)} · หน่วง {n(sigD, 0)} วินาที/คัน · LOS {losSignal(sigD)}
            </p>
          </div>
          <div className="rounded-[12px] bg-ok-bg p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-ok">หลังผายปาก · ซ้ายผ่านตลอด (ให้ทาง)</p>
            <p className="mt-2 font-mono text-2xl tabular-nums">
              {n(freeCap, 0)} PCU/ชม.
            </p>
            <p className="mt-1 text-sm">
              v/c {freeX.toFixed(2)} · หน่วง {n(freeD, 0)} วินาที/คัน · LOS {losUnsig(freeD)}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          ประหยัดหน่วงทิศนี้ประมาณ {n(savePerVeh, 0)} วินาที/คัน หรือ {n(savePeakHour, 1)} คัน-ชั่วโมง ในชั่วโมงพีค
          หากทำช่องเร่งความเร็วแบบไม่ต้องให้ทาง ความจุจะสูงกว่านี้ (1,200+ PCU/ชม.)
        </p>

        <table className="mt-5 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <th className="py-2 font-medium">g/C</th>
              <th className="py-2 font-medium">C</th>
              <th className="py-2 text-right font-medium">ความจุ</th>
              <th className="py-2 text-right font-medium">v/c @ 342</th>
              <th className="py-2 text-right font-medium">หน่วง (วินาที)</th>
              <th className="py-2 text-right font-medium">LOS</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((r) => {
              const cap = SAT_LEFT * r.g;
              const x = vcRatio(demand, cap);
              const d = signalDelay({ cycle: r.c, gOverC: r.g, volume: demand });
              return (
                <tr key={`${r.g}-${r.c}`} className="border-b border-border/70">
                  <td className="py-2">{r.g.toFixed(2)}</td>
                  <td className="py-2">{r.c}</td>
                  <td className="py-2 text-right">{n(cap, 0)}</td>
                  <td className="py-2 text-right">{x.toFixed(2)}</td>
                  <td className="py-2 text-right">{n(d, 0)}</td>
                  <td className="py-2 text-right">
                    <Badge tone={losSignal(d) === "F" || losSignal(d) === "E" ? "bad" : "warn"}>
                      {losSignal(d)}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-6 rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">ข้อพิจารณาเพิ่มเติมด้านวิศวกรรมจราจร</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
          <li>
            ช่องเร่งความเร็ว (Acceleration Lane) บนถนนกำแพงเพชร 6 (ทิศเหนือ) ควรกำหนดความยาวอย่างน้อย 40–60 เมตร
            (หากเขตทางเพียงพอ) เพื่อลดการแย่งช่องจราจรของรถเลี้ยวซ้ายผ่านตลอดกับรถทางตรงที่รอจังหวะสัญญาณไฟจราจร
          </li>
          <li>
            ความยาวช่องทางเข้าและระยะปาด (Entry Lane and Taper) กำหนดในระยะ 26 เมตร สำหรับการรองรับคิวรถรอให้ทาง (Yield)
            ประมาณ 2–4 คัน เนื่องจากความจุของถนนในสภาวะที่รถเคลื่อนตัวได้อิสระ (Free-flow) มีปริมาณความต้องการมากกว่า 342 คัน/ชั่วโมง
          </li>
          <li>
            ติดตั้งป้ายและเครื่องหมายจราจรเพิ่มเติม อาทิ เครื่องหมายเลี้ยวซ้ายผ่านตลอด ป้ายเตือนให้ทาง (Yield Sign)
            และเครื่องหมายห้ามจอดรถบริเวณทางแยก
          </li>
          <li>
            ปรับเลื่อนตำแหน่งทางข้าม (ทางม้าลาย) ให้พ้นจากรัศมีทางโค้ง หรือออกแบบให้มีเกาะหลบภัย (Refuge Island)
            เพื่อลดความเสี่ยงในการเกิดอุบัติเหตุจากรถเลี้ยวซ้ายผ่านตลอด
          </li>
          <li>
            ตรวจสอบรัศมีวงเลี้ยว (Swept Path) เนื่องจากทิศทางดังกล่าวอาจมีปริมาณรถบรรทุกและรถโดยสารขนาดใหญ่จำนวน 14 คัน/12 ชั่วโมง
            จึงต้องตรวจสอบรัศมีวงเลี้ยวจากแบบก่อสร้าง (มาตราส่วน 1:500) ให้ถี่ถ้วนก่อนดำเนินการก่อสร้างจริง
          </li>
          <li>
            การผายปากทางอย่างเดียวไม่เพียงพอ ควรมีการปรับรอบจังหวะสัญญาณไฟจราจรให้สอดคล้องกับสภาพการจราจรแต่ละช่วงเวลาเพิ่มเติม
          </li>
        </ol>
      </section>

      <section className="mt-6 rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">ข้อจำกัดของข้อมูล</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
          <li>สำรวจวันเดียว (วันพุธที่ 20 พฤษภาคม 2569 อากาศปกติ) ไม่ใช่ค่าเฉลี่ย 3 วัน</li>
          <li>ไม่มีเวลาสัญญาณไฟในไฟล์สำรวจ — ความจุสถานะปัจจุบันเป็นการวิเคราะห์ความไหว</li>
          <li>ความยาวแถวคอยเป็นคิวขารวม ไม่แยกคิวเลี้ยวซ้าย จึงประเมิน spillback ของช่องซ้ายโดยอ้อม</li>
          <li>บางชั่วโมงมีตัวอย่างแถวคอยเพียง 1 จุด (EB 08–09 น. = 200 ม.) ควรใช้ด้วยความระมัดระวัง</li>
          <li>
            รายงานฉบับก่อนวิเคราะห์คนละทิศทาง (NB เลี้ยวซ้าย) และมีค่า PCU ผิดปกติ 18,211 — ไม่นำมาใช้ในรายงานนี้
          </li>
        </ul>
      </section>
    </Shell>
  );
}
