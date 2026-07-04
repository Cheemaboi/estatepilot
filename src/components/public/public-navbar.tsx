import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  { label: "Listings", href: "/listings" },
  { label: "Markets", href: "/#markets" },
  { label: "Agents", href: "/#agents" },
  { label: "Smart Finder", href: "/smart-finder" },
  { label: "Favorites", href: "/favorites" },
];

export function PublicNavbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav
        className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[0.22em] text-white focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
          >
            ESTATEPILOT
          </Link>
          <div className="hidden items-center gap-8 rounded-full border border-white/12 bg-white/[0.07] px-5 py-3 text-sm font-medium text-white/72 backdrop-blur-xl md:flex">
            {navItems.map((item) => (
              <Link
                className="transition hover:text-white focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <ButtonLink href="/auth/login?next=/dashboard" variant="secondary">
              Admin
            </ButtonLink>
            <ButtonLink href="/auth/login?next=/dashboard" variant="secondary">
              Sign in
            </ButtonLink>
            <ButtonLink href="#contact" className="ml-1">
              Book a consult
            </ButtonLink>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto rounded-full border border-white/12 bg-white/[0.07] p-1.5 text-sm font-medium text-white/72 backdrop-blur-xl md:hidden">
          {navItems.map((item) => (
            <Link
              className="shrink-0 rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-accent"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-2 transition hover:border-luxury-accent/70 hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-accent"
            href="/auth/login?next=/dashboard"
          >
            Admin
          </Link>
          <Link
            className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-2 transition hover:border-luxury-accent/70 hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-accent"
            href="/auth/login?next=/dashboard"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
