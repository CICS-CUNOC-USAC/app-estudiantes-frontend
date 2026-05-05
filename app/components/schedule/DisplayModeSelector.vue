<template>
  <nav class="flex w-80 flex-col gap-0 items-center self-center justify-self-center px-4 pt-4">
    <ToggleGroup
      variant="outline"
      :model-value="modelValue"
      @update:model-value="
        ($event) => emit('update:modelValue', $event as string)
      "
    >
      <ToggleGroupItem disabled value="calendar"> Calendario</ToggleGroupItem>
      <ToggleGroupItem value="classroom"> Salón</ToggleGroupItem>
    </ToggleGroup>
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
            class="dark:bg-surface-800 max-h-96 overflow-auto rounded-xl border border-gray-200 bg-white p-4"
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
        <Button
          icon="lucide:eraser"
          size="small"
          label="Limpiar"
          @click="cleanScheduleSelection"
        />
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
import { ListboxRoot, ListboxContent, ListboxItem } from 'reka-ui'
import type { Classroom, Hour } from '~/utils/types/schedule-courses'
import CInputText from '../primitives/form/CInputText.vue'
import Button from '~/components/ui/button/Button.vue'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'

let { classrooms, selection } = defineProps<{
  modelValue: 'calendar' | 'classroom'
  classrooms?: Classroom[] | null
  hours: Hour[]
  selection?: Hour[]
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

const selectedPeriods = ref<any>(selection || [])
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
