import raw from "./survey.json";

export type Mix = { c: number; vn: number; b: number; mb: number; tk: number; tr: number };

export type HourlyRow = {
  h: string;
  tot: number;
  totP: number;
  ap: { NB: number; EB: number; SB: number; WB: number };
  m: Record<string, { v: number; p: number; p15: number; phf: number | null }>;
  eb5: Mix & { v: number; p: number; p15: number; phf: number | null };
};

export type Q15 = {
  t: string;
  tot: number;
  eb5p: number;
  NB1: number;
  NB2: number;
  NB3: number;
  EB5: number;
  EB6: number;
  EB7: number;
  EB8: number;
  SB9: number;
  SB10: number;
  SB11: number;
  WB13: number;
  WB14: number;
};

export type QueueHour = {
  h: string;
  s: number[];
  n: number;
  mean: number | null;
  max: number | null;
  min: number | null;
};

export type Survey = {
  site: {
    nameTh: string;
    signalId: string;
    code: string;
    lat: number;
    lng: number;
    nb: string;
    eb: string;
    sb: string;
    wb: string;
    date: string;
    dateIso: string;
    dow: string;
    weather: string;
    type: string;
  };
  memo: {
    no: string;
    date: string;
    from: string;
    to: string;
    recvSjs: string;
    recvDate: string;
    stat: string;
  };
  pcu: Mix;
  target: string;
  hourly: HourlyRow[];
  q15: Q15[];
  queue: { NB: QueueHour[]; EB: QueueHour[]; SB: QueueHour[]; WB: QueueHour[] };
  mixEb5: Mix;
  eb5_12h: number;
  eb5_12h_pcu: number;
  ix_12h: number;
};

export const survey = raw as Survey;

export const MOVEMENT_LABEL: Record<string, string> = {
  NB1: "NB เลี้ยวซ้าย",
  NB2: "NB ตรง",
  NB3: "NB ตรง/ขวา",
  EB5: "EB เลี้ยวซ้าย",
  EB6: "EB ตรง (หลัก)",
  EB7: "EB ตรง",
  EB8: "EB เลี้ยวขวา",
  SB9: "SB เลี้ยวซ้าย",
  SB10: "SB ตรง",
  SB11: "SB ตรง/ขวา",
  WB13: "WB เลี้ยวซ้าย",
  WB14: "WB ตรง",
};

export const APPROACH_LABEL = {
  NB: "กำแพงเพชร 6 ทิศเหนือ",
  EB: "แจ้งวัฒนะ ขาเข้า (EB)",
  SB: "กำแพงเพชร 6 ทิศใต้",
  WB: "แจ้งวัฒนะ ขาออก (WB)",
} as const;
