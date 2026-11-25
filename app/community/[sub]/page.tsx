import SubMenuPageView from "@/app/components/SubMenuPageView";
import { SUBMENU_PAGES } from "@/app/data/submenuData";

export function generateStaticParams() {
  return SUBMENU_PAGES.filter((p) => p.categoryId === "community").map((p) => ({
    sub: p.slug,
  }));
}

export default async function CommunitySubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return <SubMenuPageView categoryId="community" slug={sub} />;
}
