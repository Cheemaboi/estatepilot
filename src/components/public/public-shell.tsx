import type { ReactNode } from "react";
import { Footer } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/public-navbar";

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="min-h-screen bg-public-bg text-foreground">
      <PublicNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
