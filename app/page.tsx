import FullpageNav from "./components/FullpageNav";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import IntroAndEducationSection from "./components/IntroAndEducationSection";
import MissionAndOnlineSection from "./components/MissionAndOnlineSection";
import NewsSection from "./components/NewsSection";
import SitemapAndFooter from "./components/SitemapAndFooter";
import WorshipSection from "./components/WorshipSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <FullpageNav />
      <main className="flex-1">
        <HeroSection />
        <WorshipSection />
        <NewsSection />
        <IntroAndEducationSection />
        <MissionAndOnlineSection />
        <SitemapAndFooter />
      </main>
    </div>
  );
}
