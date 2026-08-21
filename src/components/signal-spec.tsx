import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CONFLICT,
  INTERGREEN,
  PHASES,
  STAGES,
  type PhaseId,
} from "@/data/signal-design";

const LAMPS = {
  R: "var(--color-lamp-red)",
  Y: "var(--color-lamp-amber)",
  G: "var(--color-lamp-green)",
  off: "var(--color-lamp-off)",
};

export function CircularHead({
  lit,
  size = 44,
  label,
  kind = "ball",
}: {
  lit: "R" | "Y" | "G" | "off";
  size?: number;
  label?: string;
  kind?: "ball" | "arrow-right";
}) {
  const r = size / 8;
  const gap = size / 3.15;
  const cx = size / 2;
  const colors: Record<"R" | "Y" | "G", string> = { R: LAMPS.R, Y: LAMPS.Y, G: LAMPS.G };
  return (
    <svg width={size} height={size * 1.55} viewBox={`0 0 ${size} ${size * 1.55}`} aria-hidden>
      <rect
        x="1"
        y="1"
        width={size - 2}
        height={size * 1.55 - 2}
        rx="6"
        fill="var(--color-primary)"
      />
      {(["R", "Y", "G"] as const).map((k, i) => {
        const cy = 8 + r + i * gap;
        const on = lit === k;
        return (
          <g key={k}>
            <circle
              cx={cx}
              cy={cy}
              r={r + 1.2}
              fill={on ? colors[k] : LAMPS.off}
              opacity={on ? 1 : 0.85}
            />
            {kind === "arrow-right" && (
              <polygon
                points={`${cx - r * 0.45},${cy - r * 0.35} ${cx + r * 0.55},${cy} ${cx - r * 0.45},${cy + r * 0.35}`}
                fill={on ? "var(--color-primary-fg)" : "#3a3d42"}
              />
            )}
            {kind === "ball" && on && (
              <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.22} fill="white" opacity="0.35" />
            )}
          </g>
        );
      })}
      {label && (
        <text
          x={cx}
          y={size * 1.55 - 4}
          textAnchor="middle"
          fill="var(--color-primary-fg)"
          fontSize="8"
          fontFamily="Sarabun, sans-serif"
        >
          {label}
        </text>
      )}
    </svg>
  );
}

function lampFor(phase: PhaseId, active: PhaseId[], isArrow: boolean): "R" | "Y" | "G" | "off" {
  if (active.includes(phase)) return "G";
  if (isArrow) return "R";
  return "R";
}

export function StagePlayer() {
  const [sid, setSid] = useState<(typeof STAGES)[number]["id"]>(1);
  const stage = STAGES.find((s) => s.id === sid)!;
  const active: PhaseId[] = [...stage.green, ...stage.permitted];

  return (
    <div className="rounded-[18px] bg-surface p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">จำลองหัวสัญญาณตามสเตจ — ทิศเหนือขึ้นบน</p>
          <p className="text-xs text-muted">วงกลม = ช่องตรง · ลูกศร = เลี้ยวขวา (ตัดคู่ตรงข้าม)</p>
        </div>
        <div className="flex flex-wrap gap-1 no-print">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSid(s.id)}
              className={cn(
                "rounded-[8px] px-3 py-2 text-sm",
                sid === s.id ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg",
              )}
            >
              สเตจ {s.id}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm">
        <span className="font-semibold">สเตจ {stage.id}</span> · {stage.name}
        <span className="text-muted"> — {stage.note}</span>
      </p>

      <div className="mt-4 overflow-x-auto">
        <TrueNorthMap active={active} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { p: "C" as PhaseId, title: "EB ตรง", kind: "ball" as const, arrow: false },
            { p: "B" as PhaseId, title: "EB ขวา", kind: "arrow-right" as const, arrow: true },
            { p: "G" as PhaseId, title: "WB ตรง", kind: "ball" as const, arrow: false },
            { p: "A" as PhaseId, title: "NB ตรง", kind: "ball" as const, arrow: false },
            { p: "E" as PhaseId, title: "SB ตรง", kind: "ball" as const, arrow: false },
            { p: "D" as PhaseId, title: "SB ขวา", kind: "arrow-right" as const, arrow: true },
          ] as const
        ).map((h) => (
          <div key={h.p} className="flex items-center gap-3 rounded-[12px] bg-surface-2 px-3 py-2">
            <CircularHead lit={lampFor(h.p, active, h.arrow)} kind={h.kind} size={36} />
            <div>
              <p className="text-xs font-semibold">
                {h.p} · {h.title}
              </p>
              <p className="text-xs text-muted">{h.arrow ? "ลูกศร GA" : "วงกลม FG"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrueNorthMap({ active }: { active: PhaseId[] }) {
  const on = (p: PhaseId) => active.includes(p);
  const g = (p: PhaseId) => (on(p) ? "var(--color-lamp-green)" : "#6b6459");
  return (
    <svg
      viewBox="0 0 720 560"
      className="h-auto w-full min-w-[560px]"
      role="img"
      aria-label="แผนผังสี่แยกทิศเหนือขึ้นบน พร้อมหัวสัญญาณ"
    >
      <rect width="720" height="560" fill="var(--color-bg)" />

      {/* Pink Line south of Chaeng Watthana */}
      <rect x="0" y="348" width="720" height="7" fill="#8a9aa8" />
      <text x="16" y="372" fill="var(--color-accent)" fontSize="11" fontFamily="Sarabun, sans-serif">
        สายสีชมพู · Protection Zone A ร่น 3.00 ม.
      </text>

      {/* E-W Chaeng Watthana */}
      <rect x="0" y="228" width="720" height="100" fill="#2a3340" />
      {/* N-S KP6 */}
      <rect x="310" y="0" width="100" height="560" fill="#2a3340" />

      <g stroke="#c9b27a" strokeWidth="1.2">
        <line x1="0" y1="278" x2="310" y2="278" />
        <line x1="410" y1="278" x2="720" y2="278" />
        <line x1="360" y1="0" x2="360" y2="228" />
        <line x1="360" y1="328" x2="360" y2="560" />
      </g>
      <g stroke="#d9d1c2" strokeWidth="1" strokeDasharray="7 9" opacity="0.55">
        <line x1="8" y1="253" x2="302" y2="253" />
        <line x1="8" y1="303" x2="302" y2="303" />
        <line x1="418" y1="253" x2="712" y2="253" />
        <line x1="418" y1="303" x2="712" y2="303" />
        <line x1="335" y1="8" x2="335" y2="220" />
        <line x1="385" y1="8" x2="385" y2="220" />
        <line x1="335" y1="336" x2="335" y2="552" />
        <line x1="385" y1="336" x2="385" y2="552" />
      </g>

      {/* IT Square SW */}
      <rect x="48" y="348" width="150" height="86" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" />
      <text x="123" y="388" textAnchor="middle" fill="var(--color-fg)" fontSize="12" fontFamily="Sarabun, sans-serif">
        ไอทีสแควร์
      </text>
      <text x="123" y="406" textAnchor="middle" fill="var(--color-muted)" fontSize="10" fontFamily="Sarabun, sans-serif">
        มุมตะวันตกเฉียงใต้
      </text>

      {/* Railway east */}
      <g stroke="#6b6459" strokeWidth="2">
        <line x1="560" y1="8" x2="560" y2="220" />
        <line x1="560" y1="336" x2="560" y2="552" />
      </g>
      <text
        x="572"
        y="48"
        fill="var(--color-muted)"
        fontSize="10"
        fontFamily="Sarabun, sans-serif"
      >
        ทางรถไฟสายเหนือ
      </text>
      <text
        x="700"
        y="200"
        textAnchor="end"
        fill="var(--color-fg)"
        fontSize="12"
        fontFamily="Sarabun, sans-serif"
      >
        ไปตู้ 360 · วิภาวดี ~80 ม.
      </text>

      {/* Road labels on asphalt */}
      <text x="360" y="22" textAnchor="middle" fill="#f7f4ee" fontSize="13" fontFamily="Sarabun, sans-serif">
        กำแพงเพชร 6 · ทิศเหนือ
      </text>
      <text x="360" y="548" textAnchor="middle" fill="#f7f4ee" fontSize="13" fontFamily="Sarabun, sans-serif">
        กำแพงเพชร 6 · ทิศใต้
      </text>
      <text x="16" y="220" fill="var(--color-fg)" fontSize="13" fontFamily="Sarabun, sans-serif">
        แจ้งวัฒนะ ขาเข้า →
      </text>
      <text x="704" y="220" textAnchor="end" fill="var(--color-fg)" fontSize="13" fontFamily="Sarabun, sans-serif">
        ← แจ้งวัฒนะ จากหลักสี่
      </text>

      {/* Movement arrows */}
      <g fill="none" strokeWidth="3.2" strokeLinecap="round">
        <path d="M40 258 L 300 258" stroke={g("C")} />
        <polygon points="300,258 286,252 286,264" fill={g("C")} />
        <path d="M40 308 C 200 308 250 320 250 400 L 250 470" stroke={g("B")} />
        <polygon points="250,478 244,464 256,464" fill={g("B")} />
        <path d="M680 298 L 420 298" stroke={g("G")} />
        <polygon points="420,298 434,292 434,304" fill={g("G")} />
        <path d="M335 520 L 335 340" stroke={g("A")} />
        <polygon points="335,340 329,354 341,354" fill={g("A")} />
        <path d="M320 520 C 300 430 240 310 140 298" stroke={g("F")} strokeDasharray="6 6" />
        <path d="M385 40 L 385 220" stroke={g("E")} />
        <polygon points="385,220 379,206 391,206" fill={g("E")} />
        <path d="M400 40 C 430 140 250 250 140 258" stroke={g("D")} />
      </g>

      {/* Signal faces near stop lines */}
      <SignalStack x={268} y={196} lit={on("C") ? "G" : "R"} kind="ball" tag="C" />
      <SignalStack x={228} y={196} lit={on("B") ? "G" : "R"} kind="arrow" tag="B" />
      <SignalStack x={418} y={318} lit={on("G") ? "G" : "R"} kind="ball" tag="G" />
      <SignalStack x={278} y={336} lit={on("A") ? "G" : "R"} kind="ball" tag="A" />
      <SignalStack x={412} y={148} lit={on("E") ? "G" : "R"} kind="ball" tag="E" />
      <SignalStack x={448} y={148} lit={on("D") ? "G" : "R"} kind="arrow" tag="D" />

      {/* Compass */}
      <g transform="translate(672 52)">
        <circle r="20" fill="var(--color-surface)" stroke="var(--color-border)" />
        <polygon points="0,-12 4,6 -4,6" fill="var(--color-primary)" />
        <text y="32" textAnchor="middle" fontSize="11" fill="var(--color-fg)" fontFamily="Sarabun, sans-serif">
          N
        </text>
      </g>
    </svg>
  );
}

function SignalStack({
  x,
  y,
  lit,
  kind,
  tag,
}: {
  x: number;
  y: number;
  lit: "R" | "G";
  kind: "ball" | "arrow";
  tag: string;
}) {
  const col = (k: "R" | "Y" | "G") =>
    lit === k ? (k === "R" ? LAMPS.R : k === "G" ? LAMPS.G : LAMPS.Y) : LAMPS.off;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="18" height="46" rx="3" fill="var(--color-primary)" />
      <circle cx="9" cy="9" r="5" fill={col("R")} />
      <circle cx="9" cy="22" r="5" fill={col("Y")} />
      <circle cx="9" cy="35" r="5" fill={col("G")} />
      {kind === "arrow" && (
        <polygon
          points="5,35 14,35 9,31"
          fill={lit === "G" ? "var(--color-primary-fg)" : "#3a3d42"}
        />
      )}
      <text x="9" y="56" textAnchor="middle" fontSize="10" fill="var(--color-fg)" fontFamily="Sarabun, sans-serif">
        {tag}
      </text>
    </g>
  );
}

export function ConflictMatrix() {
  const ids = PHASES.map((p) => p.id);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-center text-sm">
        <caption className="mb-2 text-left text-sm text-muted">
          Y = ขัดกัน ห้ามเขียวพร้อมกัน · N = ไปด้วยกันได้ · มุมทแยงเป็นเฟสเดียวกัน
        </caption>
        <thead>
          <tr>
            <th className="border border-border bg-surface-2 px-2 py-2 text-xs">เฟส</th>
            {ids.map((id) => (
              <th key={id} className="border border-border bg-surface-2 px-2 py-2 font-semibold">
                {id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ids.map((r) => (
            <tr key={r}>
              <th className="border border-border bg-surface-2 px-2 py-2 font-semibold">{r}</th>
              {ids.map((c) => {
                const v = CONFLICT[r][c];
                return (
                  <td
                    key={c}
                    className={cn(
                      "border border-border px-2 py-2 font-semibold tabular-nums",
                      v === "Y" && "bg-bad-bg text-bad",
                      v === "N" && "bg-ok-bg text-ok",
                      v === "—" && "bg-surface-2 text-muted",
                    )}
                  >
                    {v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IntergreenTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="bg-surface-2 text-left">
            <th className="border border-border px-3 py-2">จาก → ถึง</th>
            <th className="border border-border px-3 py-2">เหลือง</th>
            <th className="border border-border px-3 py-2">แดงทั้งหมด</th>
            <th className="border border-border px-3 py-2">รวม</th>
            <th className="border border-border px-3 py-2">เหตุผล</th>
          </tr>
        </thead>
        <tbody>
          {INTERGREEN.map((r) => (
            <tr key={`${r.from}-${r.to}`}>
              <td className="border border-border px-3 py-2 font-medium">
                สเตจ {r.from} → {r.to}
              </td>
              <td className="border border-border px-3 py-2 tabular-nums">{r.amber} วินาที</td>
              <td className="border border-border px-3 py-2 tabular-nums">{r.allRed} วินาที</td>
              <td className="border border-border px-3 py-2 tabular-nums font-semibold">{r.total}</td>
              <td className="border border-border px-3 py-2 text-muted">{r.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
