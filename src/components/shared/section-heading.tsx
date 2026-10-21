type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#D7192D]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#082B4C] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
