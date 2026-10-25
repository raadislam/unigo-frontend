import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import "../../styles/home/student-stories.css";

const stories = [
  {
    name: "Ayesha Rahman",
    destination: "Canada",
    initials: "AR",
    color: "rose",
    quote:
      "The guidance throughout my study abroad planning made the entire process easier to understand. I always knew what to prepare next.",
  },
  {
    name: "Tanvir Hasan",
    destination: "United Kingdom",
    initials: "TH",
    color: "navy",
    quote:
      "From exploring university options to preparing my documents, the support helped me approach each step with greater confidence.",
  },
  {
    name: "Nusrat Jahan",
    destination: "Australia",
    initials: "NJ",
    color: "blue",
    quote:
      "Having clear guidance and a team to turn to made planning my international education journey feel much more manageable.",
  },
];

export default function StudentStories() {
  return (
    <section className="student-stories" id="student-stories">
      <div className="student-stories__inner">
        <div className="student-stories__intro">
          <span className="student-stories__eyebrow">
            <span className="student-stories__eyebrow-line" />
            STUDENT STORIES
          </span>

          <h2>
            Real Stories.
            <br />
            <span>Big Dreams.</span>
          </h2>

          <p>
            Every journey starts with a dream. Discover how personalized
            guidance can help students take their next step toward international
            education.
          </p>

          <Link href="/testimonials" className="student-stories__button">
            Explore Student Stories
            <ArrowRight size={17} />
          </Link>

          <div className="student-stories__trust">
            <span className="student-stories__trust-icon">
              <Star size={16} fill="currentColor" />
            </span>
            <p>
              <strong>Every journey matters.</strong>
              <span>Personal guidance, one student at a time.</span>
            </p>
          </div>
        </div>

        <div className="student-stories__grid">
          {stories.map((story) => (
            <article className="student-stories__card" key={story.name}>
              <div className="student-stories__card-header">
                <span
                  className={`student-stories__avatar student-stories__avatar--${story.color}`}
                  aria-hidden="true"
                >
                  {story.initials}
                </span>

                <div className="student-stories__student">
                  <h3>{story.name}</h3>
                  <span>Study destination: {story.destination}</span>
                </div>
              </div>

              <div className="student-stories__quote-icon">
                <Quote size={22} strokeWidth={1.8} />
              </div>

              <p className="student-stories__quote">{story.quote}</p>

              <div className="student-stories__card-footer">
                <div
                  className="student-stories__rating"
                  aria-label="Sample five-star rating"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={15}
                      fill="currentColor"
                      strokeWidth={1.4}
                    />
                  ))}
                </div>

                <span className="student-stories__story-label">
                  STUDENT STORY
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
