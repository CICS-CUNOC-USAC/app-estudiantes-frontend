<template>
  <Transition name="fade-and-slide-up" appear>
    <div v-if="isVisible" class="relative w-full py-2.5 pr-10 pl-4 text-sm sm:px-12 sm:py-3"
      :class="[MAPPED_ALERT_TYPES[data!.data.type].color]">
      <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <span class="inline-flex items-center gap-2">
          <Icon :name="MAPPED_ALERT_TYPES[data!.data.type].icon" class="shrink-0 text-base" />
          <span>{{ data!.data.title }}</span>
        </span>
        <Dialog v-if="data?.data.active_details">
          <DialogTrigger as-child>
            <button type="button" class="font-medium underline underline-offset-2 transition hover:opacity-80">
              Más información
            </button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-2xl">
            <StrapiBlocks :content="data!.data.details" />
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="text">
                  Entendido
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <button type="button"
        class="absolute top-2 right-2 rounded-md p-1 opacity-60 transition hover:opacity-100 sm:top-1/2 sm:right-4 sm:-translate-y-1/2"
        aria-label="Cerrar alerta" @click="dismiss">
        <Icon name="icon-park-outline:close" />
      </button>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
import type { CurrentAlert, SingleTypeResponse } from '~/lib/api/strapi/types'
import { MAPPED_ALERT_TYPES } from '~/lib/api/strapi/types'
import { Button } from '../ui/button'

const { data } = await useAsyncData<SingleTypeResponse<CurrentAlert>>('current-alert', () => $strapi('/alerta-actual'), {
  lazy: true,
})

// Keyed by `updatedAt` so a dismissed alert stays hidden until it's edited/republished.
const dismissedAlertKey = useLocalStorage<string | null>('current-alert-dismissed', null)

const alertKey = computed(() => data.value?.data ? data.value.data.updatedAt : null)

const isVisible = computed(() =>
  Boolean(data.value?.data.active) && alertKey.value !== dismissedAlertKey.value
)

function dismiss() {
  dismissedAlertKey.value = alertKey.value
}
</script>
<style scoped>
@reference '~/assets/css/main.css';

.fade-and-slide-up-enter-active,
.fade-and-slide-up-leave-active {
  @apply overflow-hidden transition-all duration-500 ease-[cubic-bezier(0,-0.01,0,1.01)];
}

.fade-and-slide-up-enter-from,
.fade-and-slide-up-leave-to {
  @apply h-0 py-0 -translate-y-8 opacity-0;
}

.fade-and-slide-up-enter-to,
.fade-and-slide-up-leave-from {
  @apply max-h-28 translate-y-0 opacity-100;
}
</style>
