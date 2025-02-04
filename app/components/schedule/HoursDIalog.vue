<template>
  <CDialog v-model:open="dialog">
    <CDialogTrigger
      class="text-left text-sm hover:underline hover:underline-offset-2 focus:underline focus:outline-none"
    >
    <CButton icon="tabler:calendar-week" size="small"/>
    </CDialogTrigger>
    <CDialogContent title="" class="p-0 flex justify-center">
      <DisplayModeSelector
        :model-value="scheduleType"
        :classrooms="classrooms"
        :hours="availableHours || []"
        :selection="selectedHours"
        @update:selected-periods="
          (val: Hour[]) => {
            emit('update:selectedPeriods', val)
          }
        "
        @update:model-value="
          (val) => {
            emit('updateModelValue', val)
          }
        "
      />
    </CDialogContent>
  </CDialog>
</template>
<script setup lang="ts">
import DisplayModeSelector from '~/components/schedule/DisplayModeSelector.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import {
  CDialog,
  CDialogContent,
  CDialogTrigger
} from '~/components/primitives/dialog'
import type { Classroom, Hour } from '~/utils/types/schedule-courses';

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
