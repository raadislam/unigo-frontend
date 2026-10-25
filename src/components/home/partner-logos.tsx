import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "../../styles/home/partner-logos.css";

const partners = [
  {
    name: "CCGP Learning Academy",
    logo: "/images/partners/ccgpla-01.png",
    className: "partner-ribbon__logo--ccgp",
  },
  {
    name: "Gozayan",
    logo: "/images/partners/gozayan.png",
    className: "partner-ribbon__logo--gozayan",
  },
  {
    name: "Heritage School",
    logo: "/images/partners/Heritage School.png",
    className: "partner-ribbon__logo--heritage",
  },
  {
    name: "HITTCENTER",
    logo: "/images/partners/hittcenter.png",
    className: "partner-ribbon__logo--hittcenter",
  },
];

export default function PartnerLogos() {
  return (
    <section className="partner-ribbon" aria-labelledby="partner-ribbon-title">
      <div className="partner-ribbon__inner">
        <div className="partner-ribbon__heading">
          <div className="partner-ribbon__copy">
            <span className="partner-ribbon__eyebrow">
              <span className="partner-ribbon__eyebrow-line" />
              OUR NETWORK
            </span>

            <h2 id="partner-ribbon-title">
              Better together.
              <span>Further, globally.</span>
            </h2>

            <p>
              Meaningful partnerships. Shared ambitions. More possibilities for
              students pursuing an international future.
            </p>

            <Link href="/about" className="partner-ribbon__link">
              <span>Discover UniGo</span>
              <span className="partner-ribbon__link-icon">
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </span>
            </Link>
          </div>

          <div className="partner-ribbon__editorial">
            <div className="partner-ribbon__editorial-top">
              <span>BUILT ON PARTNERSHIPS</span>
              <span className="partner-ribbon__editorial-index">01 — 04</span>
            </div>

            <div className="partner-ribbon__editorial-main">
              <span className="partner-ribbon__editorial-number">01</span>

              <div className="partner-ribbon__editorial-message">
                <span className="partner-ribbon__editorial-kicker">
                  A SHARED VISION
                </span>
                <h3>
                  Different strengths.
                  <span>One bigger future.</span>
                </h3>
              </div>
            </div>

            <div className="partner-ribbon__editorial-bottom">
              <span className="partner-ribbon__editorial-rule" />
              <p>
                Connecting education, people and opportunity through trusted
                relationships.
              </p>
            </div>
          </div>
        </div>

        <div className="partner-ribbon__partners-heading">
          <span>IN GOOD COMPANY</span>
          <span>OUR PARTNERS</span>
        </div>

        <div
          className="partner-ribbon__panel"
          aria-label="UniGo partner organizations"
        >
          {partners.map((partner) => (
            <div
              className={`partner-ribbon__logo ${partner.className}`}
              key={partner.name}
              aria-label={partner.name}
            >
              <div className="partner-ribbon__image">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={260}
                  height={120}
                  sizes="(max-width: 520px) 40vw, (max-width: 800px) 22vw, 240px"
                  className="partner-ribbon__img"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="partner-ribbon__footer">
          <span className="partner-ribbon__footer-dot" />
          <p>Working together towards a world of opportunity.</p>
        </div>
      </div>
    </section>
  );
}
