import { fetchProductDetails } from "@/api/request";
import ProductHero from "../../components/products/ProductHero";
import { ENDPOINTS } from "@/api/endpoints";
import { Roboto } from "next/font/google";
import ProductContent from "../../components/products/ProductContent";
import AddToCartButton from "../../components/common/AddToCartButton";

const roboto = Roboto({ subsets: ["latin"] });

type Params = Promise<{ id: string }>;

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const product = await fetchProductDetails(
    ENDPOINTS.products.detail.replace(":id", id)
  );

  return (
    <section className={`${roboto.className}`}>
      <ProductHero product={product} />
      <ProductContent product={product} />

      <AddToCartButton product={product} />
    </section>
  );
};

export default Page;
