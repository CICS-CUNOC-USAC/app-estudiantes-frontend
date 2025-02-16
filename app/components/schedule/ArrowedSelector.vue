<template>
  <SelectRoot
    v-model="selection"
    class=""
    @update:model-value="
      ($event) => {
        if ($event) {
          selection = $event
          $emit('update:selectedOption', $event)
        }
      }
    "
  >
    <div class="flex h-9 items-center">
      <PButton
        class="arrow-button rounded-s-lg"
        unstyled
        pt:label:class="hidden"
        @click="prevOption"
      >
        <template #icon>
          <Icon icon="icon-park-outline:left" class="shrink-0" />
        </template>
      </PButton>
      <SelectTrigger
        class="flex h-full min-w-44 items-center justify-between bg-zinc-100 dark:bg-surface-700 px-2.5 text-xs"
        aria-label="Customise options"
      >
        <SelectValue placeholder="Elige una carrera..." />
        <Icon icon="icon-park-outline:down" class="h-3.5 w-3.5" />
      </SelectTrigger>
      <PButton
        class="arrow-button rounded-e-lg"
        unstyled
        pt:label:class="hidden"
        @click="nextOption"
      >
        <template #icon>
          <Icon icon="icon-park-outline:right" class="shrink-0" />
        </template>
      </PButton>
    </div>

    <SelectPortal>
      <SelectContent
        class="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100] min-w-[160px] rounded bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
        position="popper"
      >
        <SelectScrollUpButton
          class="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white"
        >
          <Icon icon="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="p-[5px] dark:bg-surface-600">
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              class="
              dark:bg-surface-600
              data-[disabled]:text-mauve8
              data-[highlighted]:bg-surface-100
              data-[highlighted]:text-green1
              data-[highlighted]:outline-none
              data-[disabled]:pointer-events-none

              dark:data-[disabled]:text-mauve8
              dark:data-[highlighted]:bg-surface-700
              dark:data-[highlighted]:text-green1
              dark:data-[highlighted]:outline-none
              relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px]
              leading-none
              "
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

const props = defineProps<{
  options: string[]
  defaultValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:selectedOption': [value: any]
}>()

const selection = ref(props.defaultValue)

function prevOption() {
  const actualIndex = props.options.indexOf(selection.value)
  if (actualIndex === 0) {
    selection.value = props.options.at(props.options.length - 1)!
  } else {
    selection.value = props.options.at(actualIndex - 1)!
  }
  emit('update:selectedOption', selection.value)
}
function nextOption() {
  const actualIndex = props.options.indexOf(selection.value)
  if (actualIndex === props.options.length - 1) {
    selection.value = props.options.at(0)!
  } else {
    selection.value = props.options.at(actualIndex + 1)!
  }
  emit('update:selectedOption', selection.value)
}
</script>
<style scoped>
@reference '~/assets/css/main.css';
.arrow-button {
  @apply ml-1 mr-1 inline-flex h-full select-none items-center justify-center gap-x-2 border-surface-950/45 bg-zinc-100 dark:bg-surface-700 px-1.5 py-2 font-semibold transition duration-75 ease-out text-color focus:bg-surface-50/20 focus-visible:ring-1 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-x-0 active:translate-y-0 active:shadow-none dark:focus:bg-surface-600/40;
}
</style>
