import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { legalPolicies } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy | UniGo",
  description:
    "Learn how UniGo collects, uses, and protects personal information.",
};

export default function PrivacyPolicyPage() {
  const policy = legalPolicies["privacy-policy"];

  return (
    <LegalPage
      activeSlug="privacy-policy"
      title={policy.title}
      description={policy.description}
      updatedAt={policy.updatedAt}
      sections={policy.sections}
    />
  );
}
