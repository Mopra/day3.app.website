import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        outline:
          "border border-border bg-card text-foreground hover:bg-secondary/60",
        ghost: "text-foreground hover:bg-secondary/60",
        link: "text-foreground underline-offset-4 hover:text-accent hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        default: "h-10 px-5",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Replace the rendered element (e.g. an anchor) — Base UI render prop. */
  render?: useRender.RenderProp;
}

function Button({
  className,
  variant,
  size,
  render,
  type,
  ...props
}: ButtonProps) {
  const defaultRender = render ?? <button type={type ?? "button"} />;

  return useRender({
    render: defaultRender,
    props: {
      className: cn(buttonVariants({ variant, size }), className),
      ...props,
    },
  });
}

export { Button, buttonVariants };
