<template>
    <div>
        <div class="grid grid-cols-5">
            <div class="col-span-1 justify-self-center">
                <CButton class="h-min" label="Calendario" />
                <CButton class="h-min" label="Salon" />
            </div>
            <div class="col-span-4">
                <div class="grid grid-cols-1" v-if="!loadingHours && !loadingClassrooms && !loadingSchedules">
                    <div class="grid grid-cols-5">
                        <div class="col-span-1">
                            <CButton class="h-min" label="Todas las Carreras"/>
                        </div>
                        <div class="col-span-3 justify-self-center">
                            <ToggleGroupRoot :model-value="scheduleType" @update:model-value="(val) => {
                                if (val) (scheduleType as any) = val
                                printThis()
                            }" type="single" class="flex space-x-2">
                                <ToggleGroupItem class="" value="clases">
                                    <CButton class="h-min" label="Clases" :variant="scheduleType == 'clases' ? undefined : 'text'"/>
                                </ToggleGroupItem>
                                <ToggleGroupItem class="" value="laboratorios">
                                    <CButton class="h-min" label="Laboratorios" :variant="scheduleType == 'laboratorios' ? undefined : 'text'"/>
                                </ToggleGroupItem>
                            </ToggleGroupRoot>
                        </div>
                        <div class="col-span-1">
                            <CInputText v-model="search" placeholder="Buscar" prepend-icon="lucide:search" no-borders />
                        </div>
                    </div>
                    <ClassScheduleV1 :hours="hours!" :classrooms="classrooms!" :schedules="schedules!" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ClassScheduleV3 from '~/components/portal/horarios/ClassScheduleV3.vue'
import ClassScheduleV2 from '~/components/portal/horarios/ClassScheduleV2.vue'
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'
import { ToggleGroupItem, ToggleGroupRoot } from 'radix-vue'

const { data: hours, pending: loadingHours } =
    useCustomLazyFetch<Array<Hour>>(`hours`)

const { data: classrooms, pending: loadingClassrooms } =
    useCustomLazyFetch<Array<Classroom>>(`classrooms`)

const { data: schedules, pending: loadingSchedules } =
    useCustomLazyFetch<Array<Course>>(`schedules/courses`)

const search = ref('');
const scheduleType = ref('clases')

definePageMeta({
    layout: 'default'
})

function printThis() {
    console.log(scheduleType)
}
</script>
<style scoped lang="scss"></style>