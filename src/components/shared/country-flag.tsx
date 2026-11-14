type CountryFlagProps = {
  iso2: string;
  name: string;
  className: string;
};

export function CountryFlag({ iso2, name, className }: CountryFlagProps) {
  const code = iso2.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) {
    return (
      <span className={`${className} text-3xl`} role="img" aria-label={`${name} flag unavailable`}>
        🌍
      </span>
    );
  }

  const flag = Array.from(code)
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join("");

  return (
    <span className={`${className} text-4xl leading-none`} role="img" aria-label={`${name} flag`}>
      {flag}
    </span>
  );
}
