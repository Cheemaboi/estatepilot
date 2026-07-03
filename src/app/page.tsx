import { CuratedMarkets } from "@/components/public/curated-markets";
import { CtaSection } from "@/components/public/cta-section";
import { FeaturedProperties } from "@/components/public/featured-properties";
import { HeroSection } from "@/components/public/hero-section";
import { PublicShell } from "@/components/public/public-shell";
import { SearchModule } from "@/components/public/search-module";
import { TrustSection } from "@/components/public/trust-section";

export default function Home() {
  return (
    <PublicShell>
      <HeroSection />
      <SearchModule />
      <FeaturedProperties />
      <CuratedMarkets />
      <TrustSection />
      <CtaSection />
    </PublicShell>
  );
}
