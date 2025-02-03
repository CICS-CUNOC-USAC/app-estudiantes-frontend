<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <button
        class="bg-primary-500 ring-primary-200 fixed right-10 bottom-10 rounded-full p-2.5 text-white transition hover:ring-2"
      >
        <Icon name="icon-park-twotone:help" />
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="data-[state=open]:animate-overlayShow fixed inset-0 z-30 bg-gray-950/50 transition-all duration-500"
      />
      <DialogContent
        class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-full max-h-[85vh] w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 pb-32 shadow-lg shadow-black/15 focus:outline-none lg:max-w-xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        <DialogTitle class="mb-4 flex items-center justify-between">
          <span class="text-xl font-semibold">
            <Icon
              name="icon-park-twotone:help"
              class="text-primary-400 mr-1.5 mb-0.5 inline-block"
            />
            {{ title }}
          </span>
          <DialogClose
            class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon name="lucide:x" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>
        <div class="h-full overflow-scroll pb-6 mb-4">
          <ContentRenderer v-if="data" :value="data" class="md-content" />
        </div>
        <DialogClose as-child>
          <CButton
            variant="tonal"
            label="Entendido"
            class="w-full"
          />

        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue';

const { contentPath } = defineProps<{
  title: string
  contentPath: string
}>()

const { data, status } = useAsyncData(() =>
  queryContent('help')
    .where({
      _path: { $contains: contentPath }
    })
    .findOne()
)
</script>
<style scoped></style>
