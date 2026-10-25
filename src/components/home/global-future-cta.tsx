import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import "../../styles/home/global-future-cta.css";

export default function GlobalFutureCTA() {
  return (
    <section className="global-future-cta">
      <div className="global-future-cta__inner">
        <div className="global-future-cta__visual" aria-hidden="true">
          <div className="global-future-cta__visual-ring global-future-cta__visual-ring--outer" />
          <div className="global-future-cta__visual-ring global-future-cta__visual-ring--inner" />
          <div className="global-future-cta__visual-icon">
            <Send size={34} strokeWidth={1.6} />
          </div>
          <span className="global-future-cta__visual-dot" />
        </div>

        <div className="global-future-cta__content">
          <span className="global-future-cta__eyebrow">
            YOUR FUTURE STARTS HERE
          </span>

          <h2>
            Ready to Build Your
            <span> Global Future?</span>
          </h2>

          <p>
            Get expert advice, personalized guidance, and take the first step
            toward your study abroad dream.
          </p>
        </div>

        <div className="global-future-cta__action">
          <Link href="/contact" className="global-future-cta__button">
            Book a Free Consultation
            <ArrowRight size={18} />
          </Link>
          <span className="global-future-cta__note">
            Let’s plan your next chapter.
          </span>
        </div>
      </div>
    </section>
  );
}
