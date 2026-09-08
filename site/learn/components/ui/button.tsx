import { cva } from "class-variance-authority";

/**
 * Variant classes only — the site is link-based, so styles are applied to
 * <a> elements via cn(buttonVariants({...})). No wrapper component needed.
 */
export const buttonVariants = cva(
   // No `focus-visible:outline-none` here. It used to sit in this string, and
  // because a utility beats the `a:focus-visible, button:focus-visible` rule
  // in globals.css @layer base, it silently removed the site's own focus ring
  // from every control wearing these classes — the hero CTA, all thirty copy
  // chips and the invocation block's copy button. Keyboard users had no
  // indication of where they were (WCAG 2.4.7). Dropping it lets the base
  // rule apply, so these controls focus exactly like every other link.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-background hover:bg-secondary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
