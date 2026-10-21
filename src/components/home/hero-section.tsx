"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import {
  GraduationCap,
  UsersRound,
  University,
  FileCheck2,
  Plane,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { HeroIllustration } from "./hero-illustration";
import "./hero-section.css";

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
          y: 16,
          duration: 0.55,
        })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 25,
            duration: 0.75,
          },
          "-=0.25",
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 16,
            duration: 0.55,
          },
          "-=0.35",
        )
        .from(
          ".hero-service",
          {
            opacity: 0,
            y: 15,
            stagger: 0.1,
            duration: 0.45,
          },
          "-=0.2",
        )
        .from(
          ".hero-stat",
          {
            opacity: 0,
            y: 12,
            stagger: 0.08,
            duration: 0.4,
          },
          "-=0.15",
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
              <GraduationCap size={18} strokeWidth={2} />
            </span>
            <span>Your Global Education Partner</span>
          </div>

          <h1 className="hero-title">
            Explore the World
            <br />
            Build a Brighter
            <br />
            <span>Tomorrow</span>
          </h1>

          <p className="hero-description">
            We help students achieve their international education dreams with
            personalized guidance, university admissions support and end-to-end
            visa assistance.
          </p>

          <div className="hero-services">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div className="hero-service" key={service.title}>
                  <div className={`hero-service-icon ${service.className}`}>
                    <Icon size={23} strokeWidth={1.9} />
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
            <CheckCircle2 size={16} />
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
