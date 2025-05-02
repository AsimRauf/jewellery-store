import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import StyleCarousel from "@/components/StyleCarousel";
import FeatureBox from "@/components/FeatureBox";
import EngagementSection from '@/components/EngagementSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryCarousel />
      <StyleCarousel />
      <FeatureBox />
      <EngagementSection />
    </main>
  );
}
