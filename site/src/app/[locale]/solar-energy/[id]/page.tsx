import type { Metadata } from "next";
import SectionDetailPage, {
  sectionDetailMetadata,
} from "../../components/sections/SectionDetailPage";

const SECTION = "solar-energy";

type Params = Promise<{ id: string; locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, id } = await params;
  return sectionDetailMetadata(SECTION, locale, id);
}

const Page = async ({ params }: { params: Params }) => {
  const { id, locale } = await params;
  return <SectionDetailPage section={SECTION} id={id} locale={locale} />;
};

export default Page;
