"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { gsap } from "gsap";
import "./destination-showcase.css";

const experiences = [
  {
    id: "arrival",
    title: "Arrival Plaza",
    category: "DISCOVER",
    image: "/images/destinations/arrival-plaza.jpg",
    heading:
      "Your ship will dock on the quay right alongside the main plaza, so you can come and go at your leisure.",
    description:
      "In the plaza, you’ll find the destination’s welcome center, where our team can provide helpful information and help you discover excursions and activities that interest you.",
    secondary:
      "Walking paths and easy-to-follow signs guide you around the destination. Convenient transport options are available when you want to explore further.",
  },
  {
    id: "spa",
    title: "Aurea Spa",
    category: "RELAX",
    image: "/images/destinations/aurea-spa.jpg",
    heading:
      "Take time to unwind with a restorative experience designed around your comfort.",
    description:
      "Discover a peaceful space to relax, recharge, and enjoy a little time for yourself during your journey.",
    secondary:
      "Explore wellness experiences and make the most of a relaxing break before continuing your adventures.",
  },
  {
    id: "snorkel",
    title: "Snorkel Safari",
    category: "DISCOVER",
    image: "/images/destinations/snorkel-safari.jpg",
    heading:
      "Explore vibrant underwater scenery and discover a different side of your destination.",
    description:
      "Experience colorful marine life and discover the beauty beneath the water with an unforgettable snorkeling adventure.",
    secondary:
      "Prepare for an exciting day outdoors, surrounded by clear water and remarkable natural scenery.",
  },
  {
    id: "dining",
    title: "Springors Bar",
    category: "TASTE",
    image: "/images/destinations/springors-bar.jpg",
    heading:
      "Discover memorable dining experiences and enjoy the flavors of your destination.",
    description:
      "Take a break and enjoy fresh flavors in a welcoming setting designed for relaxed moments and good company.",
    secondary:
      "From a quick refreshment to a leisurely meal, find an experience that suits your plans for the day.",
  },
  {
    id: "lagoon",
    title: "Great Lagoon",
    category: "EXPLORE",
    image: "/images/destinations/great-lagoon.jpg",
    heading:
      "Discover beautiful lagoon views and make space for an unforgettable escape.",
    description:
      "Enjoy the scenery, explore the surroundings, and experience the quieter side of your destination.",
    secondary:
      "Plan a relaxed visit or make the lagoon part of a full day of discovery and outdoor activities.",
  },
];

export function DestinationShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const active = experiences[activeIndex];

  function selectExperience(index: number) {
    const nextIndex = (index + experiences.length) % experiences.length;

    if (nextIndex === activeIndex) return;

    const element = contentRef.current;

    if (!element) {
      setActiveIndex(nextIndex);
      return;
    }

    gsap.to(element, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        setActiveIndex(nextIndex);
      },
    });
  }

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
    );
  }, [activeIndex]);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % experiences.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="destination-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Explore destinations"
    >
      <div className="destination-showcase-layout">
        <div className="destination-showcase-visual">
          <Image
            key={active.image}
            src={active.image}
            alt={active.title}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 53vw"
            className="destination-showcase-main-image"
          />

          <div className="destination-showcase-overlay" />

          <button
            type="button"
            className="destination-showcase-previous"
            onClick={() => selectExperience(activeIndex - 1)}
            aria-label="Previous experience"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="destination-showcase-image-caption">
            <span>DESTINATION EXPERIENCE</span>
            <h2>{active.title}</h2>
          </div>
        </div>

        <div className="destination-showcase-information" ref={contentRef}>
          <div className="destination-showcase-intro">
            <span className="destination-showcase-accent" />
            <h3>{active.heading}</h3>
          </div>

          <div className="destination-showcase-copy">
            <p>{active.description}</p>
            <p>{active.secondary}</p>
          </div>

          <div className="destination-showcase-experience-heading">
            <span>EXPERIENCES</span>
            <div />
          </div>

          <div className="destination-showcase-cards">
            {experiences
              .filter((experience) => experience.id !== active.id)
              .map((experience, index) => (
                <button
                  type="button"
                  key={experience.id}
                  className="destination-showcase-card"
                  onClick={() =>
                    selectExperience(
                      experiences.findIndex(
                        (item) => item.id === experience.id,
                      ),
                    )
                  }
                  aria-label={`Show ${experience.title}`}
                >
                  <span className="destination-showcase-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="destination-showcase-card-image">
                    <Image
                      src={experience.image}
                      alt={experience.title}
                      fill
                      sizes="(max-width: 760px) 45vw, 18vw"
                    />
                    <span className="destination-showcase-card-category">
                      {experience.category}
                    </span>
                    <span className="destination-showcase-card-title">
                      {experience.title}
                    </span>
                    <span className="destination-showcase-card-open">
                      <Plus size={15} />
                    </span>
                  </span>
                </button>
              ))}
          </div>

          <div className="destination-showcase-footer">
            <div className="destination-showcase-progress">
              <span
                style={{
                  width: `${((activeIndex + 1) / experiences.length) * 100}%`,
                }}
              />
            </div>

            <div className="destination-showcase-pagination">
              <button
                type="button"
                onClick={() => selectExperience(activeIndex - 1)}
                aria-label="Previous experience"
              >
                Prev
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => selectExperience(activeIndex + 1)}
                aria-label="Next experience"
              >
                Next
              </button>
              <button
                type="button"
                className="destination-showcase-next"
                onClick={() => selectExperience(activeIndex + 1)}
                aria-label="Next destination"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
