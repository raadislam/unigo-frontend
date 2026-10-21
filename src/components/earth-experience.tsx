"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const EarthScene = dynamic(() => import("@/components/earth-scene"), {
  ssr: false,
  loading: () => (
    <div className="earth-scene-loading">
      <div className="earth-scene-loading-sphere" />
      <span>Preparing your global journey...</span>
    </div>
  ),
});

export default function EarthExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".earth-experience-content", {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="earth-experience">
      <div className="earth-experience-content earth-experience-heading">
        <span className="earth-experience-kicker">
          <span />
          YOUR WORLD OF OPPORTUNITY
        </span>

        <h2>
          Explore the world.
          <br />
          <span>Discover your future.</span>
        </h2>

        <p>
          Choose your destination and discover where your international
          education can take you.
        </p>
      </div>

      <div className="earth-experience-content">
        <EarthScene />
      </div>
    </div>
  );
}
