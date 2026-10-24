import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:pointer-events-none",

  variants: {
    variant: {
      primary:
        "h-12 w-full gap-2 rounded-lg bg-blue-base px-5 text-md font-semibold text-white hover:bg-blue-dark",
      secondary:
        "h-8 gap-1.5 rounded-sm border border-transparent bg-gray-200 px-2 text-sm font-semibold text-gray-500 hover:border-blue-base",
      icon: "size-8 rounded-sm border border-transparent bg-gray-200 text-gray-600 hover:border-blue-base",
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

export function Button({
  variant,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, className })}
      {...props}
    />
  );
}
