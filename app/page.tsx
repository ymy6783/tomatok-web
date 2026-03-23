import { BigImageSection } from "@/components/home/BigImageSection";
import { FourCards } from "@/components/home/FourCards";
import { Hero } from "@/components/home/Hero";
import { IntroStrengths } from "@/components/home/IntroStrengths";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { RelatedSites } from "@/components/home/RelatedSites";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SplitFeature } from "@/components/home/SplitFeature";
import { MenuAnchors } from "@/components/home/MenuAnchors";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />
      <MenuAnchors />
      <SplitFeature />
      <FourCards />
      <BigImageSection />
      <IntroStrengths />
      <LogoMarquee />
      <RelatedSites />
      <SiteFooter />
    </div>
  );
}
