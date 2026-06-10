"use client";

import { Button } from "@/components/ui/button";
import { FaShoppingCart } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useTranslations } from "next-intl";
import CustomRipple from "../common/CustomRipple";
import { useDrawerStore } from "@/lib/drawerStore";
import { useCartStore } from "@/lib/cartStore";
import { BasketProductType } from "@/types";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import OrderCheckoutModal from "./OrderCheckoutModal";
import { CartItem } from "../cartDrawer/CartItem";

export default function CartDrawer() {
  const t = useTranslations("header");

  const { items, increment, decrement, clearBasket } = useCartStore();
  const { isOpen, setIsOpen } = useDrawerStore();
  const [cartItems, setCartItems] = useState<BasketProductType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const handleIncrement = (itemId: string, e: React.MouseEvent) => {
    if (cartItems.find((item) => item._id === itemId)?.count === 10) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    setTimeout(() => {
      const mouseMoveEvent = new MouseEvent("mousemove", {
        clientX: mouseX,
        clientY: mouseY,
        bubbles: true,
      });
      window.dispatchEvent(mouseMoveEvent);
    }, 50);

    increment(itemId);
  };

  const handleDecrement = (itemId: string, e: React.MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    setTimeout(() => {
      const mouseMoveEvent = new MouseEvent("mousemove", {
        clientX: mouseX,
        clientY: mouseY,
        bubbles: true,
      });
      window.dispatchEvent(mouseMoveEvent);
    }, 50);

    decrement(itemId);
  };

  const handleCloseDrawer = (e: React.MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    setTimeout(() => {
      const mouseMoveEvent = new MouseEvent("mousemove", {
        clientX: mouseX,
        clientY: mouseY,
        bubbles: true,
      });
      window.dispatchEvent(mouseMoveEvent);
    }, 50);

    setIsOpen(false);
  };

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative dark:text-white">
        <FaShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const itemCount = cartItems.reduce((count, item) => count + item.count, 0);

  const handleClearCart = () => {
    setCartItems([]);
    clearBasket();
  };

  return (
    <>
      <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTitle className="">
          <DrawerTrigger className="relative ">
            <div className="p-ripple flex focused items-center gap-2 hover:bg-elcar-opacity rounded-3xl bg-elcar-opacity w-max px-2 py-2 text-elcar text-sm font-medium ">
              <span className="max-md:hidden dark:text-primary-foreground">
                {t("cart")}
              </span>
              <MdOutlineShoppingCart className="h-6 w-6 dark:text-primary-foreground" />
              <CustomRipple />
            </div>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white dark:text-foreground">
                {itemCount}
              </span>
            )}
          </DrawerTrigger>
        </DrawerTitle>
        <DrawerContent className="h-full max-h-screen w-full sm:!w-[480px] max-sm:!w-[100%] !max-w-[100%] rounded-none">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold dark:text-white">
                  {t("cart")}
                </h2>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-sm">
                  {itemCount}
                </span>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-card focused dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-foreground flex items-center justify-center mb-4">
                    <FaShoppingCart className="h-8 w-8 text-gray-400 dark:text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1 dark:text-white">
                    {t("emptyCart")}
                  </h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item._id}
                      title={item.title}
                      price={item.price}
                      count={item.count}
                      image={item.image}
                      category={item.category}
                      handleDecrement={(e) => handleDecrement(item._id, e)}
                      handleIncrement={(e) => handleIncrement(item._id, e)}
                    />
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-card p-4 max-xxs:px-2  flex items-center justify-between">
                <div>
                  {/* clear basket */}
                  <Button
                    className="text-red-600 bg-red-500/40 hover:bg-red-500/50 rounded-3xl !px-6 max-xs:!px-2 max-xs:text-xs flex items-center justify-center hover:text-red-700"
                    onClick={handleClearCart}
                  >
                    <FaRegTrashCan />
                    {t("clear")}
                  </Button>
                </div>
                <div className="flex items-center gap-2 max-xxs:gap-1">
                  <p className="dark:text-secondary-foreground text-sm font-black text-nowrap max-xs:text-xs">
                    {total.toFixed(2)} AZN
                  </p>
                  <Button
                    onClick={() => {
                      setIsOrderModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-max bg-elcar rounded-3xl text-white hover:bg-elcar/80 max-xs:text-xs"
                  >
                    {t("confirmOrder")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <OrderCheckoutModal
        open={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        products={cartItems}
      />
    </>
  );
}
