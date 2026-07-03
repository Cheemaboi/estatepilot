import { CuratedMarkets } from "@/components/public/curated-markets";
import { CtaSection } from "@/components/public/cta-section";
import { FeaturedProperties } from "@/components/public/featured-properties";
import { HeroSection } from "@/components/public/hero-section";
import { PublicShell } from "@/components/public/public-shell";
import { SearchModule } from "@/components/public/search-module";
import { TrustSection } from "@/components/public/trust-section";
import { getPublicProperties } from "@/lib/supabase/data";

export default async function Home() {
  const properties = await getPublicProperties();

  return (
    <PublicShell>
      <HeroSection />
      <SearchModule />
      <FeaturedProperties properties={properties} />
      <CuratedMarkets />
      <TrustSection />
      <CtaSection />
    </PublicShell>
  );
}
