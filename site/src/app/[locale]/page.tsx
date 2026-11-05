import HeroSlider from "./components/home/HeroSlider";
import Services from "./components/home/Services";
import ChargingStations from "./components/home/ChargingStations";
import ConnectorsAndAccessories from "./components/home/ConnectorsAndAccessories";
import MobileServices from "./components/home/MobileServices";
import EnergySolutions from "./components/home/EnergySolutions";
import FeaturedEnergyProducts from "./components/home/FeaturedEnergyProducts";
import { fetchData } from "@/api/request";
import { BASE_URL, ENDPOINTS } from "@/api/endpoints";

export default async function HomePage() {
  const sliderData = await fetchData(ENDPOINTS.products.slider);

  return (
    <section>
      <HeroSlider data={sliderData} BASE_URL={BASE_URL || ""} />
      <Services />
      <EnergySolutions />
      <FeaturedEnergyProducts />
      <ChargingStations />
      <ConnectorsAndAccessories />
      <MobileServices />
    </section>
  );
}
