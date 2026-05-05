<template>
  <Popover v-if="attachments?.length">
    <PopoverTrigger class="" aria-label="Adjuntos" as-child>
      <Button
        icon="lucide:file"
        variant="link"
        label="Ver adjuntos"
        class="outline-none"
      />
    </PopoverTrigger>
    <PopoverContent
      side="bottom"
      :side-offset="10"
      class="ml-5 w-full rounded-xl border border-black bg-white p-4 shadow-md dark:bg-neutral-900"
    >
      <div>
        <h3 class="text-lg font-medium">Adjuntos</h3>
        <ul class="mt-2">
          <li class="items group mt-1.5 flex" v-for="attachment in attachments">
            <a
              :href="attachment.url"
              target="_blank"
              class="flex items-center gap-x-2"
            >
              <Icon
                name="lucide:external-link"
                class="text-muted-color group-hover:text-primary-500"
              />
              <span class="group-hover:text-primary-500 text-sm font-medium">{{
                attachment.title
              }}</span>
            </a>
          </li>
        </ul>
      </div>
    </PopoverContent>
  </Popover>
</template>
<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '~/components/ui/popover'

defineProps<{
  attachments: {
    title?: string
    url: string
  }[]
}>()
</script>
<style lang="postcss" scoped></style>
