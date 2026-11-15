"use client";

import { useState } from "react";

const FLAG_FALLBACK_SOURCES: Record<string, string> = {
  ac: "https://game.lipis.dev/flags/4x3/ac.svg",
  ta: "https://game.lipis.dev/flags/4x3/ta.svg",
};

type CountryFlagProps = {
  iso2?: string | null;
  name: string;
  className: string;
};

export function CountryFlag({ iso2, name, className }: CountryFlagProps) {
  const code = (iso2 ?? "").trim().toLowerCase();
  const [failedCode, setFailedCode] = useState<string | null>(null);
  const isValid = /^[a-z]{2}$/.test(code);
  const flagSource = FLAG_FALLBACK_SOURCES[code] ?? `https://flagcdn.com/${code}.svg`;

  if (!isValid || failedCode === code) {
    return (
      <span
        className={`${className} relative flex items-center justify-center overflow-hidden bg-slate-100`}
        role="img"
        aria-label={`${name} flag unavailable`}
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full border border-slate-400/70"
        />
      </span>
    );
  }

  return (
    <span className={`${className} relative overflow-hidden`}>
      <img
        src={flagSource}
        alt={`${name} flag`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-contain"
        onError={() => setFailedCode(code)}
      />
    </span>
  );
}
