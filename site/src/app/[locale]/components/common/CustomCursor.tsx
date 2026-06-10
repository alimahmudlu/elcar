"use client";
import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useDrawerStore } from "@/lib/drawerStore";

interface CursorSize {
  width: number;
  height: number;
}

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [cursorSize, setCursorSize] = useState<CursorSize>({
    width: 40,
    height: 40,
  });
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const { isOpen: isDrawerOpen } = useDrawerStore();

  const resetCursor = (mouseX?: number, mouseY?: number) => {
    setIsHovering(false);
    setHoveredElement(null);
    setCursorSize({ width: 40, height: 40 });
    
    if (mouseX !== undefined && mouseY !== undefined) {
      cursorX.set(mouseX - 20);
      cursorY.set(mouseY - 20);
    }
  };

  useEffect(() => {
    if (isDrawerOpen && isHovering) {
      resetCursor();
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("focused")) {
        setIsHovering(true);
        setHoveredElement(target);

        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        setCursorSize({
          width: rect.width + 10,
          height: rect.height + 10,
        });

        cursorX.set(centerX - (rect.width + 10) / 2);
        cursorY.set(centerY - (rect.height + 10) / 2);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("focused")) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        resetCursor(mouseX, mouseY);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("focused")) {
        // Reset cursor on click to prevent it from staying focused
        setTimeout(() => {
          resetCursor(e.clientX, e.clientY);
        }, 100);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isHovering && hoveredElement) {
        // Check if the hovered element still exists in DOM
        if (!document.contains(hoveredElement)) {
          resetCursor(e.clientX, e.clientY);
          return;
        }

        const rect = hoveredElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        cursorX.set(centerX - cursorSize.width / 2);
        cursorY.set(centerY - cursorSize.height / 2);
      } else {
        cursorX.set(e.clientX - cursorSize.width / 2);
        cursorY.set(e.clientY - cursorSize.height / 2);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      // Reset cursor on any click outside focused elements
      const target = e.target as HTMLElement;
      if (!target.classList.contains("focused") && isHovering) {
        resetCursor(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("click", handleGlobalClick);

    const addEventListeners = (element: Element) => {
      element.addEventListener("mouseenter", handleMouseEnter as EventListener);
      element.addEventListener("mouseleave", handleMouseLeave as EventListener);
      element.addEventListener("click", handleClick as EventListener);
    };

    const removeEventListeners = (element: Element) => {
      element.removeEventListener("mouseenter", handleMouseEnter as EventListener);
      element.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      element.removeEventListener("click", handleClick as EventListener);
    };

    // Add listeners to existing focused elements
    const focusedElements = document.querySelectorAll(".focused");
    focusedElements.forEach(addEventListeners);

    // Observer for new focused elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Handle added nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.classList.contains("focused")) {
              addEventListeners(element);
            }
            // Check child elements
            const focusedChildren = element.querySelectorAll(".focused");
            focusedChildren.forEach(addEventListeners);
          }
        });

        // Handle removed nodes
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.classList.contains("focused")) {
              removeEventListeners(element);
              // If this was the hovered element, reset cursor
              if (hoveredElement === element) {
                resetCursor();
              }
            }
            // Check child elements
            const focusedChildren = element.querySelectorAll(".focused");
            focusedChildren.forEach((child) => {
              removeEventListeners(child);
              if (hoveredElement === child) {
                resetCursor();
              }
            });
          }
        });

        // Handle attribute changes (class changes)
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const target = mutation.target as Element;
          if (target.classList.contains("focused")) {
            addEventListeners(target);
          } else {
            removeEventListeners(target);
            if (hoveredElement === target) {
              resetCursor();
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("click", handleGlobalClick);
      
      focusedElements.forEach(removeEventListeners);
      observer.disconnect();
    };
  }, [cursorX, cursorY, cursorSize, isHovering, hoveredElement]);

  useEffect(() => {
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999999] rounded-full border-[0.5px] border-gray-400 custom-cursor max-lg:hidden"
        style={{
          x: cursorX,
          y: cursorY,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          width: cursorSize.width,
          height: cursorSize.height,
          borderColor: "#9ca3af",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          duration: 0.4,
        }}
      />

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999999] rounded-full bg-gray-400 custom-cursor max-lg:hidden"
        style={{
          x: cursorX,
          y: cursorY,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          width: isHovering ? 0 : 10,
          height: isHovering ? 0 : 10,
          backgroundColor: isHovering ? "transparent" : "#9ca3af",
          left: isHovering ? cursorSize.width / 2 : cursorSize.width / 2 - 5,
          top: isHovering ? cursorSize.height / 2 : cursorSize.height / 2 - 5,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          duration: 0.4,
        }}
      />
    </>
  );
};

export default CustomCursor;
