import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { survey } from "@/data/survey";
import { hourLabel, n } from "@/lib/utils";

const tooltipStyle = {
  background: "#fbfaf6",
  border: "1px solid #d9d1c2",
  borderRadius: 10,
  fontSize: 12,
  color: "#1c1915",
};

export function HourlyVolumeChart() {
  const data = survey.hourly.map((h) => ({
    name: hourLabel(h.h),
    EBซ้าย: h.eb5.v,
    EBตรง: h.ap.EB - h.eb5.v,
    ทั้งแยก: h.tot,
  }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#ece7db" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b6459" }} interval={1} />
        <YAxis tick={{ fontSize: 11, fill: "#6b6459" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="EBซ้าย" fill="#3d5c76" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="ทั้งแยก" stroke="#1f3348" strokeWidth={1.6} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function Eb5FifteenChart() {
  const data = survey.q15.map((r) => ({
    name: hourLabel(r.t),
    คัน: r.EB5,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#ece7db" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b6459" }} interval={7} />
        <YAxis tick={{ fontSize: 11, fill: "#6b6459" }} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [`${n(Number(v))} คัน / 15 นาที`, "EB เลี้ยวซ้าย"]}
        />
        <Line type="monotone" dataKey="คัน" stroke="#3d5c76" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function QueueChart() {
  const data = survey.queue.EB.map((q, i) => ({
    name: hourLabel(q.h).replace("-", "–"),
    EB: q.mean,
    NB: survey.queue.NB[i]?.mean,
    SB: survey.queue.SB[i]?.mean,
    WB: survey.queue.WB[i]?.mean,
  }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#ece7db" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b6459" }} interval={1} />
        <YAxis tick={{ fontSize: 11, fill: "#6b6459" }} unit=" ม." />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="EB" stroke="#3d5c76" strokeWidth={2.2} />
        <Line type="monotone" dataKey="NB" stroke="#8a8276" strokeWidth={1.4} />
        <Line type="monotone" dataKey="SB" stroke="#9b2c2c" strokeWidth={1.4} />
        <Line type="monotone" dataKey="WB" stroke="#2f5d43" strokeWidth={1.4} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ApproachBarChart() {
  const data = survey.hourly.map((h) => ({
    name: hourLabel(h.h),
    NB: h.ap.NB,
    EB: h.ap.EB,
    SB: h.ap.SB,
    WB: h.ap.WB,
  }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#ece7db" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b6459" }} interval={1} />
        <YAxis tick={{ fontSize: 11, fill: "#6b6459" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="EB" stackId="a" fill="#3d5c76" />
        <Bar dataKey="WB" stackId="a" fill="#7a93a8" />
        <Bar dataKey="NB" stackId="a" fill="#8a8276" />
        <Bar dataKey="SB" stackId="a" fill="#c4bba8" radius={[4, 4, 0, 0]} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
