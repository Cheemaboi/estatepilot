import type { ReactNode } from "react";
import { Footer } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/public-navbar";

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="min-h-screen bg-public-bg text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-luxury-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-public-bg"
        href="#main-content"
      >
        Skip to content
      </a>
      <PublicNavbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
