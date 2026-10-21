import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ConsultationButtonProps = {
  href?: string;
  label?: string;
  className?: string;
};

export function ConsultationButton({
  href = "/contact/",
  label = "Free Consultation",
  className = "",
}: ConsultationButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D7192D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B51225] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7192D] focus-visible:ring-offset-2 ${className}`}
    >
      {label}
      <ArrowUpRight size={17} />
    </Link>
  );
}
