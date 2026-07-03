import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  { label: "Listings", href: "#featured" },
  { label: "Markets", href: "#search" },
  { label: "Agents", href: "#contact" },
  { label: "Insights", href: "#featured" },
];

export function PublicNavbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.22em] text-white focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
        >
          ESTATEPILOT
        </Link>
        <div className="hidden items-center gap-8 rounded-full border border-white/12 bg-white/[0.07] px-5 py-3 text-sm font-medium text-white/72 backdrop-blur-xl md:flex">
          {navItems.map((item) => (
            <a
              className="transition hover:text-white focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>
        <ButtonLink
          href="#contact"
          variant="secondary"
          className="hidden sm:inline-flex"
        >
          Book a consult
        </ButtonLink>
      </nav>
    </header>
  );
}
