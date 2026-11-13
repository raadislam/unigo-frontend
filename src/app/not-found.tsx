import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F7FAFE] px-5">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D7192D]">
          Error 404
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#082B4C] sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          The page you&apos;re looking for may have moved or may no longer exist.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#082B4C] px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </main>
  );
}
