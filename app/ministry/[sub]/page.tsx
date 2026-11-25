import SubMenuPageView from "@/app/components/SubMenuPageView";
import { SUBMENU_PAGES } from "@/app/data/submenuData";

export function generateStaticParams() {
  return SUBMENU_PAGES.filter((p) => p.categoryId === "ministry").map((p) => ({
    sub: p.slug,
  }));
}

export default async function MinistrySubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return <SubMenuPageView categoryId="ministry" slug={sub} />;
}
