<template>
  <nav class="flex w-80 flex-col gap-0 self-start justify-self-start px-4 pt-4">
    <ToggleGroupRoot
      :model-value="modelValue"
      @update:model-value="
        ($event) => emit('update:modelValue', $event as string)
      "
      class="flex justify-center gap-2"
    >
      <ToggleGroupItem
        disabled
        value="calendar"
        class="data-[state=on]:bg-primary-500 cursor-not-allowed rounded-lg border-2 border-transparent px-2.5 py-0.5 transition active:translate-x-0.5 active:translate-y-0.5 data-[disabled]:bg-zinc-300/60 data-[disabled]:opacity-50 data-[disabled]:active:translate-x-0 data-[disabled]:active:translate-y-0 data-[state=on]:border-black data-[state=on]:font-medium data-[state=on]:text-white data-[state=on]:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
      >
        Calendario</ToggleGroupItem
      >
      <ToggleGroupItem
        value="classroom"
        class="data-[state=on]:bg-primary-500 rounded-lg border-2 border-transparent px-2.5 py-0.5 transition active:translate-x-0.5 active:translate-y-0.5 data-[state=on]:border-black data-[state=on]:font-medium data-[state=on]:text-white data-[state=on]:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
      >
        Salón</ToggleGroupItem
      >
    </ToggleGroupRoot>
    <Transition name="slide-view" mode="out-in">
      <ListboxRoot
        v-if="modelValue === 'classroom'"
        class="flex flex-col rounded-lg"
        :model-value="selectedPeriods"
        multiple
        @update:model-value="
          ($event) => {
            if ($event) {
              selectedPeriods = $event
              $emit('update:selectedPeriods', $event)
            }
          }
        "
      >
        <ListboxContent class="w-full overflow-auto px-2.5 py-4">
          <div
            class="max-h-96 overflow-auto rounded-xl border border-gray-200 bg-white p-4 dark:bg-surface-800"
          >
            <Icon name="icon-park-twotone:alarm-clock" class="mx-auto mb-1.5" />
            <p class="pb-4 text-center text-sm">
              Selecciona el periodo de tiempo que deseas visualizar en el
              horario
            </p>
            <ListboxItem
              v-for="period in hours"
              :key="period.start_time"
              :value="period"
              class="group hover:bg-surface-100 dark:hover:bg-surface-900 data-[state=checked]:bg-primary-300 relative mt-1 flex w-full cursor-pointer items-center rounded-lg py-2.5 leading-none transition outline-none select-none data-[disabled]:opacity-50"
            >
              <div class="mx-auto">
                <span class="group-data-[state=checked]:font-semibold">{{
                  period.start_time
                }}</span>
                -
                <span class="group-data-[state=checked]:font-semibold">{{
                  period.end_time
                }}</span>
              </div>
            </ListboxItem>
          </div>
        </ListboxContent>
        <CButton icon="lucide:eraser" size="small" label="Limpiar" @click="cleanScheduleSelection"/>
      </ListboxRoot>
      <div v-else>
        <ListboxRoot
          v-if="modelValue === 'calendar'"
          class="flex flex-col rounded-lg bg-white px-2.5"
        >
          <Icon name="icon-park-twotone:pull-door" class="mx-auto mb-1.5" />
          <p class="pb-4 text-center text-sm">
            Selecciona el salón de clases que deseas visualizar en el horario
          </p>
          <CInputText
            v-model="classroomSearch"
            label="Buscar salón"
            clear-button
            type="text"
            prepend-icon="lucide:search"
            no-borders
          />
          <ListboxContent class="w-full py-4">
            <div class="h-96 overflow-auto rounded-xl border p-1.5">
              <ListboxItem
                v-for="classroom in filteredClassrooms"
                :key="classroom.id"
                :value="classroom"
                class="group data-[state=checked]:bg-primary-300 relative flex w-full cursor-pointer items-center rounded-xl px-3.5 py-2.5 leading-none transition outline-none select-none data-[disabled]:opacity-50"
              >
                <div class="mx-auto">
                  <span class="group-data-[state=checked]:font-semibold">{{
                    classroom.name
                  }}</span>
                </div>
              </ListboxItem>
            </div>
          </ListboxContent>
        </ListboxRoot>
      </div>
    </Transition>
  </nav>
</template>
<script setup lang="ts">
import type { Classroom, Hour } from '~/utils/types/schedule-courses'
import CInputText from '../primitives/form/CInputText.vue'
import CButton from '~/components/primitives/button/CButton.vue'

let { classrooms } = defineProps<{
  modelValue: 'calendar' | 'classroom'
  classrooms?: Classroom[] | null
  hours: Hour[]
}>()

const classroomSearch = ref('')
const filteredClassrooms = computed(() =>
  classrooms?.filter((classroom) =>
    classroom.name.toLowerCase().includes(classroomSearch.value.toLowerCase())
  )
)

function cleanScheduleSelection() {
    selectedPeriods.value = []
    emit('update:selectedPeriods', selectedPeriods.value)
}

const selectedPeriods = ref<any>([])
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:selectedPeriods': [value: any]
}>()
</script>
<style scoped>
@reference '~/assets/css/main.css';

.slide-view-enter-active,
.slide-view-leave-active {
  @apply transition-all duration-200;
}

.slide-view-enter-from,
.slide-view-leave-to {
  @apply translate-x-4 opacity-0;
}
</style>
