const footerLinks = [
  { label: "Listings", href: "#featured" },
  { label: "Agents", href: "#contact" },
  { label: "Markets", href: "#search" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 text-white/66 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.22em] text-white">
            ESTATEPILOT
          </p>
          <p className="mt-2 text-sm">
            Premium public discovery. Operational SaaS foundation.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-5 text-sm"
          aria-label="Footer navigation"
        >
          {footerLinks.map((item) => (
            <a
              className="transition hover:text-white focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
