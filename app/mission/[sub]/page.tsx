import SubMenuPageView from "@/app/components/SubMenuPageView";
import { SUBMENU_PAGES } from "@/app/data/submenuData";

export function generateStaticParams() {
  return SUBMENU_PAGES.filter((p) => p.categoryId === "mission").map((p) => ({
    sub: p.slug,
  }));
}

export default async function MissionSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return <SubMenuPageView categoryId="mission" slug={sub} />;
}
