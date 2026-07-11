<template>
  <Alert :variant="variant">
    <Icon v-if="icon" :name="icon" />
    <AlertTitle>{{ title }}</AlertTitle>
    <AlertDescription>
      <p>{{ subtitle }}</p>
      <Button
        v-if="backToLabel && backToRoute"
        class="mt-2"
        :label="backToLabel"
        variant="link"
        icon="icon-park-outline:arrow-left"
        :to="backToRoute"
      />
    </AlertDescription>
  </Alert>
</template>
<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import { Alert, AlertTitle, AlertDescription, type AlertVariants } from '~/components/ui/alert'

withDefaults(defineProps<{
  title: string
  subtitle?: string
  icon?: string
  backToLabel?: string
  backToRoute?: string
  variant?: AlertVariants["variant"]
}>(), {
  variant: "default",
  icon: "icon-park-twotone:info",
})
</script>
<style scoped></style>
