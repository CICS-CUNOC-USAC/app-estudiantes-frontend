<template>
  <main>
    <nav class="space-x-4">
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a pensums"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/portal/general/pensums"
      />
    </nav>
    <h1 class="mt-4 mb-4 text-xl font-semibold">
      <template v-if="pensumStatus === 'pending' || coursesStatus === 'pending'">
        <Skeleton height="1.7rem" width="28rem"></Skeleton>
      </template>
      <template v-if="pensumCourses && coursesStatus === 'success'">
        <Icon
          name="icon-park-twotone:s-turn-left"
          class="mr-1.5 mb-1 inline-block"
        />
        <span class="font-weight-light">Carrera:</span>
        {{ pensumCourses?.career_name }} -
        <span>
          {{ pensumCourses?.career_code }}
        </span>
        <span class="text-muted-color ml-2 text-base font-normal">
          (Pensum {{ pensumCourses?.pensum_year }})
        </span>
      </template>
    </h1>

    <div
      v-if="pensums && pensums.length > 1 && pensumStatus === 'success'"
      class="mb-6 flex items-center gap-3"
    >
      <span class="text-muted-foreground text-sm">Pensum:</span>
      <Select
        :model-value="selectedPensumId"
        @update:model-value="selectedPensumId = $event"
      >
        <SelectTrigger class="bg-surface-50 dark:border-surface-700 dark:bg-surface-900 w-auto min-w-48 rounded-lg border-black px-3 py-2">
          <SelectValue placeholder="Seleccionar pensum" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="pensum in pensums"
              :key="pensum.id"
              :value="pensum.id"
            >
              {{ pensum.year }}
              <span v-if="pensum.active" class="text-green-600 ml-1 text-xs">(Vigente)</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <Transition name="pensum-fade" mode="out-in">
      <PensumPublicView
        :key="selectedPensumId"
        :pensum-semesters="pensumCourses?.courses"
        :loading="coursesStatus === 'pending'"
      />
    </Transition>
    <HelpDialog title="Pensum de carrera" content-path="/help/pensums"></HelpDialog>
    <ElementNotFound
      title="Pensum no encontrado"
      subtitle="Parece que el pensum de la carrera que buscas no existe, verifica que el código de carrera sea correcto."
      backToRoute="/portal/general/pensums"
      backToLabel="Regresar a pensums"
      v-if="coursesStatus === 'error' && coursesError?.statusCode === 404"
    />
  </main>
</template>

<script setup lang="ts">
import HelpDialog from '~/components/dialogs/help/HelpDialog.vue'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import PensumPublicView from '~/components/portal/pensums/PensumPublicView.vue'
import Button from '~/components/ui/button/Button.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import type { Pensum, PensumCoursesResponse } from '~/utils/types/pensum-courses'

const route = useRoute()

const {
  data: pensums,
  status: pensumStatus,
} = await useCustomFetch<Pensum[]>(
  `/pensums?career_code=${route.params.codigoCarrera}`
)

const defaultPensumId = computed(() => {
  const active = pensums.value?.find((p) => p.active)
  return (active ?? pensums.value?.[0])?.id
})

const selectedPensumId = ref<number | undefined>(defaultPensumId.value)

watch(defaultPensumId, (val) => {
  if (val && !selectedPensumId.value) {
    selectedPensumId.value = val
  }
})

const selectedPensum = computed(() =>
  pensums.value?.find((p) => p.id === selectedPensumId.value)
)

const {
  data: pensumCourses,
  status: coursesStatus,
  error: coursesError,
} = await useCustomFetch<PensumCoursesResponse>(
  computed(() =>
    selectedPensum.value
      ? `/pensums/${selectedPensum.value.id}/courses`
      : ''
  ),
  { watch: [selectedPensum] }
)

useCustomPageTitle(
  pensumCourses?.value?.career_name
    ? `Pensum - ${pensumCourses?.value?.career_name}`
    : 'Pensum de carrera'
)
definePageMeta({
  title: 'Pensum de carrera'
})
</script>
<style scoped>
.pensum-fade-enter-active,
.pensum-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.pensum-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.pensum-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
