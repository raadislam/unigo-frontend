"use client";

import Link from "next/link";
import {
  UserRound,
  Handshake,
  ShieldCheck,
  UsersRound,
  Award,
  ClipboardList,
  Plane,
} from "lucide-react";
import "../../styles/home/why-choose-us.css";

const benefits = [
  {
    title: "Expert Guidance",
    description: "From university selection to visa application support.",
    Icon: UserRound,
  },
  {
    title: "Trusted Partnerships",
    description: "Connecting students with trusted institutions worldwide.",
    Icon: Handshake,
  },
  {
    title: "Visa Application Support",
    description: "Professional guidance throughout your application.",
    Icon: ShieldCheck,
  },
  {
    title: "Personalized Approach",
    description: "Every student's goals and journey are unique.",
    Icon: UsersRound,
  },
  {
    title: "Comprehensive Support",
    description: "Guidance from planning to pre-departure preparation.",
    Icon: Award,
  },
  {
    title: "Affordable & Transparent",
    description: "Clear service information with no hidden surprises.",
    Icon: ClipboardList,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us" id="why-choose-us">
      <div className="why-choose-us__inner">
        <div className="why-choose-us__intro">
          <div className="why-choose-us__eyebrow">
            <span />
            <p>WHY CHOOSE UNIGO</p>
          </div>

          <h2>
            Your Trusted
            <br />
            <span>Study Abroad</span> Partner
          </h2>

          <p className="why-choose-us__description">
            We go beyond consultancy — we become your study abroad partner,
            offering personalized guidance, trusted support, and opportunities
            to help you plan your next chapter.
          </p>

          <Link href="/about" className="why-choose-us__button">
            Learn More
            <span aria-hidden="true">→</span>
          </Link>

          <div className="why-choose-us__travel-decoration" aria-hidden="true">
            <div className="why-choose-us__route" />
            <Plane size={30} strokeWidth={1.8} />
          </div>
        </div>

        <div className="why-choose-us__grid">
          {benefits.map(({ title, description, Icon }) => (
            <article className="why-choose-us__card" key={title}>
              <div className="why-choose-us__icon">
                <Icon size={30} strokeWidth={1.9} />
              </div>

              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
