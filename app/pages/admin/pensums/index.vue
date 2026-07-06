<template>
  <main>
    <header>
      <h1 class="py-3 text-xl font-semibold">
        <Icon
          name="icon-park-twotone:notebook-one"
          class="mr-1.5 mb-1 inline-block"
        />
        Pensums de estudio
      </h1>
      <p class="text-muted-color-emphasis text-sm">
        Administrar los pensums de estudio de las carreras
      </p>
    </header>

    <div class="my-5 flex gap-2">
      <Button
        label="Nuevo pensum"
        icon="icon-park-outline:plus"
        class="w-fit"
        to="/admin/pensums/create"
      />
      <AdminClonePensumDialog
        :pensums="pensums?.results ?? []"
        @cloned="refresh()"
      >
        <Button
          label="Clonar pensum"
          icon="icon-park-outline:copy"
          severity="secondary"
          class="w-fit"
        />
      </AdminClonePensumDialog>
    </div>

    <template v-if="status === 'pending'">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton v-for="i in 4" :key="i" height="180px" width="100%" />
      </div>
    </template>

    <section
      v-else-if="groupedByCareer.length"
      class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <Card
        v-for="group in groupedByCareer"
        :key="group.careerCode"
        class="hover:bg-primary-100/75 dark:hover:bg-primary-900/30 group overflow-hidden pb-0 transition"
      >
        <CardHeader class="gap-0">
          <CardTitle class="font-heading text-lg font-semibold">
            {{ group.careerName }}
          </CardTitle>
          <CardDescription>
            {{ group.pensums.length }} {{ group.pensums.length === 1 ? 'pensum registrado' : 'pensums registrados' }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2 pb-4">
          <div
            v-for="pensum in group.pensums"
            :key="pensum.id"
            class="border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800 flex items-center justify-between rounded-lg border px-4 py-2.5"
          >
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium">{{ pensum.year }}</span>
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="pensum.active
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'"
              >
                {{ pensum.active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="flex gap-2">
              <Button
                label="Ver cursos"
                size="small"
                icon="icon-park-twotone:book-open"
                :to="`/admin/pensums/${pensum.id}/courses`"
              />
              <Button
                label="Editar"
                size="small"
                severity="secondary"
                icon="icon-park-twotone:edit"
                :to="`/admin/pensums/edit/${pensum.id}`"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <div
      v-else-if="status === 'success'"
      class="text-muted-foreground mt-8 flex flex-col items-center gap-2 py-12 text-center"
    >
      <Icon name="icon-park-twotone:folder-open" size="40" class="opacity-40" />
      <p>No se encontraron pensums.</p>
      <Button
        label="Crear el primero"
        icon="icon-park-outline:plus"
        variant="link"
        to="/admin/pensums/create"
      />
    </div>
  </main>
</template>
<script setup lang="ts">
import AdminClonePensumDialog from '~/components/dialogs/courses/AdminClonePensumDialog.vue'
import Button from '~/components/ui/button/Button.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { getAllPensums } from '~/lib/api/admin/pensums'
import type { Pensum } from '~/utils/types/pensum-courses'

const {
  data: pensums,
  status,
  refresh
} = await useAsyncData('admin-pensums', () => getAllPensums())

type CareerGroup = {
  careerCode: number
  careerName: string
  pensums: Pensum[]
}

const groupedByCareer = computed<CareerGroup[]>(() => {
  if (!pensums.value?.results) return []

  const map = new Map<number, CareerGroup>()
  for (const pensum of pensums.value.results) {
    const code = pensum.career_code
    if (!map.has(code)) {
      map.set(code, {
        careerCode: code,
        careerName: pensum.career?.name ?? `Carrera ${code}`,
        pensums: []
      })
    }
    map.get(code)!.pensums.push(pensum)
  }

  for (const group of map.values()) {
    group.pensums.sort((a, b) => b.year - a.year)
  }

  return Array.from(map.values())
})

definePageMeta({
  layout: 'admin',
  subject: ['Pensum', 'all'],
  action: ['manage']
})
</script>
<style scoped></style>
