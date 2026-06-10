"use client";
import { ProductType } from "@/types";
import { MdAddShoppingCart } from "react-icons/md";
import { useCartStore } from "@/lib/cartStore";
import { useDrawerStore } from "@/lib/drawerStore";
import CheckCart from "../icons/CheckCart";

export default function AddToCartButton({ product }: { product: ProductType }) {
  const { addToCart, getCount, items } = useCartStore();
  const { setIsOpen } = useDrawerStore();
  const inCart = getCount(product._id) > 0;

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

    addToCart(product);
    setIsOpen(true);
  };

  return (
    <button
      className="fixed bottom-9 max-md:bottom-6 max-sm:right-8 focused right-16 max-md:right-12 w-14 h-14 bg-orange-500 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
      aria-label="Add to cart"
      onClick={handleClick}
    >
      <div className="relative">
        {items.length && inCart ? (
          <CheckCart className="text-3xl w-6 h-6 text-black fill-title dark:fill-secondary" />
        ) : (
          <MdAddShoppingCart className="text-2xl text-black dark:text-secondary" />
        )}
      </div>
    </button>
  );
}
