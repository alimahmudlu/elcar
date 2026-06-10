import { RxCross2 } from "react-icons/rx";
import { extractTitlePrefix } from "@/lib/utils";
import Image from "next/image";
import { MouseEvent } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import { BiChevronUp } from "react-icons/bi";
import { BASE_URL } from "@/api/endpoints";

interface CartItemProps {
  title: string;
  price: number;
  count: number;
  image: {
    src: string;
  };
  category: {
    name: string;
  };
  handleDecrement: (e: MouseEvent<HTMLButtonElement>) => void;
  handleIncrement: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const CartItem = ({
  title,
  price,
  count,
  image,
  category,
  handleDecrement,
  handleIncrement,
}: CartItemProps) => {
  return (
    <>
      <div className="flex gap-1 items-center justify-between hover:shadow-2xl shadow-none duration-200 p-2">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-card">
          <Image
            width={100}
            height={100}
            src={`${BASE_URL}/${image.src}`}
            alt={extractTitlePrefix(title, category.name)}
            className="h-full w-full object-contain object-center"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between">
            <h3 className="text-xs font-medium text-gray-900 dark:text-primary-foreground">
              {title}
            </h3>
          </div>
          <p className="text-xs font-medium bg-elcar text-white px-2 py-1 rounded-full w-max  dark:text-secondary-foreground">
            {price.toFixed(2)} AZN
          </p>
        </div>
        <div className="mt-2 flex flex-col-reverse items-center justify-center gap-0.5">
          <button
            className="p-1 focused rounded-md hover:bg-gray-50 dark:text-secondary-foreground"
            onClick={handleDecrement}
          >
            {count > 1 ? (
              <AiOutlineMinus />
            ) : (
              <RxCross2 className="text-red-600" />
            )}
          </button>
          <span className="text-sm dark:text-secondary-foreground">{count}</span>
          <button
            className="p-1 focused rounded-md hover:bg-gray-50 dark:text-secondary-foreground"
            onClick={handleIncrement}
          >
            <BiChevronUp className="w-5 h-5"  />
          </button>
        </div>
      </div>
    </>
  );
};
