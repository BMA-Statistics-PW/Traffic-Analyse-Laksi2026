import { FileDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const REPORT_HREF = "/docs/laksi-500-intersection-oa.docx";
export const REPORT_FILENAME =
  "รายงานวิเคราะห์สภาพการจราจรทางแยก_แยกหลักสี่_สัญญาณไฟ500.docx";

type Props = {
  label?: string;
  variant?: "primary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function DownloadReport({
  label = "ดาวน์โหลด Word",
  variant = "primary",
  size = "md",
  className,
}: Props) {
  return (
    <a
      href={REPORT_HREF}
      download={REPORT_FILENAME}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      <FileDown className="size-4 shrink-0" />
      {label}
    </a>
  );
}

export function DownloadBanner() {
  return (
    <div className="no-print flex flex-col gap-3 rounded-[18px] bg-primary p-4 text-primary-fg shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider opacity-70">ไฟล์ Word · A4</p>
        <p className="mt-1 text-base font-semibold leading-snug">
          รายงานการวิเคราะห์ปริมาณการจราจรทางแยกหลักสี่ (แยกไอทีสแควร์)
        </p>
        <p className="mt-1 text-sm opacity-80">
          ตามรูปแบบวิศวกรรมจราจร · จากข้อมูลดิบ หลักสี่(500) 69_05_20.xlsx
        </p>
      </div>
      <DownloadReport
        label="ดาวน์โหลดไฟล์ Word"
        size="lg"
        className="shrink-0 bg-surface text-fg hover:bg-surface-2"
      />
    </div>
  );
}
