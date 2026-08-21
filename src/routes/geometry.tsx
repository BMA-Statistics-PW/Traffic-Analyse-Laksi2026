import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { IntersectionSchematic } from "@/components/intersection-schematic";

export const Route = createFileRoute("/geometry")({ component: Geometry });

const DIMS = [
  { k: "153.00", v: "พื้นที่ผายปาก (ขยายเขตทาง) ตารางเมตร" },
  { k: "26.15 ม.", v: "ความยาวแนวปาดตามถนนแจ้งวัฒนะ" },
  { k: "11.25 ม.", v: "ระยะปาดด้านเข้ามุม (แนวทแยงแรก)" },
  { k: "5.14 ม.", v: "ทางเท้าคงเหลือช่วงกลางมุม" },
  { k: "9.77 ม.", v: "แนวโค้งปากทางด้านออก" },
  { k: "8.77 ม.", v: "ช่วงเชื่อมเข้าเกาะ/ช่องเร่ง" },
  { k: "5.49 ม.", v: "ความกว้างช่วงคอขวดมุม" },
  { k: "3.29 ม.", v: "ช่วงเข้าเกาะสามเหลี่ยม" },
  { k: "3.00 ม.", v: "ระยะร่น Protection Zone A สายสีชมพู — ห้ามล้ำ" },
];

function Geometry() {
  return (
    <Shell>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        แบบขอใช้พื้นที่ขยายเขตทาง · แยกหลักสี่ (แยกไอทีสแควร์)
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">รูปแบบบริเวณที่จะทำการผายปาก</h1>
      <p className="mt-2 max-w-2xl text-muted">
        การดำเนินงานโครงการคือการปาดมุมทางเท้ามุมตะวันตกเฉียงใต้ของแยก
        ให้รถจากถนนแจ้งวัฒนะขาเข้าเลี้ยวซ้ายเข้าถนนกำแพงเพชร 6 ทิศเหนือได้ด้วยรัศมีที่กว้างขึ้น
        และแยกช่องเลี้ยวซ้ายผ่านตลอดออกจากช่องทางตรง
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <figure className="rounded-[18px] bg-surface p-3 shadow-card sm:p-4 lg:col-span-3">
          <img
            src="/docs/site-plan.png"
            alt="รูปแบบบริเวณที่จะทำการผายปาก แยกหลักสี่ — พื้นที่ขยายเขตทาง 153 ตร.ม."
            className="h-auto w-full rounded-[12px] bg-white outline outline-1 -outline-offset-1 outline-black/10"
          />
          <figcaption className="mt-3 px-1 text-xs text-muted">
            รูปแบบบริเวณที่จะทำการผายปาก — พื้นที่ขยายเขตทางประมาณ 153.00 ตร.ม. ระยะร่น Protection Zone A
            สายสีชมพู 3.00 ม. แนวสะพานข้ามแยกหลักสี่อยู่ระดับดินด้านถนนแจ้งวัฒนะ b = ตู้ควบคุมสัญญาณไฟเดิม
          </figcaption>
        </figure>
        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-[18px] bg-surface p-5 shadow-card">
            <h2 className="text-base font-semibold">ขนาดจากแบบ</h2>
            <ul className="mt-3 space-y-2.5">
              {DIMS.map((d) => (
                <li key={d.k} className="flex gap-3 text-sm">
                  <span className="w-16 shrink-0 font-mono text-[13px] font-medium tabular-nums">
                    {d.k}
                  </span>
                  <span className="text-muted">{d.v}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-[18px] bg-bad-bg p-5">
            <Badge tone="bad">ข้อจำกัดหลัก</Badge>
            <p className="mt-2 text-sm leading-relaxed text-fg">
              แนว Protection Zone A ของรถไฟฟ้าสายสีชมพูขนานถนนแจ้งวัฒนะ แบบกำหนดระยะร่น 3.00 ม.
              การปาดมุมต้องอยู่ในเขตทางที่ขอใช้พื้นที่เท่านั้น ห้ามล้ำโครงสร้าง รฟม.
            </p>
          </section>
        </div>
      </div>

      <IntersectionSchematic className="mt-6" />

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[18px] bg-surface p-5 shadow-card">
          <h2 className="text-base font-semibold">ก่อนปรับปรุง</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
            <li>มุมเลี้ยวแคบทำให้รถเลี้ยวซ้ายต้องชะลอต่ำกว่า 15 กม./ชม. กินเวลาไฟเขียวและอาจเกิดการแทรกตัว</li>
            <li>ไม่มีช่องรถเลี้ยวซ้ายแยกจากทางตรง เสี่ยง spillback ขวางถนนแจ้งวัฒนะ</li>
            <li>ความยาวแถวคอยขาเข้า EB เฉลี่ย 114–146 ม. ช่วงเช้า–เย็น สูงสุดที่สำรวจ 200 ม.</li>
          </ul>
        </div>
        <div className="rounded-[18px] bg-ok-bg p-5">
          <h2 className="text-base font-semibold">หลังผายปาก (ตามแบบ)</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>รัศมีวงเลี้ยวเพิ่มขึ้นตามแนวโค้ง 9.77–26.15 ม. รองรับรถได้ที่ใช้ความเร็วช่วงเลี้ยวสูงขึ้น</li>
            <li>การบังคับทิศทางสามารถแยกรถซ้ายผ่านตลอดจากช่องทางตรง</li>
            <li>ทางเท้าคงเหลือ 5.14 ม. ในช่วงมุม ต้องปรับทางคนเดินและจุดข้ามใหม่</li>
            <li>แนวสะพานข้ามแยกหลักสี่ไม่ถูกรบกวน</li>
          </ul>
        </div>
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
    </Shell>
  );
}
