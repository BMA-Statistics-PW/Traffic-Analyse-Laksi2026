import { cn } from "@/lib/utils";

export function IntersectionSchematic({ className }: { className?: string }) {
  return (
    <figure className={cn("rounded-[18px] bg-surface p-4 shadow-card sm:p-6", className)}>
      <figcaption className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">แผนผังทิศทาง — แยกหลักสี่</p>
          <p className="text-xs text-muted">ไฮไลต์คือทิศทางตามบันทึกข้อความ เขตหลักสี่</p>
        </div>
        <p className="text-[11px] text-muted">ขับรถชิดซ้าย · ซ้ายผ่านตลอด = เลี้ยวใกล้</p>
      </figcaption>
      <svg viewBox="0 0 640 480" className="h-auto w-full" role="img" aria-label="แผนผังสี่แยกหลักสี่">
        <rect width="640" height="480" fill="#f3efe6" />

        {/* Pink Line protection, south of Chaeng Watthana */}
        <rect x="0" y="300" width="640" height="8" fill="#8a9aa8" />

        {/* Carriageways */}
        <rect x="0" y="196" width="640" height="88" fill="#2a3340" />
        <rect x="276" y="0" width="88" height="480" fill="#2a3340" />

        <g stroke="#d9d1c2" strokeWidth="1.2" strokeDasharray="8 10" opacity="0.65">
          <line x1="8" y1="225" x2="268" y2="225" />
          <line x1="8" y1="255" x2="268" y2="255" />
          <line x1="372" y1="225" x2="632" y2="225" />
          <line x1="372" y1="255" x2="632" y2="255" />
          <line x1="305" y1="8" x2="305" y2="188" />
          <line x1="335" y1="8" x2="335" y2="188" />
          <line x1="305" y1="292" x2="305" y2="472" />
          <line x1="335" y1="292" x2="335" y2="472" />
        </g>
        <line x1="0" y1="240" x2="276" y2="240" stroke="#c9b27a" strokeWidth="1.3" />
        <line x1="364" y1="240" x2="640" y2="240" stroke="#c9b27a" strokeWidth="1.3" />
        <line x1="320" y1="0" x2="320" y2="196" stroke="#c9b27a" strokeWidth="1.3" />
        <line x1="320" y1="284" x2="320" y2="480" stroke="#c9b27a" strokeWidth="1.3" />

        {/* Flare at SW corner */}
        <path
          d="M150 196 C 210 196 250 196 276 196 L 276 142 C 232 160 192 180 150 196 Z"
          fill="#3d5c76"
        />
        <ellipse cx="236" cy="184" rx="16" ry="9" fill="#ece7db" stroke="#c4bba8" />

        {/* EB left path */}
        <path
          d="M40 258 L 200 258 C 232 258 248 246 254 220 L 254 160"
          fill="none"
          stroke="#f7f4ee"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <polygon points="254,146 246,164 262,164" fill="#f7f4ee" />

        {/* Road names outside the asphalt */}
        <text x="320" y="22" textAnchor="middle" fill="#f7f4ee" fontSize="13" fontFamily="Sarabun, sans-serif">
          กำแพงเพชร 6 · เหนือ
        </text>
        <text x="320" y="470" textAnchor="middle" fill="#f7f4ee" fontSize="13" fontFamily="Sarabun, sans-serif">
          กำแพงเพชร 6 · ใต้
        </text>
        <text x="24" y="186" fill="#1c1915" fontSize="13" fontFamily="Sarabun, sans-serif">
          แจ้งวัฒนะ ขาเข้า
        </text>
        <text x="616" y="186" textAnchor="end" fill="#1c1915" fontSize="13" fontFamily="Sarabun, sans-serif">
          แจ้งวัฒนะ ขาออก
        </text>

        <text x="24" y="318" fill="#3d5c76" fontSize="10" fontFamily="Sarabun, sans-serif">
          สายสีชมพู Protection Zone A · ร่น 3.00 ม.
        </text>

        {/* Callout */}
        <rect x="24" y="56" width="200" height="52" rx="8" fill="#fbfaf6" stroke="#d9d1c2" />
        <text x="36" y="78" fill="#1f3348" fontSize="12" fontFamily="Sarabun, sans-serif" fontWeight="600">
          EB5 เลี้ยวซ้ายเข้าทิศเหนือ
        </text>
        <text x="36" y="96" fill="#3d5c76" fontSize="11" fontFamily="Sarabun, sans-serif">
          ผายปาก + ซ้ายผ่านตลอด
        </text>

        <g transform="translate(600 52)">
          <circle r="16" fill="#fbfaf6" stroke="#d9d1c2" />
          <polygon points="0,-10 3.5,4 -3.5,4" fill="#1f3348" />
          <text y="28" textAnchor="middle" fontSize="9" fill="#6b6459" fontFamily="Sarabun, sans-serif">
            N
          </text>
        </g>
      </svg>
      <div className="mt-4 grid gap-2 text-xs text-muted sm:grid-cols-3">
        <p>
          <span className="mr-1 inline-block size-2 rounded-sm bg-target align-middle" />
          พื้นที่ผายมุมตามแบบเขตหลักสี่
        </p>
        <p>
          <span className="mr-1 inline-block size-2 rounded-sm bg-border-strong align-middle" />
          เขตทางสายสีชมพู — ห้ามล้ำ 3.00 ม.
        </p>
        <p>
          <span className="mr-1 inline-block h-1 w-4 rounded-sm bg-primary align-middle" />
          ทิศทางที่ขอคำนวณในบันทึกข้อความ
        </p>
      </div>
    </figure>
  );
}
