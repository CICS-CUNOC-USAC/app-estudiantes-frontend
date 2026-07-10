import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex select-none items-center justify-center font-semibold transition duration-75 ease-out outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        tonal:
          "bg-primary/30 text-black dark:text-white border-none shadow-none hover:bg-primary/40 focus:text-white focus:bg-primary/90",
        text: "bg-transparent text-current shadow-none hover:bg-primary-500/20 active:border-black active:bg-primary-500/70 active:text-white",
        link: "gap-x-1 bg-transparent p-0 shadow-none text-color hover:underline",
      },
      size: {
        "default": "text-sm",
        "small": "text-xs",
        "large": "text-sm",
        "sm": "text-xs",
        "lg": "text-sm",
        "icon": "size-10 p-0 text-sm",
        "icon-sm": "size-8 p-0 text-xs",
        "icon-lg": "size-10 p-0 text-sm",
      },
      severity: {
        default: "",
        danger: "bg-red-600 hover:bg-red-500",
        success: "bg-green-600 hover:bg-green-500",
        warn: "bg-yellow-600 hover:bg-yellow-500",
        info: "bg-blue-600 hover:bg-blue-500",
        secondary: "bg-zinc-600 hover:bg-zinc-500",
      },
      outlined: {
        true: "bg-transparent text-muted-color-emphasis focus:bg-surface-50/20 dark:focus:bg-surface-600/40 dark:border-white",
        false: "shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
      },
      iconPos: {
        left: "flex-row",
        right: "flex-row-reverse",
        top: "flex-col gap-y-1",
        bottom: "flex-col-reverse gap-y-1",
      },
      rounded: {
        true: "rounded-lg",
        false: "rounded-none",
      },
      fluid: {
        true: "w-full",
        false: "",
      },
      loading: {
        true: "pointer-events-none opacity-90",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        class: "border-2 border-black",
      },
      {
        variant: ["tonal", "text", "link"],
        outlined: false,
        class: "shadow-none",
      },
      {
        variant: "default",
        outlined: false,
        class: "text-white",
      },
      {
        variant: "default",
        outlined: false,
        severity: "default",
        class: "bg-primary-600 hover:bg-primary-500 focus:bg-primary-600/85",
      },
      {
        variant: ["link"],
        severity: ["danger", "success", "warn", "info", "secondary"],
        class: "bg-transparent hover:bg-transparent",
      },
      {
        variant: ["text"],
        severity: ["danger", "success", "warn", "info", "secondary"],
        class: "bg-transparent",
      },
      {
        variant: ["tonal"],
        severity: "danger",
        class: "bg-red-600/15 text-red-900 hover:bg-red-600/25 focus:bg-red-600 focus:text-white dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30",
      },
      {
        variant: ["tonal"],
        severity: "success",
        class: "bg-green-600/15 text-green-900 hover:bg-green-600/25 focus:bg-green-600 focus:text-white dark:bg-green-500/20 dark:text-green-300 dark:hover:bg-green-500/30",
      },
      {
        variant: ["tonal"],
        severity: "warn",
        class: "bg-yellow-600/15 text-yellow-900 hover:bg-yellow-600/25 focus:bg-yellow-600 focus:text-white dark:bg-yellow-500/20 dark:text-yellow-300 dark:hover:bg-yellow-500/30",
      },
      {
        variant: ["tonal"],
        severity: "info",
        class: "bg-blue-600/15 text-blue-900 hover:bg-blue-600/25 focus:bg-blue-600 focus:text-white dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30",
      },
      {
        variant: ["tonal"],
        severity: "secondary",
        class: "bg-zinc-600/15 text-zinc-900 hover:bg-zinc-600/25 focus:bg-zinc-600 focus:text-white dark:bg-zinc-500/20 dark:text-zinc-300 dark:hover:bg-zinc-500/30",
      },
      {
        variant: ["text", "link"],
        severity: "danger",
        class: "text-red-800 dark:text-red-400",
      },
      {
        variant: ["text", "link"],
        severity: "success",
        class: "text-green-800 dark:text-green-400",
      },
      {
        variant: ["text", "link"],
        severity: "warn",
        class: "text-yellow-800 dark:text-yellow-400",
      },
      {
        variant: ["text", "link"],
        severity: "info",
        class: "text-blue-800 dark:text-blue-400",
      },
      {
        variant: ["text", "link"],
        severity: "secondary",
        class: "text-zinc-800 dark:text-zinc-400",
      },
      {
        variant: ["text"],
        severity: "danger",
        class: "hover:bg-red-500/20 active:bg-red-500/70",
      },
      {
        variant: ["text"],
        severity: "success",
        class: "hover:bg-green-500/20 active:bg-green-500/70",
      },
      {
        variant: ["text"],
        severity: "warn",
        class: "hover:bg-yellow-500/20 active:bg-yellow-500/70",
      },
      {
        variant: ["text"],
        severity: "info",
        class: "hover:bg-blue-500/20 active:bg-blue-500/70",
      },
      {
        variant: ["text"],
        severity: "secondary",
        class: "hover:bg-zinc-500/20 active:bg-zinc-500/70",
      },
      {
        variant: ["default", "tonal", "text"],
        size: ["default", "large", "lg"],
        class: "gap-x-2 px-3.5 py-1.5",
      },
      {
        variant: ["default", "tonal", "text"],
        size: ["small", "sm"],
        class: "gap-x-1 px-2.5 py-1",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "large",
      severity: "default",
      outlined: false,
      iconPos: "left",
      rounded: true,
      fluid: false,
      loading: false,
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
