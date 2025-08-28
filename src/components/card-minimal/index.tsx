import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

// Define card variants using cva for consistent styling options
const cardVariants = cva(
  "relative rounded-xl bg-background text-foreground transition-all duration-300 ease-out overflow-hidden",
  {
    variants: {
      variant: {
        default: [
          "border border-border/40",
          "bg-background/95 backdrop-blur-sm",
          "shadow-sm hover:shadow-md",
          "hover:border-border/80",
        ],
        glass: [
          "bg-background/60 backdrop-blur-md",
          "border border-border/30",
          "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
          "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "hover:border-border/50",
        ],
        lifted: [
          "border border-border/40",
          "bg-background/95",
          "shadow-[0px_2px_0px_0px_rgba(0,0,0,0.1)]",
          "dark:shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)]",
          "hover:translate-y-[-2px]",
          "hover:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)]",
          "dark:hover:shadow-[0px_4px_0px_0px_rgba(255,255,255,0.1)]",
        ],
        neubrutalism: [
          "border-2 border-foreground/80",
          "bg-background",
          "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]",
          "dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]",
          "hover:translate-x-[-2px] hover:translate-y-[-2px]",
          "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]",
          "dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MinimalCardProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  children?: React.ReactNode;
  href?: string;
}

const MinimalCard = React.forwardRef<HTMLDivElement, MinimalCardProps>(
  ({ className, children, href, variant, ...props }, ref) => {
    const content = (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={cn(cardVariants({ variant }), className)}
        {...props}
      >
        {children}
      </motion.div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
  }
);
MinimalCard.displayName = "MinimalCard";

interface MinimalCardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  animationData: Record<string, unknown>;
  href?: string;
  alt?: string;
}

const MinimalCardImage = React.forwardRef<
  HTMLDivElement,
  MinimalCardImageProps
>(({ className, animationData, href, alt = "Animation", ...props }, ref) => {
  const content = (
    <div
      ref={ref}
      className={cn(
        "relative h-[200px] w-full rounded-t-xl overflow-hidden",
        className
      )}
      {...props}
    >
      <Lottie
        animationData={animationData}
        className="object-cover absolute h-full w-full inset-0"
        loop={true}
        aria-label={alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
});
MinimalCardImage.displayName = "MinimalCardImage";

const MinimalCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight mt-4 px-5 text-foreground",
      className
    )}
    {...props}
  />
));
MinimalCardTitle.displayName = "MinimalCardTitle";

const MinimalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground leading-relaxed mt-2 px-5",
      className
    )}
    {...props}
  />
));
MinimalCardDescription.displayName = "MinimalCardDescription";

const MinimalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
MinimalCardContent.displayName = "MinimalCardContent";

const MinimalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between px-5 py-4 border-t border-border/30",
      className
    )}
    {...props}
  />
));
MinimalCardFooter.displayName = "MinimalCardFooter";

export {
  MinimalCard,
  MinimalCardImage,
  MinimalCardTitle,
  MinimalCardDescription,
  MinimalCardContent,
  MinimalCardFooter,
};

export default MinimalCard;
