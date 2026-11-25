import CommunityBoard from "../components/CommunityBoard";
import NewsSection from "../components/NewsSection";
import SubPageShell from "../components/SubPageShell";
import { NAV_CATEGORIES } from "../data/churchData";

const category = NAV_CATEGORIES.find((c) => c.id === "community")!;

export default function CommunityPage() {
  return (
    <SubPageShell category={category}>
      <CommunityBoard />
      <div id="newsroom">
        <NewsSection />
      </div>
    </SubPageShell>
  );
}
