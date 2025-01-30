<template>
  <SelectRoot v-model="v">
    <div class="flex items-center">
    <PButton
      class="arrow-button"
      unstyled
    >
      <Icon icon="lucide:chevron-left" class="shrink-0" />
    </PButton>
    <SelectTrigger
      class="inline-flex h-[35px] min-w-[160px] items-center justify-between gap-[5px] rounded border border-surface-950/45 px-[15px] text-[13px] leading-none shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
      aria-label="Customise options"
    >
      <SelectValue placeholder="Elige una carrera..." />
      <Icon icon="radix-icons:chevron-down" class="h-3.5 w-3.5" />
    </SelectTrigger>
    <PButton
      class="arrow-button"
      unstyled
    >
      <Icon icon="lucide:chevron-right" class="shrink-0" />
    </PButton>
    </div>

    <SelectPortal>
      <SelectContent
        class="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100] min-w-[160px] rounded bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
        :side-offset="5"
      >
        <SelectScrollUpButton
          class="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white"
        >
          <Icon icon="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="p-[5px]">
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              class="data-[disabled]:text-mauve8 data-[highlighted]:bg-green9 data-[highlighted]:text-green1 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none"
              :value="option"
            >
              <SelectItemIndicator
                class="absolute left-0 inline-flex w-[25px] items-center justify-center"
              >
                <Icon icon="radix-icons:check" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>

        <SelectScrollDownButton
          class="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white"
        >
          <Icon icon="radix-icons:chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import CButton from '~/components/primitives/button/CButton.vue'

const v = ref('')
const props = defineProps<{
  options: string[]
}>()
</script>
<style lang="postcss" scoped>
.arrow-button {
    @apply inline-flex select-none items-center justify-center gap-x-2 rounded-lg border border-surface-950/45 bg-transparent px-1.5 py-2 font-semibold shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition duration-75 ease-out text-color focus:bg-surface-50/20 focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-x-0 active:translate-y-0 active:shadow-none dark:focus:bg-surface-600/40 mr-1 ml-1
}
</style>
