"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  GraduationCap,
  UsersRound,
  University,
  FileCheck2,
  Plane,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import HeroIllustration from "./hero-illustration";
import "../../styles/home/hero-section.css";

const services = [
  {
    title: "Expert Guidance",
    icon: UsersRound,
    className: "service-red",
  },
  {
    title: "University Admissions",
    icon: University,
    className: "service-blue",
  },
  {
    title: "Visa Assistance",
    icon: FileCheck2,
    className: "service-green",
  },
  {
    title: "Travel Support",
    icon: Plane,
    className: "service-orange",
  },
];

const statistics = [
  { value: "5K+", label: "Students Guided" },
  { value: "20+", label: "Countries" },
  { value: "200+", label: "Partner Universities" },
  { value: "98%", label: "Success Rate" },
];

export function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .from(".hero-eyebrow", {
          opacity: 0,
          y: 12,
          duration: 0.45,
        })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 20,
            duration: 0.65,
          },
          "-=0.2",
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 12,
            duration: 0.45,
          },
          "-=0.3",
        )
        .from(
          ".hero-service",
          {
            opacity: 0,
            y: 10,
            stagger: 0.07,
            duration: 0.35,
          },
          "-=0.15",
        )
        .from(
          ".hero-stat",
          {
            opacity: 0,
            y: 8,
            stagger: 0.06,
            duration: 0.35,
          },
          "-=0.1",
        );
    },
    { scope: root },
  );

  return (
    <section className="unigo-hero" ref={root}>
      <div className="unigo-hero-grid" aria-hidden="true" />

      <Container className="unigo-hero-container">
        <div className="unigo-hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-icon">
              <GraduationCap size={19} strokeWidth={2} />
            </span>
            <span>Your Global Journey Starts Here.</span>
          </div>

          <h1 className="hero-title">
            Explore the World.
            <br />
            Build a Brighter
            <br />
            <span>Tomorrow.</span>
          </h1>

          <p className="hero-description">
            Your journey to international education starts here. Get
            personalized guidance, university admission support, and end-to-end
            visa assistance from a team that puts your future first.
          </p>

          <div className="hero-services">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div className="hero-service" key={service.title}>
                  <div className={`hero-service-icon ${service.className}`}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <span>{service.title}</span>
                </div>
              );
            })}
          </div>

          <div className="hero-statistics">
            {statistics.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-trust-note">
            <CheckCircle2 size={16} strokeWidth={2} />
            <span>Personalized support for your study abroad journey</span>
          </div>
        </div>

        <div className="unigo-hero-visual">
          <HeroIllustration />
        </div>
      </Container>
    </section>
  );
}
