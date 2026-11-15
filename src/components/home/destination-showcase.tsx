"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { gsap } from "gsap";
import "../../styles/home/destination-showcase.css";

const experiences = [
  {
    id: "uk",
    title: "Discover the United Kingdom",
    category: "EXPLORE",
    image: "/images/destinations/united-kingdom.webp",
    heading:
      "Discover iconic landmarks, vibrant cities, and exciting opportunities across the United Kingdom.",
    description:
      "Explore London's iconic landmarks, Edinburgh's historic streets, British culture, and unforgettable destinations. Discover opportunities to visit family and friends or explore UK universities.",
    secondary:
      "UniGo can guide you through visit or study visa options, application preparation, and required documents. Start planning your UK journey with our team.",
  },
  {
    id: "italy",
    title: "Discover the Beauty of Italy",
    category: "EXPLORE",
    image: "/images/destinations/italy.webp",
    heading:
      "Experience Italy’s timeless beauty, rich culture, iconic landmarks, and exciting opportunities.",
    description:
      "From the historic streets of Rome and the canals of Venice to the stunning coastlines of Amalfi, Italy offers unforgettable travel experiences, world-famous cuisine, and remarkable cultural heritage.",
    secondary:
      "UniGo can guide you through suitable visit or study visa options, application preparation, and required documentation. Start planning your Italian journey with personalized support from our team.",
  },
  {
    id: "niagara",
    title: "Discover Niagara Falls, Canada",
    category: "EXPLORE",
    image: "/images/destinations/niagara-falls.webp",
    heading: "Experience the breathtaking beauty of Niagara Falls.",
    description:
      "Discover the magnificent waterfalls, scenic views, boat tours, and vibrant attractions of Niagara Falls, one of Canada's most iconic destinations.",
    secondary:
      "UniGo can guide you through visit or study visa options, application preparation, and required documents for your Canadian journey.",
  },

  {
    id: "usa",
    title: "Discover the Statue of Liberty",
    category: "EXPLORE",
    image: "/images/destinations/statue-of-liberty.webp",
    heading: "Explore the iconic Statue of Liberty in New York City.",
    description:
      "Discover America's iconic landmark, enjoy stunning harbor views, and experience the vibrant culture of New York City.",
    secondary:
      "UniGo can guide you through US visit or study visa options, application preparation, and required documentation.",
  },

  {
    id: "thailand",
    title: "Discover the Beauty of Thailand",
    category: "EXPLORE",
    image: "/images/destinations/thailand.webp",
    heading: "Experience Thailand’s tropical beauty and vibrant culture.",
    description:
      "Explore stunning beaches, golden temples, bustling markets, and delicious Thai cuisine in one of Southeast Asia’s most exciting destinations.",
    secondary:
      "UniGo can guide you through suitable visit or study visa options, application preparation, and required documentation for your Thai journey.",
  },
];

const AUTOPLAY_DELAY = 5000;

export function DestinationShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const transitioningRef = useRef(false);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const active = experiences[activeIndex];

  const selectExperience = useCallback((index: number) => {
    const nextIndex = (index + experiences.length) % experiences.length;

    if (nextIndex === activeIndexRef.current || transitioningRef.current) {
      return;
    }

    const content = contentRef.current;
    const visual = visualRef.current;

    if (!content || !visual) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      return;
    }

    transitioningRef.current = true;
    setIsTransitioning(true);

    animationRef.current?.kill();

    animationRef.current = gsap.to([content, visual], {
      opacity: 0,
      y: 8,
      duration: 0.24,
      ease: "power1.out",
      onComplete: () => {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      },
    });
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    const visual = visualRef.current;

    if (!content || !visual) {
      transitioningRef.current = false;
      setIsTransitioning(false);
      return;
    }

    gsap.set([content, visual], { opacity: 0, y: 8 });

    animationRef.current = gsap.to([content, visual], {
      opacity: 1,
      y: 0,
      duration: 0.42,
      stagger: 0.04,
      ease: "power2.out",
      onComplete: () => {
        transitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    return () => {
      animationRef.current?.kill();
      gsap.killTweensOf([content, visual]);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (isPaused || isTransitioning) {
      return;
    }

    const timer = window.setTimeout(() => {
      selectExperience((activeIndex + 1) % experiences.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, isTransitioning, selectExperience]);

  const goToPrevious = () => {
    selectExperience(activeIndex - 1);
  };

  const goToNext = () => {
    selectExperience(activeIndex + 1);
  };

  return (
    <section
      className="destination-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;

        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setIsPaused(false);
        }
      }}
      aria-label="Explore destinations and experiences"
      aria-roledescription="carousel"
    >
      <div className="destination-showcase-layout">
        <div className="destination-showcase-visual" ref={visualRef}>
          <Image
            key={active.image}
            src={active.image}
            alt={active.title}
            fill
            sizes="(max-width: 760px) 100vw, 53vw"
            className="destination-showcase-main-image"
          />

          <div className="destination-showcase-overlay" />

          <button
            type="button"
            className="destination-showcase-previous"
            onClick={goToPrevious}
            aria-label="Previous experience"
            disabled={isTransitioning}
          >
            <ChevronLeft size={22} />
          </button>

          <div className="destination-showcase-image-caption">
            <span>DESTINATION EXPERIENCE</span>
            <h2>{active.title}</h2>
          </div>

          <div className="destination-showcase-image-count">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="destination-showcase-image-count-divider">/</span>
            <span>{String(experiences.length).padStart(2, "0")}</span>
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
              .map((experience) => {
                const originalIndex = experiences.findIndex(
                  (item) => item.id === experience.id,
                );

                return (
                  <button
                    type="button"
                    key={experience.id}
                    className="destination-showcase-card"
                    onClick={() => selectExperience(originalIndex)}
                    aria-label={`Show ${experience.title}`}
                    disabled={isTransitioning}
                  >
                    <span className="destination-showcase-card-number">
                      {String(originalIndex + 1).padStart(2, "0")}
                    </span>

                    <span className="destination-showcase-card-image">
                      <Image
                        src={experience.image}
                        alt=""
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
                );
              })}
          </div>

          <div className="destination-showcase-footer">
            <div
              className="destination-showcase-progress"
              role="progressbar"
              aria-label="Destination slider progress"
              aria-valuemin={1}
              aria-valuemax={experiences.length}
              aria-valuenow={activeIndex + 1}
            >
              <span
                style={{
                  width: `${((activeIndex + 1) / experiences.length) * 100}%`,
                }}
              />
            </div>

            <div className="destination-showcase-pagination">
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous experience"
                disabled={isTransitioning}
              >
                Prev
              </button>

              <span>/</span>

              <button
                type="button"
                onClick={goToNext}
                aria-label="Next experience"
                disabled={isTransitioning}
              >
                Next
              </button>

              <button
                type="button"
                className="destination-showcase-next"
                onClick={goToNext}
                aria-label="Next destination"
                disabled={isTransitioning}
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
