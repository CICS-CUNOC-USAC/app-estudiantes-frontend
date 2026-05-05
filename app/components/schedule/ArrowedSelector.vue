<template>
  <Select
    v-model="selection"
    class=""
    @update:model-value="
      ($event) => {
        if ($event) {
          selection = $event as string
          $emit('update:selectedOption', $event)
        }
      }
    "
  >
    <div class="flex h-9 items-center">
      <Button
        class="arrow-button rounded-s-lg"
        variant="text"
        @click="prevOption"
      >
          <Icon name="icon-park-outline:left" class="shrink-0" />
      </Button>
      <SelectTrigger
        class="dark:bg-surface-700 flex h-full min-w-44 items-center justify-between bg-zinc-100 px-2.5 text-xs"
      >
        <SelectValue placeholder="Elige una carrera..." />
      </SelectTrigger>
      <Button
        class="arrow-button rounded-e-lg"
        variant="text"
        @click="nextOption"
      >
          <Icon name="icon-park-outline:right" class="shrink-0" />
      </Button>
    </div>

    <SelectContent position="popper">
      <SelectGroup>
        <SelectItem
          v-for="(option, index) in options"
          :key="index"
          :value="option"
        >
          {{ option }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { Button } from '../ui/button';

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
  @apply border-surface-950/45 dark:bg-surface-700 text-color focus:bg-surface-50/20 focus-visible:ring-primary-500/50 dark:focus:bg-surface-600/40 mr-1 ml-1 inline-flex h-full items-center justify-center gap-x-2 bg-zinc-100 px-1.5 py-2 font-semibold transition duration-75 ease-out select-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-x-0 active:translate-y-0 active:shadow-none;
}
</style>
