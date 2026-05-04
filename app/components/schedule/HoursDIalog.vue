<template>
  <Dialog v-model:open="dialog">
    <DialogTrigger as-child class="lg:hidden text-sm">
      <Button variant="tonal" class="h-full" icon="tabler:calendar-week" size="small" label="Periodos" />
    </DialogTrigger>
    <DialogContent class="p-0 flex justify-center" :show-close-button="false">
      <DisplayModeSelector
        :model-value="scheduleType"
        :classrooms="classrooms"
        :hours="availableHours || []"
        :selection="selectedHours"
        @update:selected-periods="(val: Hour[]) => emit('update:selectedPeriods', val)"
        @update:model-value="(val) => emit('updateModelValue', val)"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import DisplayModeSelector from '~/components/schedule/DisplayModeSelector.vue'
import Button from '~/components/ui/button/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '~/components/ui/dialog'
import type { Classroom, Hour } from '~/utils/types/schedule-courses'

const props = defineProps<{
  scheduleType: 'calendar' | 'classroom'
  classrooms: Classroom[] | null
  availableHours: Hour[]
  selectedHours: Hour[]
}>()

const dialog = ref(false)

const emit = defineEmits(['update:selectedPeriods', 'updateModelValue'])
</script>

<style lang="postcss" scoped>
.course-details {
  grid-template-areas:
    'name name career'
    'desc desc hours'
    'desc desc hours'
    'desc desc room'
    'btn btn-s room';
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  @apply grid h-52 w-full gap-4;
}

.course-header {
  grid-area: name;
}

.course-career {
  grid-area: career;
}

.course-description {
  grid-area: desc;
}

.course-hours {
  grid-area: hours;
}

.course-room {
  grid-area: room;
}

.course-button {
  grid-area: btn;
}
.course-button-s {
  grid-area: btn-s;
}
</style>
