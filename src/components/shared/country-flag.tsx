import Image from "next/image";

type CountryFlagProps = {
  iso2: string;
  name: string;
  className: string;
};

export function CountryFlag({ iso2, name, className }: CountryFlagProps) {
  const code = iso2.trim().toLowerCase();

  if (!/^[a-z]{2}$/.test(code)) {
    return <span className={className} role="img" aria-label={`${name} flag unavailable`}>🌍</span>;
  }

  return (
    <span className={`${className} relative overflow-hidden`} role="img" aria-label={`${name} flag`}>
      <Image
        src={`https://flagcdn.com/w160/${code}.png`}
        alt=""
        fill
        sizes="80px"
        className="object-cover"
        unoptimized
      />
    </span>
  );
}
