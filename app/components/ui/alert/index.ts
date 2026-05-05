import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertTitle } from './AlertTitle.vue'

export const alertVariants = cva(
  'relative w-full border-surface-950/75 dark:border-surface-700/50 rounded-lg border-2 px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-rose-100 dark:bg-rose-900/75 border-rose-400 dark:border-rose-600 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
        warning:
          'text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/75 border-yellow-400 dark:border-yellow-500 [&>svg]:text-current *:data-[slot=alert-description]:text-yellow-800/90 dark:*:data-[slot=alert-description]:text-yellow-300/70',
        success:
          'text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-900/75 border-green-400 dark:border-green-500 [&>svg]:text-current *:data-[slot=alert-description]:text-green-800/90 dark:*:data-[slot=alert-description]:text-green-300/70',
        info: 'text-blue-800 bg-blue-100 dark:text-indigo-200 dark:bg-blue-900/75 border-blue-400 dark:border-blue-500 [&>svg]:text-current *:data-[slot=alert-description]:text-blue-800/90 dark:*:data-[slot=alert-description]:text-blue-300/70'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export type AlertVariants = VariantProps<typeof alertVariants>
