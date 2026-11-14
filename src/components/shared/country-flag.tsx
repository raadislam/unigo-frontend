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
      <img
        src={`https://flagcdn.com/${code}.svg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
}
