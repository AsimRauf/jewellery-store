import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import StyleCarousel from "@/components/StyleCarousel";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryCarousel />
      <StyleCarousel />
    </main>
  );
}
