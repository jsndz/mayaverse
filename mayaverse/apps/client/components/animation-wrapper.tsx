"use client";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimationWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "staggered"
    | "staggeredFast";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

export default function AnimationWrapper({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  amount = 0.3,
  ...props
}: AnimationWrapperProps) {
  const getAnimationProps = (): MotionProps => {
    const baseProps = {
      initial: "hidden",
      whileInView: "visible",
      viewport: { once },
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    };

    switch (animation) {
      case "fadeIn":
        return {
          ...baseProps,
          variants: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          },
        };
      case "slideUp":
        return {
          ...baseProps,
          variants: {
            hidden: { y: 50, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          },
        };
      case "slideLeft":
        return {
          ...baseProps,
          variants: {
            hidden: { x: 50, opacity: 0 },
            visible: { x: 0, opacity: 1 },
          },
        };
      case "staggered":
        return {
          ...baseProps,
          transition: {
            duration,
            delay,
            staggerChildren: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          },
          variants: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          },
        };
      case "staggeredFast":
        return {
          ...baseProps,
          transition: {
            duration,
            delay,
            staggerChildren: 0.05,
            ease: [0.25, 0.1, 0.25, 1],
          },
          variants: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          },
        };
      default:
        return baseProps;
    }
  };

  return (
    <motion.div
      className={cn(className)}
      {...getAnimationProps()}
      {...(props as React.HTMLAttributes<HTMLDivElement> & MotionProps)}
    >
      {children}
    </motion.div>
  );
}

export function AnimationItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
