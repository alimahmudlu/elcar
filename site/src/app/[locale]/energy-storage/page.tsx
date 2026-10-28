import type { Metadata } from "next";
import SectionListPage, {
  sectionListMetadata,
} from "../components/sections/SectionListPage";

const SECTION = "energy-storage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return sectionListMetadata(SECTION, locale);
}

type SearchParams = Promise<{ page?: string }>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1) || 1);
  return <SectionListPage section={SECTION} page={page} />;
};

export default Page;
