import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  CreditCard,
  Scale,
  Accessibility,
  ChevronRight,
  ArrowUpRight,
  LockKeyhole,
} from "lucide-react";
import "../../styles/legal/legal-page.css";

type LegalSection = {
  heading: string;
  paragraphs?: string[];
  subsections?: {
    title: string;
    content: string;
  }[];
};

type LegalPageProps = {
  activeSlug: string;
  title: string;
  description: string;
  updatedAt?: string;
  sections: LegalSection[];
};

const policyGroups = [
  {
    title: "Policy Updates",
    icon: FileText,
    items: [
      {
        label: "Policy Updates",
        href: "/legal/policy-updates",
        slug: "policy-updates",
      },
    ],
  },
  {
    title: "User Agreements",
    icon: FileText,
    items: [
      {
        label: "Terms of Service",
        href: "/legal/terms-of-service",
        slug: "terms-of-service",
      },
      {
        label: "User Content Agreement",
        href: "/legal/user-content-agreement",
        slug: "user-content-agreement",
      },
    ],
  },
  {
    title: "Privacy & Data Protection",
    icon: ShieldCheck,
    items: [
      {
        label: "Privacy Policy",
        href: "/legal/privacy-policy",
        slug: "privacy-policy",
      },
      {
        label: "Cookies Policy",
        href: "/legal/cookies-policy",
        slug: "cookies-policy",
      },
      {
        label: "Data Protection Policy",
        href: "/legal/data-protection",
        slug: "data-protection",
      },
    ],
  },
  {
    title: "Financial Policies",
    icon: CreditCard,
    items: [
      {
        label: "Refund Policy",
        href: "/legal/refund-policy",
        slug: "refund-policy",
      },
    ],
  },
  {
    title: "Intellectual Property",
    icon: FileText,
    items: [
      {
        label: "Intellectual Property Rights",
        href: "/legal/intellectual-property",
        slug: "intellectual-property",
      },
    ],
  },
  {
    title: "Dispute Management",
    icon: Scale,
    items: [
      {
        label: "Dispute Resolution",
        href: "/legal/dispute-resolution",
        slug: "dispute-resolution",
      },
    ],
  },
  {
    title: "Accessibility",
    icon: Accessibility,
    items: [
      {
        label: "Accessibility Statement",
        href: "/legal/accessibility",
        slug: "accessibility",
      },
      {
        label: "Third-Party Links",
        href: "/legal/third-party-links",
        slug: "third-party-links",
      },
    ],
  },
];

export function LegalPage({
  activeSlug,
  title,
  description,
  updatedAt = "October 2026",
  sections,
}: LegalPageProps) {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="legal-container">
          <div className="legal-hero__content">
            <div className="legal-eyebrow">
              <span className="legal-eyebrow__line" />
              <span>UNIGO LEGAL CENTRE</span>
            </div>

            <h1>
              Your trust matters.
              <span> Our policies are transparent.</span>
            </h1>

            <p>
              Clear information about your rights, privacy, and the way we work.
              Everything you need to know about using UniGo services.
            </p>

            <div className="legal-hero__meta">
              <span>
                <LockKeyhole size={15} />
                Your information matters
              </span>
              <span className="legal-meta-dot" />
              <span>Transparent policies</span>
            </div>
          </div>

          <div className="legal-hero__decoration" aria-hidden="true">
            <div className="legal-decoration-circle legal-decoration-circle--one" />
            <div className="legal-decoration-circle legal-decoration-circle--two" />
            <div className="legal-decoration-card">
              <div className="legal-decoration-card__icon">
                <ShieldCheck size={31} />
              </div>
              <span>UNIGO</span>
              <strong>Trust starts with transparency.</strong>
              <div className="legal-decoration-card__line" />
              <div className="legal-decoration-card__bottom">
                <span>YOUR RIGHTS</span>
                <span>OUR RESPONSIBILITY</span>
              </div>
            </div>
            <span className="legal-decoration-number">01 / LEGAL</span>
          </div>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="legal-container legal-layout">
          <aside className="legal-sidebar">
            <div className="legal-sidebar__heading">
              <div>
                <span className="legal-sidebar__eyebrow">EXPLORE</span>
                <h2>Legal Centre</h2>
              </div>
              <ShieldCheck size={23} />
            </div>

            <p className="legal-sidebar__description">
              Browse our policies and understand how we protect your interests.
            </p>

            <nav className="legal-navigation" aria-label="Legal policies">
              {policyGroups.map((group) => {
                const GroupIcon = group.icon;

                return (
                  <div className="legal-navigation__group" key={group.title}>
                    <div className="legal-navigation__group-title">
                      <GroupIcon size={16} />
                      <span>{group.title}</span>
                    </div>

                    <div className="legal-navigation__items">
                      {group.items.map((item) => {
                        const isActive = activeSlug === item.slug;

                        return (
                          <Link
                            key={item.slug}
                            href={item.href}
                            className={`legal-navigation__item ${
                              isActive ? "is-active" : ""
                            }`}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <FileText size={17} />
                            <span>{item.label}</span>
                            {isActive && <ChevronRight size={16} />}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="legal-sidebar__help">
              <div className="legal-sidebar__help-icon">
                <LockKeyhole size={19} />
              </div>
              <strong>Need clarification?</strong>
              <p>Our team is here to help with questions about our policies.</p>
              <Link href="/contact">
                Contact UniGo
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </aside>

          <article className="legal-document">
            <div className="legal-breadcrumb">
              <Link href="/">Home</Link>
              <ChevronRight size={14} />
              <span>Legal Centre</span>
              <ChevronRight size={14} />
              <strong>{title}</strong>
            </div>

            <header className="legal-document__header">
              <div className="legal-document__label">
                <span />
                PRIVACY & TRANSPARENCY
              </div>

              <h2>{title}</h2>

              <p className="legal-document__intro">{description}</p>

              <div className="legal-document__updated">
                <span>Last updated</span>
                <strong>{updatedAt}</strong>
              </div>
            </header>

            <div className="legal-document__divider" />

            <div className="legal-document__body">
              {sections.map((section, index) => (
                <section
                  className="legal-document__section"
                  key={`${section.heading}-${index}`}
                >
                  <div className="legal-document__section-heading">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{section.heading}</h3>
                  </div>

                  {section.paragraphs?.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}

                  {section.subsections?.map((subsection, subsectionIndex) => (
                    <div
                      className="legal-document__subsection"
                      key={subsectionIndex}
                    >
                      <h4>{subsection.title}</h4>
                      <p>{subsection.content}</p>
                    </div>
                  ))}
                </section>
              ))}
            </div>

            <div className="legal-document__footer">
              <div className="legal-document__footer-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <strong>We believe in transparency.</strong>
                <p>
                  If you have any questions about this policy, please get in
                  touch with our team.
                </p>
              </div>
              <Link href="/contact" aria-label="Contact UniGo">
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
