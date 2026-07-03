import { CtaSection } from "@/components/public/cta-section";
import { FeaturedProperties } from "@/components/public/featured-properties";
import { Footer } from "@/components/public/footer";
import { HeroSection } from "@/components/public/hero-section";
import { PublicNavbar } from "@/components/public/public-navbar";
import { SearchModule } from "@/components/public/search-module";

export default function Home() {
  return (
    <div className="min-h-screen bg-public-bg text-foreground">
      <PublicNavbar />
      <main>
        <HeroSection />
        <SearchModule />
        <FeaturedProperties />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
