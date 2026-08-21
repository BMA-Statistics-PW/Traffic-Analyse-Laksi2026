import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { IntersectionSchematic } from "@/components/intersection-schematic";

export const Route = createFileRoute("/geometry")({ component: Geometry });

const DIMS = [
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
        แบบขอใช้พื้นที่ขยายเขตทาง · แยกหลักสี่
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">ผายปากและรัศมีวงเลี้ยว</h1>
      <p className="mt-2 max-w-2xl text-muted">
        โครงการคือการปาดมุมทางเท้ามุมตะวันตกเฉียงใต้ของแยก ให้รถจากแจ้งวัฒนะขาเข้าเลี้ยวซ้ายเข้ากำแพงเพชร 6
        ทิศเหนือได้ด้วยรัศมีที่กว้างขึ้น และแยกช่องซ้ายผ่านตลอดออกจากช่องตรง
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <figure className="rounded-[18px] bg-surface p-3 shadow-card sm:p-4 lg:col-span-3">
          <img
            src="/docs/site-plan.jpg"
            alt="แบบรายละเอียดการขอใช้พื้นที่ผายปากบริเวณแยกหลักสี่"
            className="h-auto w-full rounded-[12px] outline outline-1 -outline-offset-1 outline-black/10"
          />
          <figcaption className="mt-3 px-1 text-xs text-muted">
            เอกสารประกอบบันทึกเขตหลักสี่ — รูปแบบบริเวณที่จะทำการผายปาก แนวรอกไฟฟ้าสายสีชมพูและแนวสะพานข้ามแยกหลักสี่อยู่ในแบบ
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
            <li>มุมแคบ รถเลี้ยวซ้ายต้องชะลอต่ำกว่า 15 กม./ชม. กินเวลาเขียวและดันคิวช่องใน</li>
            <li>ไม่มีช่องเก็บรถเลี้ยวซ้ายแยกจากทางตรง — เสี่ยง spillback ขวางแจ้งวัฒนะ</li>
            <li>คิวขาเข้า EB เฉลี่ย 114–146 ม. ช่วงเช้า–เย็น สูงสุดที่สำรวจ 200 ม.</li>
          </ul>
        </div>
        <div className="rounded-[18px] bg-ok-bg p-5">
          <h2 className="text-base font-semibold">หลังผายปาก (ตามแบบ)</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>รัศมีวงเลี้ยวเพิ่มขึ้นตามแนวโค้ง 9.77–26.15 ม. รองรับรถยนต์นั่งได้ที่ความเร็วเลี้ยวสูงขึ้น</li>
            <li>เกาะสามเหลี่ยมบังคับทิศ แยกซ้ายผ่านตลอดจากช่องตรง</li>
            <li>ทางเท้าคงเหลือ 5.14 ม. ช่วงมุม — ต้องตรวจทางคนเดินและจุดข้ามใหม่</li>
            <li>แนวสะพานข้ามแยกหลักสี่ไม่ถูกรบกวน (งานระดับดิน)</li>
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-[18px] bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold">ข้อกำหนดออกแบบเพิ่มจากวิศวกรรมจราจร</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
          <li>
            <strong>ช่องเร่งความเร็วบนกำแพงเพชร 6 ทิศเหนือ</strong> อย่างน้อย 40–60 ม. หากเขตทางพอ
            เพื่อไม่ให้รถที่ออกจากซ้ายผ่านตลอดไปแย่งช่องกับรถตรงที่เพิ่งออกจากไฟ
          </li>
          <li>
            <strong>ความยาวช่องเข้า</strong> แนวปาด 26 ม. เพียงพอสำหรับคิว yield สั้น (2–4 คัน)
            เพราะความจุหลังเปิดอิสระสูงกว่าความต้องการ 342 คัน/ชม.
          </li>
          <li>
            <strong>เครื่องหมายและป้าย</strong> ลูกศรซ้ายผ่านตลอด, ป้ายให้ทางหากเป็น yield, ห้ามจอดตลอดปากทาง
          </li>
          <li>
            <strong>คนเดินเท้า</strong> ย้ายทางม้าลายพ้นปากโค้ง หรือใช้เกาะหลบภัย — ซ้ายผ่านตลอดเพิ่มความเสี่ยงตัดคนข้าม
          </li>
          <li>
            <strong>รถเมล์/บรรทุก</strong> มี 14 คัน/12 ชม. ในทิศนี้ ตรวจ swept path จากแบบ 1:500 ก่อนก่อสร้าง
          </li>
        </ol>
      </section>
    </Shell>
  );
}
