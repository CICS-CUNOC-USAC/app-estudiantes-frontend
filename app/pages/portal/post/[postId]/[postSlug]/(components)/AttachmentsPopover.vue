<template>
  <PopoverRoot v-if="attachments?.length">
    <PopoverTrigger class="" aria-label="Adjuntos" as-child>
      <CButton icon="lucide:file" variant="link" label="Ver adjuntos" class="outline-none"/>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="10"
        class="w-full rounded-xl bg-white p-4 shadow-md dark:bg-neutral-900 border-black border ml-5"
      >
        <div>
          <h3 class="text-lg font-medium">Adjuntos</h3>
          <ul class="mt-2">
            <li class="items flex group mt-1.5" v-for="attachment in attachments">
              <a
                :href="attachment.url"
                target="_blank"
                class="flex items-center gap-x-2"
              >
                <Icon name="lucide:external-link" class="text-muted-color group-hover:text-primary-500" />
                <span
                  class="text-sm font-medium group-hover:text-primary-500"
                >{{ attachment.title }}</span>
              </a>
            </li>
          </ul>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue';

defineProps<{
  attachments: {
    title?: string
    url: string
  }[]
}>()
</script>
<style lang="postcss" scoped></style>
