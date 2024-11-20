<template>
  <main>
    <NuxtLoadingIndicator :throttle="130" :height="4" color="var(--p-primary-400)" />
    <NuxtLayout />
    <Toaster
      position="top-center"
      :close-button="false"
      :toast-options="{
        unstyled: true,
        duration: 3000,
        classes: {
          toast:
            'w-full py-2 text-sm px-3 border border-black/85 rounded-lg text-current font-sans flex items-center gap-3 shadow-lg',
          default: 'dark:bg-surface-800 bg-surface-50',
          description: 'text-gray-500 text-sm',
          warning: 'dark:bg-yellow-600 dark:text-yellow-100 bg-yellow-200 text-yellow-800',
          error: 'dark:bg-red-600 dark:text-red-100 bg-red-200 text-red-800',
          info: 'dark:bg-sky-600 dark:text-sky-100 bg-sky-200 text-sky-800',
          success: 'dark:bg-green-600 dark:text-green-100 bg-green-200 text-green-800',
          closeButton: 'dark:!bg-surface-800 !text-surface-50 !border-black/85 !text-color',
        }
      }"
    >
      <template #error-icon>
        <Icon name="lucide:alert-triangle" />
      </template>
      <template #info-icon>
        <Icon name="lucide:info" />
      </template>
      <template #success-icon>
        <Icon name="lucide:check" />
      </template>
      <template #warning-icon>
        <Icon name="lucide:alert-circle" />
      </template>
    </Toaster>
    <!-- w-full px-4 py-3 rounded-md !font-normal text-sm bg-white !border shadow -->
    <!-- <GeneralSnackbar /> -->
  </main>
</template>
<script lang="ts" setup>
import { Toaster } from 'vue-sonner'

// import { useTheme } from 'vuetify'
// import { useConfigsStore } from '~/stores/config'
// import GeneralSnackbar from './components/partials/GeneralSnackbar.vue'

// const vTheme = useTheme()
// const { theme } = storeToRefs(useConfigsStore())
// const currentTheme = computed(() => {
//   return vTheme.computedThemes.value[theme.value]
// })

// const bgColor = computed(() => {
//   return currentTheme.value.dark ? '#121212' : '#fff'
// })

// const loadingColor = computed(() => {
//   return currentTheme.value.dark ? '#fff' : '#121212'
// })

// useHead({
//   // Title template, if titleChunk is defined in a page, it will be injected into the template
//   titleTemplate: (titleChunk) => {
//     return titleChunk
//       ? `${titleChunk} ∙ Ing App CUNOC`
//       : 'CUNOC ∙ Ingenieria App'
//   }
// })
</script>
<style lang="postcss">
:root {
  @apply bg-white dark:bg-neutral-800;
}

/* Common animations */
.mask-enter {
  animation: maskFade 0.2s ease-in-out forwards;
}

.mask-leave {
  animation: maskFadeReverse 0.2s ease-in-out forwards;
}

@keyframes maskFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes maskFadeReverse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.slide-enter-active,
.slide-leave-active {
  @apply transition-all duration-500 ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  @apply -translate-x-32 opacity-0;
}

.slide-enter-to,
.slide-leave-from {
  @apply translate-x-0 opacity-100;
}



.fade-slide-enter-active {
  @apply transition-all duration-[400ms] delay-75 ease-in-out;
}

.fade-slide-leave-active {
  @apply transition-all duration-[400ms] ease-in-out absolute right-12;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  @apply mr-0 w-0 opacity-0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  @apply mr-2 w-64 opacity-100;
}
/* Common animations */


</style>
<style lang="scss">
/*
Styles used for page and layout transitions - Start
*-active classes control the transition duration and timing function
*-to and *-from classes control the transition state
*/
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-in-out;
}
.page-leave-to,
.page-enter-from {
  opacity: 0;
  transform: translateX(0.5rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s ease-in-out;
}

.layout-leave-to,
.layout-enter-from {
  opacity: 0;
  transform: translateX(0.5rem);
}
/*
Styles used for page and layout transitions - End
*/
@import '@/assets/styles/main.scss';
</style>
