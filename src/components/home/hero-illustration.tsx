"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./hero-illustration.css";

const destinations = [
  {
    code: "ca",
    name: "Canada",
    flag: "https://flagcdn.com/w80/ca.png",
    className: "destination-canada",
  },
  {
    code: "gb",
    name: "United Kingdom",
    flag: "https://flagcdn.com/w80/gb.png",
    className: "destination-uk",
  },
  {
    code: "us",
    name: "United States",
    flag: "https://flagcdn.com/w80/us.png",
    className: "destination-us",
  },
  {
    code: "au",
    name: "Australia",
    flag: "https://flagcdn.com/w80/au.png",
    className: "destination-australia",
  },
  {
    code: "bd",
    name: "Bangladesh",
    flag: "https://flagcdn.com/w80/bd.png",
    className: "destination-bangladesh",
  },
];

export function HeroIllustration() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".student-card", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.14,
        ease: "power3.out",
      });

      gsap.from(".destination-label", {
        opacity: 0,
        y: 10,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.35,
        ease: "power2.out",
      });

      gsap.to(".student-card-featured", {
        y: -5,
        duration: 3.2,
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
            src="/images/student-uk.png"
            alt="Student exploring an international study destination"
            fill
            priority
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
            src="/images/student-australia.png"
            alt="Student preparing for international education"
            fill
            priority
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
            src="/images/student-canada.png"
            alt="Student celebrating an education journey"
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
        <div className="student-card-kicker">YOUR FUTURE, WORLDWIDE</div>
        <div className="student-card-image">
          <Image
            src="/images/student-destinations.png"
            alt="Students pursuing international education"
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
          <img
            src={destination.flag}
            alt={`${destination.name} flag`}
            width={25}
            height={17}
            className="destination-flag"
          />
          <span>{destination.name}</span>
        </div>
      ))}

      <div className="illustration-caption">
        <span className="caption-dot" />
        Your next chapter starts here
      </div>
    </div>
  );
}
