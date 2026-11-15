"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Search,
} from "lucide-react";
import "@/styles/blog/blog-resources.css";

const categories = [
  "All",
  "Visa & Immigration",
  "Education",
  "Travel",
  "Global Programs",
  "Insights",
];

const articles = [
  {
    slug: "visa-application-preparation-guide",
    title: "Your Complete Guide to Preparing a Successful Visa Application",
    excerpt:
      "Understand essential documents, application procedures and practical preparation tips before starting your international journey.",
    category: "Visa & Immigration",
    author: "UniGo Editorial Team",
    date: "November 01, 2026",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85",
    featured: true,
  },
  {
    slug: "choosing-your-next-global-destination",
    title: "Choosing the Right Destination for Your Next Global Journey",
    excerpt:
      "Explore the factors that can help you choose a destination that matches your goals, interests and budget.",
    category: "Travel",
    author: "UniGo Team",
    date: "October 25, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=85",
  },
  {
    slug: "international-university-application-guide",
    title: "What to Know Before Applying to an International University",
    excerpt:
      "From choosing a programme to preparing your application, discover the important steps to consider.",
    category: "Education",
    author: "Education Desk",
    date: "October 19, 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=85",
  },
  {
    slug: "visitor-visa-documents-and-preparation",
    title: "Understanding Visitor Visas: Documents and Preparation",
    excerpt:
      "Learn about common visitor visa requirements and how to prepare a clear, organised application.",
    category: "Visa & Immigration",
    author: "Visa Advisory Team",
    date: "October 12, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
  },
  {
    slug: "international-olympiads-global-opportunities",
    title: "International Olympiads: A World of Learning Beyond Borders",
    excerpt:
      "Discover how international competitions create opportunities for students to learn, connect and grow.",
    category: "Global Programs",
    author: "Programs Team",
    date: "October 05, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
  },
  {
    slug: "planning-your-international-travel-budget",
    title: "Planning Your International Travel Budget",
    excerpt:
      "A practical overview of accommodation, transport, daily expenses and other costs to consider.",
    category: "Travel",
    author: "UniGo Editorial Team",
    date: "September 28, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=85",
  },
];

export function BlogResources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredArticle = articles[0];

  const filteredArticles = useMemo(() => {
    return articles.slice(1).filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section className="blog-resources">
      <div className="blog-resources__container">
        <div className="blog-resources__section-heading">
          <div>
            <span className="blog-resources__eyebrow">EDITOR&apos;S SELECTION</span>
            <h2>Featured story</h2>
          </div>

          <span className="blog-resources__subheading">
            A good place to start
          </span>
        </div>

        <Link href={`/blog/${featuredArticle.slug}/`} className="blog-featured">
          <div
            className="blog-featured__image"
            style={{
              backgroundImage: `url("${featuredArticle.image}")`,
            }}
          >
            <span className="blog-featured__category">
              {featuredArticle.category}
            </span>

            <div className="blog-featured__content">
              <span className="blog-featured__label">
                <span />
                FEATURED ARTICLE
              </span>

              <h2>{featuredArticle.title}</h2>

              <p>{featuredArticle.excerpt}</p>

              <div className="blog-featured__meta">
                <span>{featuredArticle.author}</span>

                <span>
                  <CalendarDays size={14} />
                  {featuredArticle.date}
                </span>

                <span>
                  <Clock3 size={14} />
                  {featuredArticle.readTime}
                </span>
              </div>
            </div>

            <span className="blog-featured__arrow">
              <ArrowUpRight size={22} />
            </span>
          </div>
        </Link>

        <div className="blog-resources__listing-heading">
          <div>
            <span className="blog-resources__eyebrow">EXPLORE THE JOURNAL</span>

            <h2>Browse our resources</h2>

            <p>
              Helpful perspectives and practical information for your
              international journey.
            </p>
          </div>

          <label className="blog-resources__search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search articles"
            />
          </label>
        </div>

        <div className="blog-resources__toolbar">
          <div
            className="blog-resources__categories"
            aria-label="Article categories"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "is-active" : ""}
              >
                {category}
              </button>
            ))}
          </div>

          <span className="blog-resources__count">
            {filteredArticles.length} ARTICLES
          </span>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="blog-resources__grid">
            {filteredArticles.map((article) => (
              <Link
                href={`/blog/${article.slug}/`}
                key={article.slug}
                className="blog-card"
              >
                <div
                  className="blog-card__image"
                  style={{
                    backgroundImage: `url("${article.image}")`,
                  }}
                >
                  <span>{article.category}</span>

                  <div className="blog-card__image-arrow">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span>{article.date}</span>

                    <span>
                      <Clock3 size={13} />
                      {article.readTime}
                    </span>
                  </div>

                  <h3>{article.title}</h3>

                  <p>{article.excerpt}</p>

                  <div className="blog-card__footer">
                    <span>{article.author}</span>

                    <span className="blog-card__read">
                      Read article
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="blog-resources__empty">
            <Search size={28} />

            <h3>No articles found</h3>

            <p>Try another search term or select a different category.</p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="blog-resources__contact">
          <div>
            <span className="blog-resources__eyebrow">STAY CONNECTED</span>

            <h2>More perspectives. Better decisions.</h2>

            <p>
              Keep exploring our latest insights, updates and practical guidance
              for your next opportunity.
            </p>
          </div>

          <Link href="/contact/" className="blog-resources__contact-link">
            Connect with UniGo
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
