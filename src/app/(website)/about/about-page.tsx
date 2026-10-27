import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  GraduationCap,
  Compass,
  Users,
} from "lucide-react";
import "../../../styles/about/about-page.css";

const values = [
  {
    number: "01",
    title: "Student-first guidance",
    description:
      "Helping students understand their options and make informed decisions about their educational future.",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "Global perspective",
    description:
      "Exploring international destinations, educational pathways, and opportunities beyond borders.",
    icon: Globe2,
  },
  {
    number: "03",
    title: "Personal support",
    description:
      "Making a complex journey easier to understand through clear information and practical guidance.",
    icon: Compass,
  },
];

const milestones = [
  {
    number: "01",
    title: "Explore",
    description: "Discover destinations, courses, and educational pathways.",
  },
  {
    number: "02",
    title: "Understand",
    description: "Learn about requirements, applications, and next steps.",
  },
  {
    number: "03",
    title: "Move forward",
    description:
      "Build a plan that supports your international education goals.",
  },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero__topline">
            <span className="about-eyebrow">
              <span />
              ABOUT UNIGO
            </span>
            <span className="about-hero__index">OUR STORY / 01</span>
          </div>

          <div className="about-hero__grid">
            <div className="about-hero__content">
              <h1>
                Your future
                <span>has no borders.</span>
              </h1>

              <p>
                We help students explore international education, understand
                their options, and take confident steps toward a world of
                opportunity.
              </p>

              <div className="about-hero__actions">
                <Link href="/contact" className="about-button">
                  Talk to our team
                  <ArrowUpRight size={17} />
                </Link>

                <Link href="#our-mission" className="about-text-link">
                  Discover our mission
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="about-hero__visual">
              <div className="about-hero__image-frame">
                <Image
                  src="/images/about/hero.png"
                  alt="Students exploring international education opportunities"
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 50vw"
                  className="about-image"
                />
              </div>

              <div className="about-hero__image-caption">
                <span className="about-hero__caption-dot" />A world of
                possibilities
              </div>

              <span className="about-hero__decorative-index">U.</span>
            </div>
          </div>

          <div className="about-hero__bottom">
            <span>EDUCATION WITHOUT BORDERS</span>
            <span>DISCOVER YOUR NEXT CHAPTER</span>
          </div>
        </div>
      </section>

      <section
        className="about-mission"
        id="our-mission"
        aria-labelledby="about-mission-title"
      >
        <div className="about-container">
          <div className="about-mission__grid">
            <div className="about-mission__content">
              <span className="about-eyebrow">
                <span />
                OUR MISSION
              </span>

              <h2 id="about-mission-title">
                Making global education
                <span>easier to navigate.</span>
              </h2>

              <p>
                Choosing an international education pathway can feel
                overwhelming. UniGo aims to make that journey clearer by helping
                students explore their options, understand important
                requirements, and plan their next steps.
              </p>

              <p>
                Our focus is on accessible information, thoughtful guidance, and
                helping each student move forward with greater clarity.
              </p>

              <Link href="/services" className="about-inline-link">
                Explore our services
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="about-mission__visual">
              <div className="about-mission__image-frame">
                <Image
                  src="/images/about/mission.png"
                  alt="Students collaborating on their educational goals"
                  fill
                  sizes="(max-width: 760px) 100vw, 45vw"
                  className="about-image"
                />
              </div>

              <div className="about-mission__note">
                <span className="about-mission__note-icon">
                  <Globe2 size={21} />
                </span>
                <div>
                  <strong>A world of opportunity</strong>
                  <span>One informed step at a time.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values" aria-labelledby="about-values-title">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">
                <span />
                WHAT GUIDES US
              </span>

              <h2 id="about-values-title">
                The principles behind
                <span>every journey.</span>
              </h2>
            </div>

            <p>
              A thoughtful approach to international education starts with
              listening, understanding, and providing clear direction.
            </p>
          </div>

          <div className="about-values__grid">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article className="about-value" key={value.number}>
                  <div className="about-value__top">
                    <span>{value.number}</span>
                    <Icon size={23} strokeWidth={1.6} />
                  </div>

                  <h3>{value.title}</h3>
                  <p>{value.description}</p>

                  <span className="about-value__line" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-journey">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">
                <span />
                THE UNIGO APPROACH
              </span>

              <h2>
                Clarity at every
                <span>step of the journey.</span>
              </h2>
            </div>

            <p>
              Every student has different goals. We help make the process easier
              to understand, from early exploration to planning the next move.
            </p>
          </div>

          <div className="about-journey__grid">
            {milestones.map((milestone) => (
              <article className="about-milestone" key={milestone.number}>
                <span className="about-milestone__number">
                  {milestone.number}
                </span>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-container">
          <div className="about-cta__inner">
            <div className="about-cta__content">
              <span className="about-eyebrow about-eyebrow--light">
                <span />
                YOUR NEXT CHAPTER
              </span>

              <h2>
                Ready to explore
                <span>what comes next?</span>
              </h2>

              <p>
                Start a conversation with UniGo and take the first step toward
                understanding your international education options.
              </p>
            </div>

            <Link href="/contact" className="about-cta__button">
              Get in touch
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
