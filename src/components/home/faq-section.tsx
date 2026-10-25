"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Mail,
  MessageCircle,
  Plane,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import "../../styles/home/faq-section.css";

const categories = [
  { name: "General Information", icon: HelpCircle },
  { name: "Study Abroad & Admissions", icon: GraduationCap },
  { name: "Visa & Documentation", icon: FileCheck2 },
  { name: "Fees & Payments", icon: Wallet },
  { name: "Travel & Accommodation", icon: Plane },
  { name: "Student Support", icon: ShieldCheck },
];

const faqs = [
  {
    category: "General Information",
    question: "What is UniGo?",
    answer:
      "UniGo helps students navigate their international education journey with personalized guidance, university admission support, visa application assistance, and travel preparation.",
  },
  {
    category: "General Information",
    question: "How can UniGo help me study abroad?",
    answer:
      "We help you explore suitable study destinations, understand admission requirements, prepare application documents, and navigate the steps involved in planning your education abroad.",
  },
  {
    category: "General Information",
    question: "Which countries can I choose from?",
    answer:
      "Your options depend on your academic background, budget, preferred course, and eligibility. Our team can help you explore destinations such as Canada, the United Kingdom, the United States, Australia, and other countries.",
  },
  {
    category: "General Information",
    question: "How do I get started with UniGo?",
    answer:
      "Start by contacting our team for a consultation. Share your academic background, preferred destination, and goals so we can help you understand the next steps.",
  },
  {
    category: "Study Abroad & Admissions",
    question: "How do I choose the right university and course?",
    answer:
      "We help you compare courses and universities based on your academic qualifications, career interests, budget, preferred destination, and admission requirements.",
  },
  {
    category: "Study Abroad & Admissions",
    question: "What documents are required for university admission?",
    answer:
      "Requirements vary by university and course. Common documents include academic transcripts, certificates, a passport, an English-language test result where required, a statement of purpose, and recommendation letters where applicable.",
  },
  {
    category: "Study Abroad & Admissions",
    question: "Can I apply if I have a study gap?",
    answer:
      "A study gap does not automatically prevent admission. Eligibility depends on the institution, course, your academic history, and how you explain the gap. We can help you understand the relevant requirements.",
  },
  {
    category: "Study Abroad & Admissions",
    question: "Do I need IELTS or another English-language test?",
    answer:
      "It depends on the university, program, and destination. Some institutions accept alternative tests or other evidence of English proficiency. Always check the specific admission requirements.",
  },
  {
    category: "Visa & Documentation",
    question: "Does UniGo assist with visa applications?",
    answer:
      "UniGo can help you understand the relevant visa process, organize supporting documents, and prepare your application. Visa decisions are made by the relevant immigration authorities, and approval cannot be guaranteed.",
  },
  {
    category: "Visa & Documentation",
    question: "What documents are usually needed for a student visa?",
    answer:
      "Depending on the destination, you may need an offer or enrollment document, a valid passport, proof of funds, academic records, photographs, health or biometrics documents, and other country-specific evidence.",
  },
  {
    category: "Visa & Documentation",
    question: "How long does visa processing take?",
    answer:
      "Processing times vary by country, visa type, season, and individual circumstances. Apply as early as possible and check the latest official guidance for your destination.",
  },
  {
    category: "Visa & Documentation",
    question: "Can UniGo guarantee my visa will be approved?",
    answer:
      "No. Visa decisions are made solely by the relevant authorities. UniGo can help you prepare carefully, but no consultant can guarantee an approval.",
  },
  {
    category: "Fees & Payments",
    question: "How much does it cost to study abroad?",
    answer:
      "Your total budget depends on the country, university, course, tuition fees, accommodation, living expenses, insurance, travel, and visa costs. We can help you identify the expenses to consider when planning.",
  },
  {
    category: "Fees & Payments",
    question: "Are scholarships available for international students?",
    answer:
      "Scholarships may be available through universities, governments, and other organizations. Availability and eligibility depend on your destination, course, academic record, and the scholarship provider.",
  },
  {
    category: "Fees & Payments",
    question: "When should I prepare my financial documents?",
    answer:
      "Prepare early. Universities and immigration authorities may require evidence of tuition payments, savings, sponsorship, or other funds. The exact requirements depend on your destination and application.",
  },
  {
    category: "Travel & Accommodation",
    question: "Can UniGo help me prepare for departure?",
    answer:
      "Yes. We can help you plan the practical steps before departure, including reviewing your travel checklist, organizing important documents, and understanding accommodation and arrival arrangements.",
  },
  {
    category: "Travel & Accommodation",
    question: "How can I arrange accommodation abroad?",
    answer:
      "Options may include university residences, private student accommodation, shared rentals, or homestays. Availability, costs, and eligibility vary by destination, so research and arrange accommodation early.",
  },
  {
    category: "Travel & Accommodation",
    question: "What should I prepare before travelling?",
    answer:
      "Prepare your passport, visa or travel authorization, university documents, accommodation details, travel insurance where appropriate, financial arrangements, and any destination-specific entry documents.",
  },
  {
    category: "Student Support",
    question: "Can I contact UniGo if I have questions during my application?",
    answer:
      "Yes. You can contact our team for guidance on your application progress, outstanding documents, and the next steps in your study abroad journey.",
  },
  {
    category: "Student Support",
    question: "How do I contact the UniGo team?",
    answer:
      "Visit our contact page to reach our team and request a consultation. Sharing your preferred destination and study plans will help us direct your enquiry.",
  },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("General Information");
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    "What is UniGo?",
  );

  const visibleFaqs = faqs.filter((faq) => faq.category === activeCategory);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const firstQuestion = faqs.find((faq) => faq.category === category);
    setOpenQuestion(firstQuestion?.question ?? null);
  };

  return (
    <section className="unigo-faq" id="faq">
      <Container className="unigo-faq__container">
        <header className="unigo-faq__header">
          <span className="unigo-faq__eyebrow">
            <span className="unigo-faq__eyebrow-icon">
              <MessageCircle size={15} />
            </span>
            HERE TO HELP YOU
          </span>

          <h2>
            Frequently Asked <span>Questions</span>
          </h2>

          <p>
            Everything you need to know about your study abroad journey, from
            choosing a university to preparing for departure.
          </p>
        </header>

        <div className="unigo-faq__layout">
          <aside className="unigo-faq__sidebar">
            <div className="unigo-faq__sidebar-heading">
              <span>Browse by topic</span>
              <span className="unigo-faq__category-count">
                {categories.length.toString().padStart(2, "0")}
              </span>
            </div>

            <nav className="unigo-faq__categories" aria-label="FAQ categories">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.name;

                return (
                  <button
                    key={category.name}
                    type="button"
                    className={`unigo-faq__category${isActive ? " is-active" : ""}`}
                    onClick={() => handleCategoryChange(category.name)}
                    aria-pressed={isActive}
                  >
                    <span className="unigo-faq__category-icon">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>
                    <span className="unigo-faq__category-name">
                      {category.name}
                    </span>
                    <span className="unigo-faq__category-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="unigo-faq__sidebar-note">
              <div className="unigo-faq__sidebar-note-icon">
                <GraduationCap size={21} />
              </div>
              <h3>Your journey, your future.</h3>
              <p>
                Get guidance tailored to your academic goals and preferred
                destination.
              </p>
              <Link href="/contact" className="unigo-faq__sidebar-link">
                Talk to our team <ArrowRight size={15} />
              </Link>
            </div>
          </aside>

          <div className="unigo-faq__main">
            <div className="unigo-faq__section-heading">
              <div>
                <span className="unigo-faq__section-label">
                  KNOW BEFORE YOU GO
                </span>
                <h3>{activeCategory}</h3>
              </div>
              <span className="unigo-faq__results-count">
                {String(visibleFaqs.length).padStart(2, "0")} QUESTIONS
              </span>
            </div>

            <div className="unigo-faq__list">
              {visibleFaqs.map((faq, index) => {
                const isOpen = openQuestion === faq.question;
                const answerId = `unigo-faq-answer-${categories.findIndex(
                  (category) => category.name === activeCategory,
                )}-${index}`;

                return (
                  <article
                    key={faq.question}
                    className={`unigo-faq__item${isOpen ? " is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className="unigo-faq__question"
                      onClick={() =>
                        setOpenQuestion(isOpen ? null : faq.question)
                      }
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                    >
                      <span className="unigo-faq__question-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="unigo-faq__question-text">
                        {faq.question}
                      </span>
                      <span className="unigo-faq__toggle">
                        <ChevronDown size={18} strokeWidth={2} />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="unigo-faq__answer" id={answerId}>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="unigo-faq__contact">
              <div className="unigo-faq__contact-icon">
                <Mail size={23} strokeWidth={1.7} />
              </div>

              <div className="unigo-faq__contact-copy">
                <span className="unigo-faq__contact-eyebrow">
                  WE ARE HERE FOR YOU
                </span>
                <h3>Still have a question?</h3>
                <p>Every journey is different. Let’s talk about yours.</p>
              </div>

              <Link href="/contact" className="unigo-faq__contact-button">
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="unigo-faq__bottom-note">
          <span className="unigo-faq__bottom-mark">
            <BookOpen size={16} />
          </span>
          <p>
            Every study abroad journey is different. Requirements may vary by
            institution and destination.
          </p>
          <span className="unigo-faq__bottom-brand">UNIGO</span>
        </div>
      </Container>
    </section>
  );
}
