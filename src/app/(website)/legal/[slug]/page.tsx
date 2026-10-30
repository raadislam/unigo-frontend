import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/shared/legal-page";
import { legalPolicies } from "@/lib/legal-content";

type PolicySlug = keyof typeof legalPolicies;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(legalPolicies).map((slug) => ({
    slug,
  }));
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!(slug in legalPolicies)) {
    return {
      title: "Policy Not Found | UniGo",
    };
  }

  const policy = legalPolicies[slug as PolicySlug];

  return {
    title: `${policy.title} | UniGo`,
    description: policy.description,
  };
}

export default async function PolicyPage({ params }: PageProps) {
  const { slug } = await params;

  if (!(slug in legalPolicies)) {
    notFound();
  }

  const policy = legalPolicies[slug as PolicySlug];

  return (
    <LegalPage
      activeSlug={slug}
      title={policy.title}
      description={policy.description}
      updatedAt={policy.updatedAt}
      sections={policy.sections}
    />
  );
}
