import { Quote, Star } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const testimonials = [
  {
    name: "Student testimonial",
    location: "International study applicant",
    quote:
      "The guidance helped me better understand my options and organize the next steps in my education journey.",
  },
  {
    name: "Parent testimonial",
    location: "Student's parent",
    quote:
      "Having a clearer understanding of the application process made planning for international education easier.",
  },
  {
    name: "Student testimonial",
    location: "Prospective international student",
    quote:
      "The support helped me understand what to consider when comparing Destinations and programs.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-[#F7FAFE] py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Student experiences"
          title="Guidance that helps you move forward"
          description="A supportive process can make the journey toward international education easier to navigate."
          centered
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={`${testimonial.name}-${index}`}
              className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"
            >
              <Quote size={28} className="text-[#D7192D]" />
              <div className="mt-5 flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                “{testimonial.quote}”
              </p>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-[#082B4C]">
                  {testimonial.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {testimonial.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
