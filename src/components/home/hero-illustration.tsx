"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CountryFlag } from "@/components/shared/country-flag";
import { GraduationCap, ArrowUpRight } from "lucide-react";
import "../../styles/home/hero-illustration.css";

const destinations = [
  {
    code: "ca",
    name: "Canada",
    className: "destination-canada",
  },
  {
    code: "gb",
    name: "United Kingdom",
    className: "destination-uk",
  },
  {
    code: "us",
    name: "United States",
    className: "destination-us",
  },
  {
    code: "au",
    name: "Australia",
    className: "destination-australia",
  },
  {
    code: "bd",
    name: "Bangladesh",
    className: "destination-bangladesh",
  },
];

export default function HeroIllustration() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".student-card", {
        opacity: 0,
        y: 20,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "opacity",
      });

      gsap.from(".destination-label", {
        opacity: 0,
        y: 8,
        duration: 0.45,
        stagger: 0.07,
        delay: 0.25,
        ease: "power2.out",
        clearProps: "opacity",
      });

      gsap.to(".student-card-featured", {
        y: -5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: root },
  );

  return (
    <div className="hero-illustration" ref={root}>
      <div className="illustration-grid" aria-hidden="true" />
      <div className="illustration-glow" aria-hidden="true" />

      <svg
        className="illustration-routes"
        viewBox="0 0 680 600"
        fill="none"
        aria-hidden="true"
      >
        <path d="M70 245 C140 120 240 140 295 220 S420 310 570 190" />
        <path d="M80 425 C185 485 270 430 340 390 S475 390 590 455" />
      </svg>

      <div className="student-card student-card-left">
        <div className="student-card-kicker">01 / EXPLORE</div>
        <div className="student-card-image">
          <Image
            src="/images/student-uk.webp"
            alt="Student exploring international education opportunities"
            fill
            sizes="(max-width: 800px) 42vw, 240px"
          />
        </div>
        <div className="student-card-footer">
          <span>Global opportunities</span>
          <span className="student-card-number">01</span>
        </div>
      </div>

      <div className="student-card student-card-top">
        <div className="student-card-kicker">02 / DISCOVER</div>
        <div className="student-card-image">
          <Image
            src="/images/student-australia.webp"
            alt="Student preparing for an international education journey"
            fill
            sizes="(max-width: 800px) 42vw, 240px"
          />
        </div>
        <div className="student-card-footer">
          <span>New perspectives</span>
          <span className="student-card-number">02</span>
        </div>
      </div>

      <div className="student-card student-card-right">
        <div className="student-card-kicker">03 / ACHIEVE</div>
        <div className="student-card-image">
          <Image
            src="/images/student-canada.webp"
            alt="Students celebrating their education journey"
            fill
            sizes="(max-width: 800px) 42vw, 240px"
          />
        </div>
        <div className="student-card-footer">
          <span>Your next chapter</span>
          <span className="student-card-number">03</span>
        </div>
      </div>

      <div className="student-card student-card-featured">
        <div className="student-card-kicker">
          <GraduationCap size={14} />
          <span>YOUR FUTURE, WORLDWIDE</span>
        </div>
        <div className="student-card-image">
          <Image
            src="/images/student-destinations.webp"
            alt="Student celebrating an international education achievement"
            fill
            priority
            sizes="(max-width: 800px) 58vw, 320px"
          />
        </div>
        <div className="student-card-footer">
          <span>Make your move</span>
          <span className="featured-mark">UNIGO</span>
        </div>
      </div>

      {destinations.map((destination) => (
        <div
          key={destination.code}
          className={`destination-label ${destination.className}`}
        >
          <CountryFlag iso2={destination.code} name={destination.name} className="destination-flag" />
          <span>{destination.name}</span>
          <ArrowUpRight
            className="destination-arrow"
            size={12}
            aria-hidden="true"
          />
        </div>
      ))}

      <div className="illustration-caption">
        <span className="caption-dot" />
        Your next chapter starts here
      </div>
    </div>
  );
}
