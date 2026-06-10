import { ProductType } from "@/types";
import Rating from "@mui/material/Rating";
import { useLocale, useTranslations } from "next-intl";
import { Roboto } from "next/font/google";
import { RiArrowRightLine } from "react-icons/ri";
import { MdAddShoppingCart, MdOutlineStarPurple500 } from "react-icons/md";
import Link from "next/link";
import { extractTitlePrefix } from "@/lib/utils";
import { useCartStore } from "@/lib/cartStore";
import { useDrawerStore } from "@/lib/drawerStore";
import CheckCart from "../../icons/CheckCart";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const LeftSide = ({ item }: { item: ProductType }) => {
  const t = useTranslations("hero");

  const findCharacteristic = (name: string) => {
    for (const group of item.characteristicGroups || []) {
      for (const char of group.characteristics) {
        if (char.hasOwnProperty(name)) return char.value ? char.value : "--";
      }
    }
    return "--";
  };

  const locale = useLocale();

  const { addToCart, getCount } = useCartStore();
  const { setIsOpen } = useDrawerStore();
  const inCart = getCount(item._id) > 0;

  const handleClick = (e: React.MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientX: mouseX,
      clientY: mouseY,
      bubbles: true,
    });

    setTimeout(() => {
      window.dispatchEvent(mouseMoveEvent);
    }, 50);

    addToCart(item);
    setIsOpen(true);
  };

  return (
    <div
      className={`${roboto.className} md:w-2/4 max-md:w-full max-md:order-2 order-1 dark:text-primary-foreground`}
    >
      <div className="w-full">
        <div className="max-w-[90%] max-xs:max-w-[100%]">
          <strong className="text-base tracking-[0.5px] mb-2 leading-[1em] font-bold block max-md:text-xs">
            {item.category?.name}
          </strong>
          <h2 className="text-[60px] tracking-[-0.5px] leading-[1.1em] mb-5 max-md:mb-3 font-black md:max-w-[560px] max-md:text-[34px]">
            {extractTitlePrefix(item?.title, item?.category?.name)}
          </h2>
          <p className="text-[16px] max-md:text-xs tracking-[0.5px] leading-[1.6em] mb-6 max-md:mb-4 max-xs:mb-1 max-xs:w-full">
            {item.description}
          </p>
        </div>

        <ul className="flex justify-between gap-4 max-w-[60%] max-xs:grid max-xs:grid-cols-2 max-xs:gap-2">
          <li className="text-[12px] tracking-[0.4px] mb-1 leading-4">
            <p className="flex flex-col gap-1">
              <span>{t("sub-category.output")}</span>
              <span>{findCharacteristic("output-power")}</span>
            </p>
          </li>
          <li className="text-[12px] tracking-[0.4px] mb-1 leading-4">
            <p className="flex flex-col gap-1">
              <span>{t("sub-category.voltage")}</span>
              <span className="leading-5 font-bold">
                {findCharacteristic("power-input")}
              </span>
            </p>
          </li>
          <li className="text-[12px] tracking-[0.4px] mb-1 leading-4">
            <p className="flex flex-col gap-1">
              <span>{t("sub-category.phase")}</span>
              <span className="leading-5 font-bold">
                {findCharacteristic("phase-number")}
              </span>
            </p>
          </li>
          <li className="text-[12px] tracking-[0.4px] mb-1 leading-4">
            <p className="flex flex-col gap-1">
              <span>{t("sub-category.rating")}</span>
              <Rating
                icon={
                  <MdOutlineStarPurple500 className="w-4 text-[#ff5722] h-4" />
                }
                emptyIcon={
                  <MdOutlineStarPurple500 className="w-4 h-4 text-gray-400" />
                }
                name="read-only"
                value={5}
                readOnly
              />
            </p>
          </li>
        </ul>
        {/* divider */}
        <div className="w-full h-[1px] bg-gray-200 my-6 max-w-[80%] max-xs:my-2 dark:bg-popover" />

        {/* buttons */}
        <div className="flex gap-4 relative z-[555555555]">
          <button
            onClick={handleClick}
            className="bg-elcar-opacity text-elcar text-sm px-4 py-2 rounded-full flex items-center gap-2 focused max-xs:px-2 dark:bg-popover dark:text-primary-foreground"
          >
            {!inCart ? (
              <MdAddShoppingCart className="w-5 h-5" />
            ) : (
              <CheckCart className="fill-elcar" />
            )}
            {t("buttons.buy")}
          </button>
          <Link
            href={`/${locale}/charging-stations/${item?.slug}`}
            className="text-elcar focused text-sm px-4 py-2 flex items-center gap-2 max-xs:px-2 max-xs:py-1 dark:text-primary-foreground"
          >
            {t("buttons.see")}
            <RiArrowRightLine className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
