/** HCM / DLH helpers for the Lak Si free-left analysis. */

export type Los = "A" | "B" | "C" | "D" | "E" | "F";

export function losSignal(delaySec: number): Los {
  if (delaySec <= 10) return "A";
  if (delaySec <= 20) return "B";
  if (delaySec <= 35) return "C";
  if (delaySec <= 55) return "D";
  if (delaySec <= 80) return "E";
  return "F";
}

export function losUnsig(delaySec: number): Los {
  if (delaySec <= 10) return "A";
  if (delaySec <= 15) return "B";
  if (delaySec <= 25) return "C";
  if (delaySec <= 35) return "D";
  if (delaySec <= 50) return "E";
  return "F";
}

/** Saturation flow for a signalized left-turn lane (pcu/h). Thai practice ~0.95 × 1800. */
export const SAT_LEFT = 1710;

/** Webster uniform delay (s/veh), plus HCM overflow term. */
export function signalDelay(opts: {
  cycle: number;
  gOverC: number;
  volume: number;
  saturation?: number;
}): number {
  const s = opts.saturation ?? SAT_LEFT;
  const cap = Math.max(1, s * opts.gOverC);
  const x = opts.volume / cap;
  const xu = Math.min(1, Math.max(0, x));
  const C = opts.cycle;
  const lambda = opts.gOverC;
  const d1 = (0.5 * C * (1 - lambda) ** 2) / (1 - xu * lambda);
  const T = 0.25;
  const d2 =
    900 *
    T *
    (x - 1 + Math.sqrt((x - 1) ** 2 + (8 * 0.5 * x) / (cap * T)));
  return Math.max(0, d1 + d2);
}

/** Harders / HCM potential capacity of a yield/merge movement (pcu/h). */
export function yieldCapacity(conflicting: number, tc = 6.5, tf = 3.3): number {
  const vc = Math.max(1, conflicting);
  const a = Math.exp((-vc * tc) / 3600);
  const b = 1 - Math.exp((-vc * tf) / 3600);
  return (vc * a) / Math.max(1e-6, b);
}

/** HCM TWSC control delay (s/veh). T in hours (default 0.25 = peak 15 min). */
export function twscDelay(volume: number, capacity: number, T = 0.25): number {
  const c = Math.max(1, capacity);
  const x = volume / c;
  const d1 = 3600 / c;
  const d2 =
    900 *
    T *
    (x - 1 + Math.sqrt((x - 1) ** 2 + (3600 / c) * x / (450 * T)));
  return Math.max(0, d1 + d2);
}

export function vcRatio(volume: number, capacity: number): number {
  return volume / Math.max(1, capacity);
}

export function losFromVc(x: number): Los {
  if (x <= 0.6) return "A";
  if (x <= 0.7) return "B";
  if (x <= 0.8) return "C";
  if (x <= 0.9) return "D";
  if (x <= 1.0) return "E";
  return "F";
}
