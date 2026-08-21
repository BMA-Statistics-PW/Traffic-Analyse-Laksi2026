import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, TriangleAlert } from "lucide-react";
import { Shell } from "@/components/shell";
import { Kpi } from "@/components/kpi";
import { Badge } from "@/components/ui/badge";
import { IntersectionSchematic } from "@/components/intersection-schematic";
import { ClientOnly } from "@/components/client-only";
import { HourlyVolumeChart } from "@/components/charts";
import { DownloadBanner, DownloadReport } from "@/components/download-report";
import { survey } from "@/data/survey";
import { n } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const peakHour = survey.hourly.reduce((a, b) => (a.eb5.v > b.eb5.v ? a : b));
  const ixPeak = survey.hourly.reduce((a, b) => (a.tot > b.tot ? a : b));
  const peak15 = survey.q15.reduce((a, b) => (a.EB5 > b.EB5 ? a : b));
  const ebQ = survey.queue.EB.reduce((a, b) => ((a.max ?? 0) > (b.max ?? 0) ? a : b));
  const ebShare = (survey.eb5_12h / survey.ix_12h) * 100;
  const am = survey.hourly[0].eb5.v + survey.hourly[1].eb5.v;
  const pm = survey.hourly[9].eb5.v + survey.hourly[10].eb5.v;

  return (
    <Shell>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        สำนักการจราจรและขนส่ง · ตอบบันทึก {survey.memo.no}
      </p>
      <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        ผายปากเลี้ยวซ้ายแยกหลักสี่
        <span className="mt-2 block text-xl font-normal text-muted sm:text-2xl">
          แจ้งวัฒนะขาเข้า เข้ากำแพงเพชร 6 ทิศเหนือ
        </span>
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        ปริมาณรถเลี้ยวซ้ายทิศทางที่เขตหลักสี่ขอคำนวณ คือ{" "}
        <strong className="text-fg">{n(survey.eb5_12h)} คัน ใน 12 ชั่วโมง</strong>{" "}
        สำรวจวันพุธที่ {survey.site.date} สัญญาณไฟ {survey.site.signalId} คิวขาเข้าแจ้งวัฒนะยาวถึง{" "}
        {ebQ.max} เมตร — เพียงพอและสมควรทำช่องซ้ายผ่านตลอด
      </p>

      <div className="mt-6">
        <DownloadBanner />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="เลี้ยวซ้าย 12 ชม."
          value={n(survey.eb5_12h)}
          hint={`${n(survey.eb5_12h_pcu, 0)} PCU · ${ebShare.toFixed(1)}% ของทั้งแยก`}
          tone="target"
        />
        <Kpi
          label="ชั่วโมงพีค (เที่ยง)"
          value={`${n(peakHour.eb5.v)} คัน`}
          hint={`${peakHour.h.replaceAll(".", ":")} น. · PHF ${peakHour.eb5.phf}`}
        />
        <Kpi
          label="พีค 15 นาที"
          value={`${n(peak15.EB5)} คัน`}
          hint={`${peak15.t.replaceAll(".", ":")} → ${n(peak15.EB5 * 4)} คัน/ชม.`}
        />
        <Kpi
          label="คิวขาเข้า EB สูงสุด"
          value={`${ebQ.max} ม.`}
          hint={ebQ.h}
          tone="bad"
        />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-[18px] bg-warn-bg px-4 py-3 text-sm text-warn">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
        <p>
          รายงานวิเคราะห์ฉบับก่อนใช้ทิศ <strong>NB เลี้ยวซ้าย</strong> (กำแพงเพชร 6 → แจ้งวัฒนะ)
          และมีค่า PCU ช่วง 09:00–10:00 สูงผิดปกติ 18,211 ซึ่งไม่ตรงกับข้อมูลดิบ
          รายงานนี้ใช้ทิศทางตามบันทึกข้อความ: <strong>แจ้งวัฒนะขาเข้า เลี้ยวซ้ายเข้ากำแพงเพชร 6</strong>{" "}
          (EB5) ค่าจริงช่วงเดียวกันคือ {n(survey.hourly[2].eb5.v)} คัน/ชม.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <IntersectionSchematic />
        </div>
        <aside className="space-y-4 lg:col-span-2">
          <section className="rounded-[18px] bg-surface p-5 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">บันทึกต้นเรื่อง</p>
            <h2 className="mt-1 text-lg font-semibold">เขตหลักสี่ขอคำนวณปริมาณรถ</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">เลขที่</dt>
                <dd className="font-medium">{survey.memo.no}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">ลงวันที่</dt>
                <dd>{survey.memo.date}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">จาก</dt>
                <dd className="text-right">ผอ.เขตหลักสี่</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">ถึง</dt>
                <dd className="text-right">ผอ.สจส.</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">รับเรื่อง สจส.</dt>
                <dd>
                  {survey.memo.recvSjs} · {survey.memo.recvDate}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              แผนงาน: ผายปากแจ้งวัฒนะขาเข้า เพิ่มช่องเลี้ยวซ้ายผ่านตลอดเข้ากำแพงเพชร 6
              ร่วมกับสำนักการโยธา กรมทางหลวง และ รฟม. (สายสีชมพู)
            </p>
            <DownloadReport label="ดาวน์โหลดรายงาน Word (.docx)" className="mt-4 w-full" />
            <Link
              to="/geometry"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              ดูแบบผายปาก <ArrowRight className="size-3.5" />
            </Link>
            <Link
              to="/document"
              className="mt-2 flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              รายงานวิเคราะห์ทางแยก (ITE/HCM) <ArrowRight className="size-3.5" />
            </Link>
          </section>
          <section className="rounded-[18px] bg-surface p-5 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">บทสรุปวิศวกรรม</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed">
              <li>เร่งด่วนเช้า 07–09 น. {n(am)} คัน · เย็น 16–18 น. {n(pm)} คัน — ใช้ทั้งวัน ไม่ใช่แค่พีคเช้า</li>
              <li>
                พีคของทิศนี้คือช่วงเที่ยง ({n(peakHour.eb5.v)} คัน/ชม.) ขณะที่ทั้งแยกพีคเวลา{" "}
                {ixPeak.h.replaceAll(".", ":")} น. ({n(ixPeak.tot)} คัน)
              </li>
              <li>รถเกือบทั้งหมดเป็นรถยนต์/ปิคอัพ (99.5%) — รัศมีที่กว้างขึ้นยังจำเป็นสำหรับรถเมล์/บรรทุก 14 คัน/วัน</li>
              <li>ช่องซ้ายผ่านตลอดความจุเกินความต้องการชัด · ดึงรถออกจากสัญญาณไฟขาเข้า EB ประมาณ 15–20%</li>
            </ul>
            <Badge tone="ok" className="mt-3">
              แนะนำให้ดำเนินการ
            </Badge>
          </section>
        </aside>
      </div>

      <section className="mt-10 rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">ปริมาณเลี้ยวซ้ายรายชั่วโมง</h2>
            <p className="text-sm text-muted">แท่ง = EB5 · เส้น = ทั้งแยก</p>
          </div>
          <Link to="/analysis" className="text-sm font-medium text-accent hover:underline">
            เปิดตารางเต็ม
          </Link>
        </div>
        <ClientOnly>
          <HourlyVolumeChart />
        </ClientOnly>
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link
          to="/analysis"
          className="rounded-[18px] bg-surface p-5 shadow-card transition-shadow hover:shadow-[0_0_0_1px_rgba(28,25,21,0.1)]"
        >
          <p className="text-sm font-semibold">ปริมาณและแถวคอย</p>
          <p className="mt-1 text-sm text-muted">ราย 15 นาที, PCU, คิวรายขา</p>
        </Link>
        <Link
          to="/geometry"
          className="rounded-[18px] bg-surface p-5 shadow-card transition-shadow hover:shadow-[0_0_0_1px_rgba(28,25,21,0.1)]"
        >
          <p className="text-sm font-semibold">แบบผายปาก</p>
          <p className="mt-1 text-sm text-muted">รัศมี เขตทางสายสีชมพู เกาะสามเหลี่ยม</p>
        </Link>
        <Link
          to="/report"
          className="rounded-[18px] bg-primary p-5 text-primary-fg"
        >
          <p className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="size-4" /> ข้อเสนอตอบบันทึก
          </p>
          <p className="mt-1 text-sm opacity-80">ความจุ ผลประโยชน์ ข้อจำกัด</p>
        </Link>
      </div>
    </Shell>
  );
}
