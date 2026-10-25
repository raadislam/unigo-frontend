import Image from "next/image";
import "../../styles/components/unigo-logo.css";

type UniGoLogoProps = {
  className?: string;
  width?: number;
  priority?: boolean;
  variant?: "default" | "footer";
};

export default function UniGoLogo({
  className = "",
  width = 160,
  priority = false,
  variant = "default",
}: UniGoLogoProps) {
  const isFooter = variant === "footer";

  return (
    <span
      className={`unigo-logo ${isFooter ? "unigo-logo--footer" : ""} ${className}`.trim()}
    >
      <Image
        src={
          isFooter ? "/images/unigo-footer-logo.png" : "/images/unigo-logo.png"
        }
        alt="UniGo"
        width={isFooter ? 367 : 418}
        height={isFooter ? 110 : 125}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="unigo-logo__image"
        style={{ width: `${width}px` }}
      />
    </span>
  );
}
