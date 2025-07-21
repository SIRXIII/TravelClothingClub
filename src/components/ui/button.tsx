import { ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";

const button = cva(
  "px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-black/80",
        ghost: "bg-transparent hover:bg-black/10",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);
export function Button({ variant, className, ...props }: any) {
  return <button className={button({ variant, className })} {...props} />;
} 