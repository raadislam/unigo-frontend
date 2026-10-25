import Link from "next/link";
import {
  GraduationCap,
  FileCheck2,
  Stamp,
  Languages,
  Wallet,
  PlaneTakeoff,
  House,
  Headset,
  Plus,
} from "lucide-react";
import "../../styles/home/our-services.css";

const services = [
  {
    title: "University Selection",
    description: "Find the right university for your goals.",
    Icon: GraduationCap,
    slug: "university-selection",
  },
  {
    title: "Application Assistance",
    description: "Complete support with applications and documents.",
    Icon: FileCheck2,
    slug: "application-assistance",
  },
  {
    title: "Visa Guidance",
    description: "Navigate visa requirements and application steps.",
    Icon: Stamp,
    slug: "visa-guidance",
  },
  {
    title: "IELTS / Language Prep",
    description: "Improve your language skills with expert guidance.",
    Icon: Languages,
    slug: "language-preparation",
  },
  {
    title: "Financial Guidance",
    description: "Understand budgeting and financial requirements.",
    Icon: Wallet,
    slug: "financial-guidance",
  },
  {
    title: "Pre-Departure Orientation",
    description: "Prepare for travel, culture, and student life.",
    Icon: PlaneTakeoff,
    slug: "pre-departure",
  },
  {
    title: "Accommodation Support",
    description: "Explore suitable student housing options.",
    Icon: House,
    slug: "accommodation-support",
  },
  {
    title: "Post-Arrival Support",
    description: "Get help settling into your new destination.",
    Icon: Headset,
    slug: "post-arrival-support",
  },
];

export default function OurServices() {
  return (
    <section className="our-services" id="our-services">
      <div className="our-services__inner">
        <div className="our-services__intro">
          <span className="our-services__eyebrow">OUR SERVICES</span>

          <h2>
            End-to-End Support
            <br />
            for Your <span>Study Abroad</span> Journey
          </h2>

          <p>
            From university selection to visa assistance and pre-departure
            support, we provide personalized guidance to help make your study
            abroad journey smooth and successful.
          </p>

          <Link href="/services" className="our-services__button">
            Explore All Services
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="our-services__grid">
          {services.map(({ title, description, Icon, slug }) => (
            <Link
              href={`/services/${slug}`}
              className="our-services__card"
              key={slug}
            >
              <div className="our-services__card-top">
                <span className="our-services__icon">
                  <Icon size={24} strokeWidth={2} />
                </span>

                <span className="our-services__plus" aria-hidden="true">
                  <Plus size={17} strokeWidth={2} />
                </span>
              </div>

              <h3>{title}</h3>
              <p>{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
