<template>
  <Card
    :to="to"
    class="h-full transition duration-250 ease-in-out"
    :class="{
      'hover:bg-surface-100 dark:hover:bg-surface-900 hover:translate-x-0 hover:translate-y-0 hover:shadow-none':
        interactive,
      'cursor-pointer': to,
      'shadow-[2px_2px_0_0_rgba(0,0,0,1)]': elevated || interactive,
      'dark:hover:shadow-surface-700 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:-translate-x-0 active:-translate-y-0 dark:hover:shadow-[2px_2px_0_0]':
        interactiveInverse
    }"
  >
    <CardHeader
      class="flex flex-col gap-2"
      v-if="title || description"
      :class="{
        'flex-1': !$slots.content
      }"
    >
      <Icon v-if="headerIcon" :name="headerIcon" />
      <CardTitle class="font-heading text-lg font-semibold">{{
        title
      }}</CardTitle>
      <CardDescription v-if="description">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="flex-1" v-if="$slots.content">
      <slot name="content"> </slot>
    </CardContent>
    <CardFooter
      class="flex flex-col items-start gap-2 justify-self-end"
      v-if="small || $slots.footer"
    >
      <span
        class="text-muted-foreground block text-xs font-light tracking-tight"
      >
        <Icon
          v-if="smallIcon"
          :name="smallIcon"
          class="mr-1 inline-block text-sm"
        />
        {{ small }}
      </span>
      <slot name="footer"> </slot>
    </CardFooter>
  </Card>
</template>
<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
defineProps<{
  elevated?: boolean
  interactive?: boolean
  interactiveInverse?: boolean
  title?: string
  description?: string
  to?: string
  small?: string
  smallIcon?: string
  headerIcon?: string
  noSpacing?: boolean
  unstyled?: boolean
}>()
</script>
<style lang="postcss" scoped></style>
