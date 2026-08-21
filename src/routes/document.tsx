import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadBanner, DownloadReport } from "@/components/download-report";
import { IntersectionSchematic } from "@/components/intersection-schematic";
import {
  ConflictMatrix,
  IntergreenTable,
  StagePlayer,
  CircularHead,
} from "@/components/signal-spec";
import {
  CHECKLIST,
  HEADS,
  INTERGREEN_SUM,
  KEY_CONFLICTS,
  PHASES,
  PLANS,
  SITE,
  STAGES,
  STANDARDS,
  UNUSED_STAGES,
} from "@/data/signal-design";
import { APPROACH_LABEL, MOVEMENT_LABEL, survey } from "@/data/survey";
import {
  losSignal,
  losUnsig,
  SAT_LEFT,
  signalDelay,
  twscDelay,
  vcRatio,
  yieldCapacity,
} from "@/lib/traffic";
import { hourLabel, n } from "@/lib/utils";

export const Route = createFileRoute("/document")({ component: TeReport });

const TOC = [
  "บทนำ",
  "พื้นที่ศึกษาและสภาพปัจจุบัน",
  "วิธีการศึกษาและมาตรฐานตามหลักวิศวกรรมจราจร",
  "ผลการสำรวจและวิเคราะห์ข้อมูล",
  "แถวคอยและระดับการให้บริการปัจจุบัน",
  "วินิจฉัยปัญหา",
  "ทางเลือกการปรับปรุง",
  "การวิเคราะห์ผลจากการผายปากและปรับรัศมีวงเลี้ยว",
  "รูปแบบสัญญาณไฟจราจร",
  "ข้อเสนอแนะและแผนดำเนินงาน",
  "ข้อจำกัดและความไม่แน่นอน",
  "เอกสารอ้างอิง",
];

function sumMove(key: string) {
  return survey.hourly.reduce((s, h) => s + (h.m[key]?.v ?? 0), 0);
}

function TeReport() {
  const demand = 342;
  const peak15rate = 376;
  const conflictNb = 523;
  const tc = 6.5;
  const cycleSheet = 180;
  const gCgeom = 0.18;
  const gCsignal = 78 / 180;

  const capGeom = SAT_LEFT * gCgeom;
  const xGeom = vcRatio(demand, capGeom);
  const dGeom = signalDelay({ cycle: cycleSheet, gOverC: gCgeom, volume: demand });
  const capSig = SAT_LEFT * gCsignal;
  const xSig = vcRatio(demand, capSig);
  const dSig = signalDelay({ cycle: cycleSheet, gOverC: gCsignal, volume: demand });
  const freeCap = yieldCapacity(conflictNb, tc, 3.3);
  const freeX = vcRatio(demand, freeCap);
  const freeD = twscDelay(demand, freeCap, 0.25);
  const dayGreen = STAGES.reduce((s, st) => s + st.recSec.day, 0);

  const am = survey.hourly[0].eb5.v + survey.hourly[1].eb5.v;
  const pm = survey.hourly[9].eb5.v + survey.hourly[10].eb5.v;
  const peakHour = survey.hourly.reduce((a, b) => (a.eb5.v > b.eb5.v ? a : b));
  const ixPeak = survey.hourly.reduce((a, b) => (a.tot > b.tot ? a : b));
  const peak15 = survey.q15.reduce((a, b) => (a.EB5 > b.EB5 ? a : b));
  const ebQmax = Math.max(...survey.queue.EB.map((q) => q.max ?? 0));
  const mix = survey.mixEb5;
  const mixTot = mix.c + mix.vn + mix.b + mix.mb + mix.tk + mix.tr;

  const moves = ["NB1", "NB2", "NB3", "EB5", "EB6", "EB7", "EB8", "SB9", "SB10", "SB11", "WB13", "WB14"];

  const ap12 = {
    NB: survey.hourly.reduce((s, h) => s + h.ap.NB, 0),
    EB: survey.hourly.reduce((s, h) => s + h.ap.EB, 0),
    SB: survey.hourly.reduce((s, h) => s + h.ap.SB, 0),
    WB: survey.hourly.reduce((s, h) => s + h.ap.WB, 0),
  };

  return (
    <Shell>
      <div className="no-print mb-6">
        <DownloadBanner />
      </div>
      <div className="no-print mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            ตามรูปแบบวิศวกรรมจราจร · HCM / ITE
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight">
            รายงานการวิเคราะห์ปริมาณการจราจรทางแยกหลักสี่
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            แยกไอทีสแควร์ — ปริมาณจราจร แถวคอย ความจุ และแบบสัญญาณไฟจราจร
            เพื่อวิเคราะห์การแก้ไขปัญหาจราจรในทางเลี้ยวซ้ายจากถนนแจ้งวัฒนะ เข้าถนนกำแพงเพชร 6 ทางทิศเหนือ
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadReport label="ดาวน์โหลด Word" />
          <Button type="button" variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            พิมพ์รายงาน
          </Button>
        </div>
      </div>

      <article className="doc-paper space-y-10 rounded-[18px] bg-surface p-5 shadow-card sm:p-8">
        <header className="doc-cover border-b border-border pb-8">
          <p className="text-xs tracking-[0.16em] text-muted">รายงานทางเทคนิค</p>
          <p className="mt-6 text-sm font-medium text-accent">สำนักการจราจรและขนส่ง กรุงเทพมหานคร</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">
            รายงานการวิเคราะห์ปริมาณการจราจรทางแยกหลักสี่
            <span className="mt-2 block text-xl font-normal text-muted">
              (แยกไอทีสแควร์)
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            ตามรูปแบบวิศวกรรมจราจร — ปริมาณจราจร แถวคอย ความจุ และแบบสัญญาณไฟจราจร
            เพื่อวิเคราะห์การแก้ไขปัญหาจราจรในทางเลี้ยวซ้ายจากถนนแจ้งวัฒนะ เข้าถนนกำแพงเพชร 6 ทางทิศเหนือ
          </p>
          <p className="mt-4 text-sm text-muted">
            สัญญาณไฟจราจรหมายเลข {SITE.cabinet} · {SITE.code} · {SITE.roads.ew} × {SITE.roads.ns}
          </p>
          <dl className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">วันสำรวจ</dt>
              <dd className="font-medium">
                {survey.site.date} ({survey.site.dow}) อากาศ{survey.site.weather}
              </dd>
            </div>
            <div>
              <dt className="text-muted">พิกัด</dt>
              <dd className="font-medium">
                {SITE.lat.toFixed(6)}°N {SITE.lng.toFixed(6)}°E
              </dd>
            </div>
            <div>
              <dt className="text-muted">วิธีการศึกษา</dt>
              <dd className="font-medium">HCM 7 · Webster · Harders · UK TSM Ch.6</dd>
            </div>
            <div>
              <dt className="text-muted">ผู้วิเคราะห์ข้อมูลและจัดทำรายงาน</dt>
              <dd className="font-medium">นางสาวประภาวดี วชิรพุทธิ์</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-muted">
            เอกสารนี้เป็นรายงานวิเคราะห์ทางเทคนิค ไม่ใช่คำสั่งติดตั้งจนกว่าสำนักการจราจรและขนส่งจะรับรอง
            และไม่ทดแทนแบบก่อสร้างมาตราส่วน 1:500 รวมทั้งการวัดระยะเคลียร์จริง ณ สนาม
          </p>
        </header>

        <nav className="no-print rounded-[12px] bg-surface-2 p-4 text-sm">
          <p className="font-semibold">สารบัญ</p>
          <ol className="mt-2 columns-1 gap-x-6 sm:columns-2">
            {TOC.map((t, i) => (
              <li key={t} className="break-inside-avoid py-0.5">
                <a className="text-accent hover:underline" href={`#ch${i + 1}`}>
                  บทที่ {i + 1} {t}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="ch1" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 1 บทนำ</h3>
          <h4 className="font-semibold">1.1 หลักการและเหตุผล</h4>
          <p>
            สำนักงานเขตหลักสี่ได้มีหนังสือถึงผู้อำนวยการสำนักการจราจรและขนส่ง
            ขอคำนวณปริมาณจราจรบริเวณแยกหลักสี่ ถนนแจ้งวัฒนะตัดถนนกำแพงเพชร 6
            เพื่อประกอบโครงการปาดผายมุมทางเลี้ยวซ้ายให้มีรัศมีวงเลี้ยวเพิ่มขึ้น
            แก้ไขปัญหาจราจรติดขัดที่แจ้งวัฒนะขาเข้าเลี้ยวซ้ายเข้ากำแพงเพชร 6 ทิศเหนือ
          </p>
          <p>
            รายงานวิเคราะห์ฉบับก่อนใช้ทิศทาง NB เลี้ยวซ้าย (กำแพงเพชร 6 ไปแจ้งวัฒนะ)
            และมีค่า PCU ผิดปกติ รายงานฉบับนี้จึงใช้ทิศทางเป้าหมาย <strong>EB5</strong>
            และคำนวณจากข้อมูลดิบของไฟล์สำรวจ หลักสี่(500) 69_05_20
          </p>
          <h4 className="font-semibold">1.2 วัตถุประสงค์การวิเคราะห์ข้อมูล</h4>
          <ol className="list-decimal space-y-1 pl-5">
            <li>หาปริมาณจราจร องค์ประกอบรถ และแถวคอยของทิศทางเป้าหมายและทั้งแยก</li>
            <li>ประเมินระดับการให้บริการปัจจุบันของทิศทางเลี้ยวซ้ายตาม HCM</li>
            <li>วิเคราะห์ผลจากการผายปากและเลี้ยวซ้ายผ่านตลอด เทียบสถานะสัญญาณไฟจราจร</li>
            <li>กำหนดแบบรอบสัญญาณไฟจราจรตามทิศทางการจราจรจริง</li>
            <li>เสนอผลจากมาตรการ พร้อมข้อเสนอแนะ</li>
          </ol>
          <h4 className="font-semibold">1.3 ข้อจำกัดและขอบเขตการวิเคราะห์ข้อมูล</h4>
          <p>
            เป็นการศึกษาเฉพาะสัญญาณไฟจราจรหมายเลขตู้ 500 ไม่ได้วิเคราะห์ประสานกับตู้สัญญาณไฟจราจรหมายเลข 360
            (แยกหลักสี่–วิภาวดี ระยะห่างประมาณ 80 เมตร) ในระดับ OFFSET
            ไม่มีการวิเคราะห์โครงข่ายทั้งสายถนนแจ้งวัฒนะ และไม่มีการประเมินอุบัติเหตุย้อนหลัง
          </p>
        </section>

        <section id="ch2" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 2 พื้นที่ศึกษาและสภาพปัจจุบัน</h3>
          <p>
            สัญญาณไฟจราจรหมายเลขตู้ 500 คือแยกหลักสี่พลาซ่า / แยกไอทีสแควร์
            ไม่ใช่แยกหลักสี่–วิภาวดี (ตู้ 360) การขับขี่ในประเทศไทยชิดซ้าย
            ทิศทางเลี้ยวใกล้คือเลี้ยวซ้าย ทิศทางเลี้ยวตัดคือเลี้ยวขวา
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">ทิศ</th>
                  <th className="border border-border px-3 py-2">ถนน / จุดสังเกต</th>
                  <th className="border border-border px-3 py-2">ทิศทาง Turning Movement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2">เหนือ</td>
                  <td className="border border-border px-3 py-2">กำแพงเพชร 6 ทิศเหนือ</td>
                  <td className="border border-border px-3 py-2">SB</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">ตะวันออก</td>
                  <td className="border border-border px-3 py-2">
                    แจ้งวัฒนะไปวิภาวดี · ทางรถไฟ · ตู้ 360 ~80 ม.
                  </td>
                  <td className="border border-border px-3 py-2">WB</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">ใต้</td>
                  <td className="border border-border px-3 py-2">กำแพงเพชร 6 ทิศใต้ · สายสีชมพู</td>
                  <td className="border border-border px-3 py-2">NB</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">ตะวันตก</td>
                  <td className="border border-border px-3 py-2">แจ้งวัฒนะไปปากเกร็ด / ศูนย์ราชการ</td>
                  <td className="border border-border px-3 py-2">EB ขาเข้า — ทิศเป้าหมาย</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">ม.ต.ต.ใต้</td>
                  <td className="border border-border px-3 py-2" colSpan={2}>
                    {SITE.adjacent.sw} — มุมที่จะผายปาก
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <figure className="overflow-hidden rounded-[12px] border border-border bg-white">
            <img
              src="/docs/site-plan.png"
              alt="รูปแบบบริเวณที่จะทำการผายปาก แยกหลักสี่"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-border px-3 py-2 text-xs text-muted">
              ภาพที่ 1 รูปแบบบริเวณที่จะทำการผายปาก — พื้นที่ขยายเขตทางประมาณ 153.00 ตร.ม. ระยะร่นสายสีชมพู 3.00 ม.
            </figcaption>
          </figure>
          <IntersectionSchematic />
          <h4 className="font-semibold">2.1 การควบคุมปัจจุบัน</h4>
          <p>
            คอนโทรลเลอร์แบบสเตจ ศรีทองเจริญ LED แผนวันรอบ 180 วินาที (06:00) แผนคืน 135 วินาที (22:00)
            ใช้สเตจ 1, 2, 3, 8 OFFSET ว่าง ไม่ประสานตู้ 360 แผ่น HEAD TYPE และ PHASE CONFLICT ว่าง
            เขียวรวมเท่ากับรอบพอดี — ไม่เหลือเหลือง/แดงทั้งหมดในตัวเลขที่ลงแผ่น
          </p>
        </section>

        <section id="ch3" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 3 วิธีการศึกษาและมาตรฐานตามหลักวิศวกรรมจราจร</h3>
          <p>
            การวิเคราะห์ตามรายงานนี้ใช้หลัก ITE Recommended Practice (Transportation Impact Analyses)
            ปรับเป็นการศึกษาทางแยกเดี่ยว และใช้วิธีคำนวณตาม HCM 7
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">รายการ</th>
                  <th className="border border-border px-3 py-2">วิธี / มาตรฐาน</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2">นับปริมาณ</td>
                  <td className="border border-border px-3 py-2">
                    15 นาที 07:00–19:00 แยกตามทิศและชนิดรถ · PCU จากหัวไฟล์สำรวจ
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">PCU</td>
                  <td className="border border-border px-3 py-2">
                    รถยนต์/ตู้ = 1 · เมล์ใหญ่ = 2.1 · เมล์เล็ก = 1.5 · บรรทุก = 2.5 · สามล้อ = 0.93
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">PHF</td>
                  <td className="border border-border px-3 py-2">V / (4 × V15max) ตาม HCM</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">หน่วงสัญญาณ</td>
                  <td className="border border-border px-3 py-2">
                    Webster d1 + HCM overflow d2 · s = {n(SAT_LEFT)} PCU/ชม./ช่องเลี้ยว
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">ซ้ายผ่านตลอด (ให้ทาง)</td>
                  <td className="border border-border px-3 py-2">
                    Harders / HCM unsignalized · tc = 6.5 วินาที · tf = 3.3 วินาที
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">LOS สัญญาณ</td>
                  <td className="border border-border px-3 py-2">
                    A≤10 B≤20 C≤35 D≤55 E≤80 F เกิน 80 วินาที/คัน (HCM signalized)
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">LOS ไม่มีไฟ</td>
                  <td className="border border-border px-3 py-2">
                    A≤10 B≤15 C≤25 D≤35 E≤50 F เกิน 50 วินาที/คัน (HCM TWSC)
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">หัวสัญญาณ</td>
                  <td className="border border-border px-3 py-2">
                    MUTCD 11 Part 4 (สะท้อนเป็นขับซ้าย) · UK TSM Chapter 6 · Vienna R.E.2
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">Intergreen</td>
                  <td className="border border-border px-3 py-2">
                    เหลือง 3 วินาที · แดงทั้งหมด max(2, (W+6)/10) ม./วินาที
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="ch4" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 4 ผลการสำรวจและวิเคราะห์ข้อมูล</h3>
          <h4 className="font-semibold">4.1 สรุปปริมาณจราจรทั้งแยกและทิศเป้าหมาย</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat k="ปริมาณจราจรทั้งแยก 12 ชม." v={`${n(survey.ix_12h)} คัน`} s="07.00–19.00 น." />
            <Stat k="ทิศทาง EB5 12 ชม." v={`${n(survey.eb5_12h)} คัน`} s={`${n(survey.eb5_12h_pcu, 0)} PCU · ${((survey.eb5_12h / survey.ix_12h) * 100).toFixed(1)}% ของแยก`} />
            <Stat k="Peak Hour EB5" v={`${n(peakHour.eb5.v)} คัน/ชม.`} s={`${hourLabel(peakHour.h)} น. · PHF ${peakHour.eb5.phf}`} />
          </div>
          <p>
            ช่วงเร่งด่วนเช้า 07:00–09:00 น. รวม {n(am)} คัน (เฉลี่ย {n(am / 2)} คัน/ชม.)
            ช่วงเร่งด่วนเย็น 16:00–18:00 น. รวม {n(pm)} คัน (เฉลี่ย {n(pm / 2)} คัน/ชม.)
            ช่วง Peak Hour ของทิศทางเป้าหมายนี้คือช่วงเที่ยง ไม่ใช่ช่วงเร่งด่วนเช้า
            ช่วง Peak Hour ของทั้งแยกในช่วง {hourLabel(ixPeak.h)} น. ที่ {n(ixPeak.tot)} คัน/ชม.
            อัตราพีค 15 นาทีสูงสุด {n(peak15.EB5)} คัน ({hourLabel(peak15.t)} น.) เทียบเท่า {n(peak15.EB5 * 4)} คัน/ชม.
          </p>
          <h4 className="font-semibold">4.2 ปริมาณจราจรรายขาเข้า 12 ชั่วโมง</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">ขาเข้า</th>
                  <th className="border border-border px-3 py-2">ถนน</th>
                  <th className="border border-border px-3 py-2 text-right">คัน</th>
                  <th className="border border-border px-3 py-2 text-right">สัดส่วน</th>
                </tr>
              </thead>
              <tbody>
                {(["NB", "EB", "SB", "WB"] as const).map((k) => (
                  <tr key={k}>
                    <td className="border border-border px-3 py-2 font-medium">{k}</td>
                    <td className="border border-border px-3 py-2">{APPROACH_LABEL[k]}</td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums">{n(ap12[k])}</td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums">
                      {((ap12[k] / survey.ix_12h) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4 className="font-semibold">4.3 ปริมาณรายทิศ 12 ชั่วโมง</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">รหัส</th>
                  <th className="border border-border px-3 py-2">ทิศทาง</th>
                  <th className="border border-border px-3 py-2 text-right">คัน</th>
                </tr>
              </thead>
              <tbody>
                {moves.map((m) => (
                  <tr key={m} className={m === "EB5" ? "bg-target-bg" : undefined}>
                    <td className="border border-border px-3 py-2 font-medium">{m}</td>
                    <td className="border border-border px-3 py-2">{MOVEMENT_LABEL[m]}</td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums">{n(sumMove(m))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4 className="font-semibold">4.4 สัดส่วนรถในทิศทาง EB5</h4>
          <p>
            รถยนต์ {n(mix.c)} ({((mix.c / mixTot) * 100).toFixed(1)}%) · ตู้/ปิคอัพ {n(mix.vn)} (
            {((mix.vn / mixTot) * 100).toFixed(1)}%) · เมล์ {n(mix.b)} · บรรทุก {n(mix.tk)} · สามล้อ {n(mix.tr)} —
            เกือบทั้งหมดเป็นรถยนต์นั่ง ข้อเสนอแนะ: รัศมีวงเลี้ยวต้องกว้างเพียงพอสำหรับรถใหญ่ที่อาจมีปริมาณ 14 คันต่อวัน
          </p>
          <h4 className="font-semibold">4.5 ตารางชั่วโมง EB5</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">ช่วง</th>
                  <th className="border border-border px-3 py-2 text-right">คัน</th>
                  <th className="border border-border px-3 py-2 text-right">PCU</th>
                  <th className="border border-border px-3 py-2 text-right">พีค 15 นาที</th>
                  <th className="border border-border px-3 py-2 text-right">PHF</th>
                  <th className="border border-border px-3 py-2 text-right">% ขา EB</th>
                </tr>
              </thead>
              <tbody>
                {survey.hourly.map((h) => (
                  <tr key={h.h}>
                    <td className="border border-border px-3 py-2">{hourLabel(h.h)}</td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums font-medium">
                      {n(h.eb5.v)}
                    </td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums">{n(h.eb5.p, 1)}</td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums">{h.eb5.p15}</td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums">{h.eb5.phf ?? "–"}</td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums">
                      {((h.eb5.v / h.ap.EB) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="ch5" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 5 แถวคอยและระดับการให้บริการปัจจุบัน</h3>
          <h4 className="font-semibold">5.1 แถวคอยที่สำรวจ</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">ขา</th>
                  <th className="border border-border px-3 py-2 text-right">สูงสุด (ม.)</th>
                  <th className="border border-border px-3 py-2">ช่วง</th>
                </tr>
              </thead>
              <tbody>
                {(["NB", "EB", "SB", "WB"] as const).map((k) => {
                  const row = survey.queue[k].reduce((a, b) => ((a.max ?? 0) > (b.max ?? 0) ? a : b));
                  return (
                    <tr key={k} className={k === "EB" ? "bg-bad-bg" : undefined}>
                      <td className="border border-border px-3 py-2 font-medium">{APPROACH_LABEL[k]}</td>
                      <td className="border border-border px-3 py-2 text-right tabular-nums">{row.max}</td>
                      <td className="border border-border px-3 py-2">{row.h}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p>
            ขา EB ยาวที่สุด สูงสุด {ebQmax} ม. ช่วงเช้า — spillback บนแจ้งวัฒนะขาเข้า
            ลิงก์ตะวันออกไปตู้ 360 ยาวเพียง ~80 ม. คิว WB/EB จึงปิดปากแยกคู่ได้ง่าย
          </p>
          <h4 className="font-semibold">5.2 ความจุและ LOS ของ EB5 (สถานะมีสัญญาณ)</h4>
          <p>
            เลี้ยวซ้าย EB5 เป็นเลี้ยวใกล้ (ขับซ้าย) ไปได้ช่วงวงกลม C เขียว (สเตจ 3+8 = 78/180 วินาที)
            แต่มุมแคบบังคับความเร็วต่ำกว่า 15 กม./ชม. และแชร์ช่องกับทางตรง จึงใช้สองกรณี
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">กรณี</th>
                  <th className="border border-border px-3 py-2">สมมติ</th>
                  <th className="border border-border px-3 py-2 text-right">ความจุ</th>
                  <th className="border border-border px-3 py-2 text-right">v/c</th>
                  <th className="border border-border px-3 py-2 text-right">หน่วง</th>
                  <th className="border border-border px-3 py-2">LOS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">A จำกัดด้วยเรขา</td>
                  <td className="border border-border px-3 py-2">
                    C = {cycleSheet} วินาที · g/C = {gCgeom.toFixed(2)}
                  </td>
                  <td className="border border-border px-3 py-2 text-right tabular-nums">{n(capGeom, 0)}</td>
                  <td className="border border-border px-3 py-2 text-right tabular-nums">{xGeom.toFixed(2)}</td>
                  <td className="border border-border px-3 py-2 text-right tabular-nums">{n(dGeom, 0)} วินาที</td>
                  <td className="border border-border px-3 py-2">
                    <Badge tone="bad">{losSignal(dGeom)}</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">B เขียวตามแผ่น</td>
                  <td className="border border-border px-3 py-2">
                    C = {cycleSheet} วินาที · g/C = {gCsignal.toFixed(2)} (สเตจ 3+8)
                  </td>
                  <td className="border border-border px-3 py-2 text-right tabular-nums">{n(capSig, 0)}</td>
                  <td className="border border-border px-3 py-2 text-right tabular-nums">{xSig.toFixed(2)}</td>
                  <td className="border border-border px-3 py-2 text-right tabular-nums">{n(dSig, 0)} วินาที</td>
                  <td className="border border-border px-3 py-2">
                    <Badge tone="warn">{losSignal(dSig)}</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">
            ความต้องการชั่วโมงออกแบบ = {n(demand)} คัน/ชม. (12:00–13:00) อัตราพีค 15 นาที = {n(peak15rate)} คัน/ชม.
            กรณี A สอดคล้องคิว EB 200 ม. มากกว่ากรณี B — ใช้กรณี A เป็นฐานเปรียบเทียบทางเลือก
          </p>
        </section>

        <section id="ch6" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 6 วินิจฉัยปัญหา</h3>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>เรขาคณิตมุมแคบ</strong> — เลี้ยวซ้ายต้องชะลอ กินเวลาเขียวของช่องใน ดันคิวแจ้งวัฒนะ
            </li>
            <li>
              <strong>ไม่มีช่องเก็บเลี้ยวซ้าย</strong> — EB5 ปนช่องตรง EB6/7 สัดส่วนราว 19% ของขา EB
            </li>
            <li>
              <strong>คิว EB 200 ม.</strong> ยาวสุดทั้งแยก ช่วงเช้า กระทบทั้งทางตรงและเลี้ยว
            </li>
            <li>
              <strong>ลิงก์ 80 ม. ไปตู้ 360 ไม่มี OFFSET</strong> — เขียว C 78 วินาทีต่อรอบ 180 เทเข้าลิงก์เกินความจุ
            </li>
            <li>
              <strong>หัวสัญญาณไม่แยกวงกลม/ลูกศร</strong> — เสี่ยงเขียวพร้อมกันของเลี้ยวขวาตัด (B×G, D×A)
            </li>
            <li>
              <strong>Intergreen ไม่ปรากฏในรอบ</strong> — เขียวรวม = รอบ รถเคลียร์ตัดเขียวเฟสถัดไปได้
            </li>
            <li>
              <strong>ไม่มีเฟสคนเดิน</strong> ทั้งที่มีทางม้าลายขาใต้ หน้าห้างไอทีสแควร์
            </li>
          </ol>
        </section>

        <section id="ch7" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 7 ทางเลือกการปรับปรุง</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">ทางเลือก</th>
                  <th className="border border-border px-3 py-2">สาระ</th>
                  <th className="border border-border px-3 py-2">ผลเบื้องต้น</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">0 ไม่ทำอะไร</td>
                  <td className="border border-border px-3 py-2">คงมุมแคบและรอบ 180 วินาที</td>
                  <td className="border border-border px-3 py-2">LOS F กรณีเรขา · คิว EB คงยาว</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">1 จูนไฟอย่างเดียว</td>
                  <td className="border border-border px-3 py-2">ลดรอบ ใส่ intergreen ประสานตู้ 360</td>
                  <td className="border border-border px-3 py-2">ช่วยทางตรงได้บ้าง เลี้ยวซ้ายยังติดมุม</td>
                </tr>
                <tr className="bg-ok-bg">
                  <td className="border border-border px-3 py-2 font-medium">2 ผายปาก + ซ้ายผ่านตลอด</td>
                  <td className="border border-border px-3 py-2">ตามแบบเขตหลักสี่ + ให้ทางเข้า NB</td>
                  <td className="border border-border px-3 py-2">ดึง EB5 ออกจากไฟ · ลดแรงเสียดทานช่องตรง</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-medium">3 ข้อ 2 + แก้หัวสัญญาณ</td>
                  <td className="border border-border px-3 py-2">ลูกศร B/D · conflict monitor · PD</td>
                  <td className="border border-border px-3 py-2">ครบทั้งความจุและความปลอดภัย — แนะนำ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            แบบผายปากจากเขตหลักสี่: แนวปาด 26.15 ม. · ทแยง 11.25 ม. · โค้งปากทาง 9.77 ม. · ทางเท้าคงเหลือ 5.14 ม. ·
            ร่น Protection Zone A สายสีชมพู 3.00 ม. ห้ามล้ำ
          </p>
        </section>

        <section id="ch8" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 8 การวิเคราะห์ผลจากการผายปากและปรับรัศมีวงเลี้ยว</h3>
          <p>
            การดำเนินงานโครงการคือการปาดมุมทางเท้ามุมตะวันตกเฉียงใต้ของแยก
            ให้รถจากถนนแจ้งวัฒนะขาเข้าเลี้ยวซ้ายเข้าถนนกำแพงเพชร 6 ทิศเหนือได้ด้วยรัศมีที่กว้างขึ้น
            และแยกช่องเลี้ยวซ้ายผ่านตลอดออกจากช่องทางตรง
          </p>
          <p>
            หลังผายปาก แยกช่องซ้ายผ่านตลอดออกจากสัญญาณไฟจราจร ใช้ช่องว่างวิกฤตบนถนนกำแพงเพชร 6 ทิศเหนือ
            ปริมาณจราจรขัดแย้งใช้ขา NB ชั่วโมงพีคทั้งแยกประมาณ {n(conflictNb)} คัน/ชม. (12:00–13:00 น.)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">ตัวชี้วัด</th>
                  <th className="border border-border px-3 py-2">ปัจจุบัน (กรณี A)</th>
                  <th className="border border-border px-3 py-2">หลังผายปาก (ให้ทาง)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2">ความจุ</td>
                  <td className="border border-border px-3 py-2 tabular-nums">{n(capGeom, 0)} PCU/ชม.</td>
                  <td className="border border-border px-3 py-2 tabular-nums">{n(freeCap, 0)} PCU/ชม.</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">ความต้องการ</td>
                  <td className="border border-border px-3 py-2 tabular-nums" colSpan={2}>
                    {n(demand)} คัน/ชม. (ชั่วโมงออกแบบ 12:00–13:00)
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">v/c</td>
                  <td className="border border-border px-3 py-2 tabular-nums">{xGeom.toFixed(2)}</td>
                  <td className="border border-border px-3 py-2 tabular-nums">{freeX.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">หน่วงควบคุม</td>
                  <td className="border border-border px-3 py-2 tabular-nums">{n(dGeom, 0)} วินาที/คัน</td>
                  <td className="border border-border px-3 py-2 tabular-nums">{n(freeD, 0)} วินาที/คัน</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">LOS</td>
                  <td className="border border-border px-3 py-2">
                    <Badge tone="bad">{losSignal(dGeom)}</Badge>
                  </td>
                  <td className="border border-border px-3 py-2">
                    <Badge tone="ok">{losUnsig(freeD)}</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            หน่วงต่อคันลดประมาณ {n(Math.max(0, dGeom - freeD), 0)} วินาที ความจุเหลือเฟือต่อ 342 คัน/ชม.
            (v/c ≈ {freeX.toFixed(2)}) ประโยชน์หลักต่อทั้งแยกคือ<strong>ดึง 15–20% ของขา EB ออกจากสัญญาณ</strong>
            ให้ช่องตรงรับคิว 200 ม. ได้ดีขึ้น แนวปาด 26 ม. เพียงพอคิว yield 2–4 คัน
          </p>
          <h4 className="font-semibold">8.1 ข้อพิจารณาเพิ่มเติมด้านวิศวกรรมจราจร</h4>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              ช่องเร่งความเร็ว (Acceleration Lane) บนถนนกำแพงเพชร 6 (ทิศเหนือ) ควรกำหนดความยาวอย่างน้อย 40–60 เมตร
              (หากเขตทางเพียงพอ) เพื่อลดการแย่งช่องจราจรของรถเลี้ยวซ้ายผ่านตลอดกับรถทางตรงที่รอจังหวะสัญญาณไฟจราจร
            </li>
            <li>
              ความยาวช่องทางเข้าและระยะปาด (Entry Lane and Taper) กำหนดในระยะ 26 เมตร สำหรับการรองรับคิวรถรอให้ทาง (Yield)
              ประมาณ 2–4 คัน เนื่องจากความจุของถนนในสภาวะที่รถเคลื่อนตัวได้อิสระ (Free-flow) สูงกว่าปริมาณความต้องการ 342 คัน/ชั่วโมง
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
              ตรวจสอบรัศมีวงเลี้ยว (Swept Path) เนื่องจากทิศทางดังกล่าว อาจมีปริมาณรถบรรทุกและรถโดยสารขนาดใหญ่จำนวน 14 คัน/12 ชั่วโมง
              จึงต้องตรวจสอบรัศมีวงเลี้ยวจากแบบก่อสร้าง (มาตราส่วน 1:500) ให้ถี่ถ้วนก่อนดำเนินการก่อสร้างจริง
            </li>
            <li>
              การผายปากทางอย่างเดียวไม่เพียงพอ ควรมีการปรับรอบจังหวะสัญญาณไฟจราจรให้สอดคล้องกับสภาพการจราจรแต่ละช่วงเวลาเพิ่มเติม
            </li>
          </ol>
        </section>

        <section id="ch9" className="doc-break space-y-4">
          <h3 className="text-xl font-semibold">บทที่ 9 รูปแบบสัญญาณไฟจราจร บริเวณทางแยกหลักสี่ (แยกไอทีสแควร์)</h3>
          <p>
            ผายปากอย่างเดียวไม่แก้ความปลอดภัยของหัวสัญญาณ บทนี้กำหนดไฟวงกลม (FG) และลูกศร (GA)
            ตามทิศจริง เหนือขึ้นบน
          </p>
          <h4 className="font-semibold">9.1 หลักสากล</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <figure className="flex items-center gap-4 rounded-[12px] bg-surface-2 p-4">
              <CircularHead lit="G" kind="ball" size={52} label="FG" />
              <figcaption className="text-sm">
                Circular green — ไปได้ทุกทิศที่ช่องอนุญาต ต้องให้ทางคนเดินและรถในแยก (MUTCD 4A.03)
              </figcaption>
            </figure>
            <figure className="flex items-center gap-4 rounded-[12px] bg-surface-2 p-4">
              <CircularHead lit="G" kind="arrow-right" size={52} label="GA" />
              <figcaption className="text-sm">
                Green arrow — เฉพาะทิศลูกศร ใช้กับเลี้ยวขวาตัดในระบบขับซ้าย (B และ D)
              </figcaption>
            </figure>
          </div>
          <ul className="space-y-1 text-sm">
            {STANDARDS.map((s) => (
              <li key={s.id}>
                <span className="font-medium">{s.id}.</span> {s.use}
              </li>
            ))}
          </ul>
          <h4 className="font-semibold">9.2 จับคู่เฟส A–G กับทิศจริง</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">เฟส</th>
                  <th className="border border-border px-3 py-2">ทิศจริง</th>
                  <th className="border border-border px-3 py-2">นับ</th>
                  <th className="border border-border px-3 py-2">หัว</th>
                  <th className="border border-border px-3 py-2 text-right">12 ชม.</th>
                </tr>
              </thead>
              <tbody>
                {PHASES.map((p) => (
                  <tr key={p.id}>
                    <td className="border border-border px-3 py-2 font-semibold">{p.id}</td>
                    <td className="border border-border px-3 py-2">{p.move}</td>
                    <td className="border border-border px-3 py-2">{p.count}</td>
                    <td className="border border-border px-3 py-2">
                      <Badge tone={p.head === "GA" ? "bad" : p.head === "FG-perm" ? "target" : "ok"}>
                        {p.head}
                      </Badge>
                    </td>
                    <td className="border border-border px-3 py-2 text-right tabular-nums">{n(p.vol12h)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4 className="font-semibold">9.3 จำลองสเตจบนแผนที่</h4>
          <p className="text-sm">
            สเตจ 3 ต้องเห็น C และ G เขียววงกลม แต่ลูกศร B แดง — นั่นคือจุดตาย B×G
          </p>
          <StagePlayer />
          <h4 className="font-semibold">9.4 PHASE CONFLICT</h4>
          <ConflictMatrix />
          {KEY_CONFLICTS.map((k) => (
            <div key={k.pair} className="rounded-[12px] border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{k.pair}</span>
                <Badge tone={k.sev === "วิกฤต" ? "bad" : "warn"}>{k.sev}</Badge>
              </div>
              <p className="mt-1 text-sm">{k.how}</p>
              <p className="mt-1 text-sm text-ok">แก้: {k.fix}</p>
            </div>
          ))}
          <p className="text-sm">
            ตาราง FT: คู่สเตจ (1,2) และ (3,8) เป็น Non-conflict เพื่อให้ E และ C ค้างเขียว (overlap)
            สเตจสำรอง 4–7 คงในตู้ไม่ใส่แผน — {UNUSED_STAGES.map((u) => `${u.id} (${u.green})`).join(", ")}
          </p>
          <h4 className="font-semibold">9.5 Intergreen และแผนเวลาที่แนะนำ</h4>
          <IntergreenTable />
          <p className="text-sm">
            รวม intergreen {INTERGREEN_SUM} วินาที · เขียวกลางวัน {dayGreen} วินาที · รอบ {PLANS.day.cycleRec} วินาที
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th className="border border-border px-3 py-2">สเตจ</th>
                  <th className="border border-border px-3 py-2">บนแผ่น วัน/คืน</th>
                  <th className="border border-border px-3 py-2">แนะนำ วัน/คืน</th>
                  <th className="border border-border px-3 py-2">เฟส</th>
                </tr>
              </thead>
              <tbody>
                {STAGES.map((s) => (
                  <tr key={s.id}>
                    <td className="border border-border px-3 py-2">
                      {s.id}. {s.name}
                    </td>
                    <td className="border border-border px-3 py-2 tabular-nums">
                      {s.sheetSec.day} / {s.sheetSec.night}
                    </td>
                    <td className="border border-border px-3 py-2 tabular-nums">
                      {s.recSec.day} / {s.recSec.night}
                    </td>
                    <td className="border border-border px-3 py-2">{s.green.join(" + ")}</td>
                  </tr>
                ))}
                <tr className="bg-surface-2 font-semibold">
                  <td className="border border-border px-3 py-2">รอบ</td>
                  <td className="border border-border px-3 py-2">
                    {PLANS.day.cycleSheet} / {PLANS.night.cycleSheet}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {PLANS.day.cycleRec} / {PLANS.night.cycleRec}
                  </td>
                  <td className="border border-border px-3 py-2">DAY CODE 10 · OFFSET 8–12 วินาที วัดจริง</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 className="font-semibold">9.6 หัวสัญญาณรายขา</h4>
          {HEADS.map((h) => (
            <div key={h.approach} className="rounded-[12px] border border-border p-4">
              <p className="font-semibold">{h.approach}</p>
              <p className="text-sm text-muted">{h.stop}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {h.faces.map((f) => (
                  <li key={f.name}>
                    <span className="font-medium">{f.name}.</span> {f.type}
                    <span className="text-muted"> — {f.mount}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="ch10" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 10 ข้อเสนอแนะและแผนดำเนินงาน</h3>
          <p>
            จากการวิเคราะห์ปริมาณจราจร ความยาวแถวคอย และสัญญาณไฟจราจร พบว่าสมควรดำเนินการทางเลือกที่ 3
            ได้แก่ การผายปากตามแบบที่เสนอ จัดช่องเลี้ยวซ้ายผ่านตลอดทิศทาง EB5 และปรับปรุงหัวสัญญาณไฟจราจรพร้อมจังหวะไฟ
          </p>
          <h4 className="font-semibold">10.1 สรุปผลการวิเคราะห์</h4>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              ปริมาณจราจรช่วงเร่งด่วนเช้า 07:00–09:00 น. ในทิศทาง EB5 รวม {n(am)} คัน (เฉลี่ย {n(am / 2)} คัน/ชม.)
              และช่วงเร่งด่วนเย็น 16:00–18:00 น. รวม {n(pm)} คัน (เฉลี่ย {n(pm / 2)} คัน/ชม.)
              ช่วงพีคของทิศทางนี้อยู่ในช่วงเวลา 12:00–13:00 น. ที่ {n(demand)} คัน/ชม.
            </li>
            <li>
              ปริมาณจราจรที่ใช้ทิศทาง EB5 รวม 12 ชั่วโมง จำนวน {n(survey.eb5_12h)} คัน ({n(survey.eb5_12h_pcu, 0)} PCU)
              คิดเป็น {((survey.eb5_12h / survey.ix_12h) * 100).toFixed(1)}% ของรถทั้งแยก
              และประมาณ 19% ของรถขาเข้าบนถนนแจ้งวัฒนะ
            </li>
            <li>
              การผายปากและปรับเลี้ยวซ้ายผ่านตลอดสามารถดึงรถเลี้ยวซ้ายออกจากสัญญาณไฟ 15–20% ของขา EB
              ซึ่งเป็นขาที่ความยาวแถวคอยยาวที่สุด (สูงสุด 200 ม.) ความจุซ้ายผ่านตลอดแบบให้ทางประมาณ {n(freeCap, 0)} PCU/ชม.
              ต่อความต้องการ {n(demand)} คัน/ชม. ค่า v/c ประมาณ {freeX.toFixed(2)} LOS {losUnsig(freeD)}
              ลดการหน่วงจากประมาณ {n(dGeom, 0)} วินาที เหลือ {n(freeD, 0)} วินาทีต่อคัน
            </li>
          </ol>
          <h4 className="font-semibold">10.2 ลำดับงาน</h4>
          <ol className="list-decimal space-y-1 pl-5">
            <li>การรถไฟฟ้าขนส่งมวลชนแห่งประเทศไทยยืนยันเขต Protection Zone A ก่อนก่อสร้าง</li>
            <li>สำนักการโยธาตรวจสอบรัศมีวงเลี้ยวและช่องเร่งความเร็วทิศเหนือ</li>
            <li>สำนักการจราจรและขนส่งลงโปรแกรมตู้ตามบทที่ 9 (หัวลูกศรที่ B/D ตารางขัดแย้ง intergreen และ OFFSET)</li>
            <li>เปิดช่องเลี้ยวซ้ายผ่านตลอดพร้อมป้ายให้ทาง หลังงานโยธาและหัวสัญญาณเสร็จ</li>
            <li>สำรวจหลังเปิดใช้ 15 นาที × 1 วันทำการ เพื่อเทียบความยาวแถวคอยขา EB กับฐาน 200 เมตร</li>
          </ol>
          <h4 className="font-semibold">10.3 รายการตรวจก่อนติดตั้งสัญญาณไฟจราจร</h4>
          <ol className="space-y-2">
            {CHECKLIST.map((c, i) => (
              <li key={c} className="flex gap-3 text-sm">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold">
                  {i + 1}
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="ch11" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 11 ข้อจำกัดและความไม่แน่นอน</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>สำรวจวันพุธวันเดียว ไม่ครอบคลุมเสาร์–อาทิตย์และวันฝน</li>
            <li>ไม่มีแฟ้มอุบัติเหตุ จึงไม่ทำ CMFs หรือ before-after ด้านความปลอดภัยเชิงสถิติ</li>
            <li>ความจุกรณี A ใช้ g/C ประสิทธิผล 0.18 จากเรขา ไม่มีวัด saturation flow ที่สนาม</li>
            <li>ปริมาณขัดแย้งของซ้ายผ่านตลอดใช้ขา NB รวม ไม่แยกช่องรับจริงบนกำแพงเพชร 6</li>
            <li>ไม่จำลองจุลภาคผลต่อตู้ 360 — OFFSET ที่เสนอต้องวัด travel time จริง</li>
            <li>ระยะเคลียร์ intergreen ประมาณจากความกว้างแยกทั่วไป ต้องวัด W จริงก่อนลงตู้</li>
          </ul>
        </section>

        <section id="ch12" className="doc-break space-y-3">
          <h3 className="text-xl font-semibold">บทที่ 12 เอกสารอ้างอิง</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>TRB. Highway Capacity Manual, 7th Edition. Washington, D.C.</li>
            <li>ITE. Transportation Impact Analyses for Site Development. Recommended Practice.</li>
            <li>FHWA. Traffic Signal Timing Manual. Chapters 4–6.</li>
            <li>FHWA. Manual on Uniform Traffic Control Devices, 11th Edition. Part 4.</li>
            <li>UK DfT. Traffic Signs Manual Chapter 6 — Traffic Control.</li>
            <li>UNECE. Vienna Convention on Road Signs and Signals, R.E.2.</li>
            <li>Webster, F.V. Traffic Signal Settings. Road Research Technical Paper No. 39.</li>
            <li>Harders, J. Die Leistungsfähigkeit nicht signalgeregelter städtischer Verkehrsknoten.</li>
            <li>สำนักการจราจรและขนส่ง. ไฟล์สำรวจ หลักสี่(500) 69_05_20, 20 พฤษภาคม 2569.</li>
            <li>บริษัท ศรีทองเจริญ จำกัด. แผ่นติดตั้งเครื่องควบคุมสัญญาณไฟจราจร ตู้ 500.</li>
            <li>รูปแบบบริเวณที่จะทำการผายปาก แยกหลักสี่ (แบบขอใช้พื้นที่).</li>
          </ol>
        </section>

        <section className="doc-break space-y-2 border-t border-border pt-6">
          <p className="text-sm font-semibold">ผู้วิเคราะห์ข้อมูลและจัดทำรายงาน</p>
          <p>นางสาวประภาวดี วชิรพุทธิ์</p>
          <p className="text-sm text-muted">นักวิชาการสถิติชำนาญการ</p>
          <p className="text-sm text-muted">กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน</p>
          <p className="text-sm text-muted">สำนักการจราจรและขนส่ง กรุงเทพมหานคร</p>
        </section>

        <footer className="border-t border-border pt-4 text-xs text-muted">
          <p>
            {SITE.alias} · พิกัด {SITE.lat.toFixed(6)}, {SITE.lng.toFixed(6)} · สำรวจ {SITE.surveyDate} ·
            รายงานการวิเคราะห์ปริมาณการจราจรตามหลัก ITE/HCM · © Prapawadee_W.
          </p>
        </footer>
      </article>
    </Shell>
  );
}

function Stat({ k, v, s }: { k: string; v: string; s?: string }) {
  return (
    <div className="rounded-[12px] bg-surface-2 p-4">
      <p className="text-xs text-muted">{k}</p>
      <p className="mt-1 font-semibold">{v}</p>
      {s ? <p className="mt-1 text-xs text-muted">{s}</p> : null}
    </div>
  );
}
