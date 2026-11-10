import Link from "next/link";

import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

import "./site-footer.css";
import UniGoLogo from "../common/unigo-logo";

function SocialIcon({ name }: { name: string }) {
  if (name === "facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V3.5c-.8-.1-1.6-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.4V13h2.8v8h3.3Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5.2 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.5 9h3.4v11.5H3.5V9Zm5.5 0h3.3v1.6h.1A3.7 3.7 0 0 1 15.8 8c3.5 0 4.2 2.3 4.2 5.2v7.3h-3.4V14c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5v6.6H9V9Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.6 7a2.5 2.5 0 0 0-1.8-1.8C18.2 4.8 12 4.8 12 4.8s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7 26 26 0 0 0 2 12a26 26 0 0 0 .4 5 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8 26 26 0 0 0 .4-5 26 26 0 0 0-.4-5ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Study Abroad", href: "/study-abroad" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const destinations = [
  { label: "Canada", href: "/destinations/canada" },
  { label: "United Kingdom", href: "/destinations/uk" },
  { label: "Australia", href: "/destinations/australia" },
  { label: "USA", href: "/destinations/usa" },
  { label: "Germany", href: "/destinations/germany" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/19zTW4CQLV/",
    icon: "facebook",
  },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  // { label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/" aria-label="UniGo home" className="shrink-0">
            <UniGoLogo variant="footer" width={145} />
          </Link>

          <p className="site-footer__description">
            Helping students achieve their dreams through quality education and
            global opportunities.
          </p>

          <div className="site-footer__socials">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                href={href}
                key={label}
                className="site-footer__social-link"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name={icon} />
              </a>
            ))}
          </div>
        </div>

        <nav className="site-footer__column" aria-label="Quick links">
          <h2>Quick Links</h2>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-footer__column" aria-label="Top destinations">
          <h2>Top Destinations</h2>
          <ul>
            {destinations.map((destination) => (
              <li key={destination.label}>
                <Link href={destination.href}>{destination.label}</Link>
              </li>
            ))}
          </ul>

          <Link href="/destinations" className="site-footer__text-link">
            More Countries
            <ArrowRight size={17} />
          </Link>
        </nav>

        <div className="site-footer__column site-footer__contact">
          <h2>Contact Us</h2>

          <a href="tel:+8801901644300" className="site-footer__contact-item">
            <Phone size={18} />
            <span>+880 1901 644300</span>
          </a>
          <a
            href="tel:+8801901644301"
            style={{ marginLeft: 30 }}
            className="site-footer__contact-item"
          >
            <span>+880 1901 644301</span>
          </a>

          <a
            href="mailto:contact@unigo-bd.com"
            className="site-footer__contact-item"
          >
            <Mail size={18} />
            <span>contact@unigo-bd.com</span>
          </a>

          <div className="site-footer__contact-item">
            <MapPin size={19} />
            <span>Dhaka, Bangladesh</span>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Dhaka%2C+Bangladesh"
            className="site-footer__text-link site-footer__directions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Directions
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="site-footer__newsletter">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest updates, tips and offers.</p>

          <form className="site-footer__form" action="/newsletter" method="get">
            <label
              className="site-footer__visually-hidden"
              htmlFor="footer-newsletter-email"
            >
              Your email address
            </label>

            <input
              id="footer-newsletter-email"
              type="email"
              name="email"
              placeholder="Your email address"
              autoComplete="email"
              required
            />

            <button type="submit" aria-label="Subscribe to newsletter">
              <ArrowRight size={21} />
            </button>
          </form>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} UniGo. All rights reserved.</p>

        <div className="site-footer__legal-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
