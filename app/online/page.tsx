import OnlineApplicationPanel from "../components/OnlineApplicationPanel";
import SubPageShell from "../components/SubPageShell";
import { NAV_CATEGORIES } from "../data/churchData";

const category = NAV_CATEGORIES.find((c) => c.id === "online")!;

export default function OnlinePage() {
  return (
    <SubPageShell category={category}>
      <OnlineApplicationPanel initialServiceId="edu-apply" />
    </SubPageShell>
  );
}
