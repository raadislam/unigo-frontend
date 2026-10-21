import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/shared/container";

export function SiteFooter() {
  return (
    <footer className="bg-[#061F38] text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-3xl font-black tracking-tight">
              Uni<span className="text-[#F04A5D]">Go</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
              Your global education journey starts here. Explore destinations
              and get guidance to make your international study plans clearer.
            </p>
            <Link
              href="/contact/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#F04A5D]"
            >
              Talk to our team <ArrowUpRight size={16} />
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-bold">Explore UniGo</h2>
            <div className="mt-5 grid gap-3">
              {navigation.slice(1, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold">Contact us</h2>
            <div className="mt-5 grid gap-4 text-sm text-slate-300">
              <a
                href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-start gap-3"
              >
                <Phone size={17} className="mt-0.5 shrink-0" />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-start gap-3"
              >
                <Mail size={17} className="mt-0.5 shrink-0" />
                {siteConfig.email}
              </a>
              <p className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0" />
                {siteConfig.address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UniGo. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy/" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="hover:text-white">
              Terms of Use
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
