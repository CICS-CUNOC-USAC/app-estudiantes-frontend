<script setup lang="ts">
import type { HorarioDetalle } from '~/lib/api/schedules-generator/types'

defineProps<{
  visible: boolean
  loading: boolean
  carrerasItems: { label: string; value: string }[]
  semestresItems: { label: string; value: string }[]
  items: { detalle: HorarioDetalle; added: boolean; pending: boolean }[]
}>()

const emit = defineEmits<{
  add: [detalle: HorarioDetalle]
  remove: [detalle: HorarioDetalle]
}>()

const busqueda = defineModel<string>('busqueda', { required: true })
const filtroCarrera = defineModel<string | null>('filtroCarrera', { required: true })
const filtroSemestre = defineModel<string | null>('filtroSemestre', { required: true })
</script>

<template>
  <aside
    :class="[
      'border border-black rounded-xl  bg-card p-4 space-y-3 lg:sticky lg:top-4 flex-col print:hidden',
      'max-h-[calc(100vh-6rem)]',
      visible ? 'flex' : 'hidden lg:flex',
    ]"
  >
    <div class="shrink-0 space-y-2">
      <h2 class="text-sm font-black">Cursos disponibles · horario propuesto</h2>

      <!-- Search -->
      <CInputText
        v-model="busqueda"
        type="search"
        prepend-icon="lucide:search"
        clearable
        placeholder="Buscar curso o código..."
      />

      <!-- Carrera filter -->
      <CSelect
        v-model="filtroCarrera"
        :items="carrerasItems"
        option-label="label"
        option-value="value"
        clearable
        placeholder="Todas las carreras"
      />

      <!-- Semestre filter -->
      <CSelect
        v-model="filtroSemestre"
        :items="semestresItems"
        option-label="label"
        option-value="value"
        clearable
        placeholder="Todos los semestres"
      />

      <p class="text-[10px] text-muted-foreground leading-relaxed">
        Arrastra un curso a la grilla o pulsa <strong>+</strong> para agregarlo.
        Los cursos <strong>pendientes</strong> de tu semestre están marcados.
      </p>
    </div>

    <!-- Catalog list -->
    <div class="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="h-14 rounded-[0.6rem] bg-muted animate-pulse border-2 border-black" />
      </template>
      <template v-else-if="items.length === 0">
        <div class="text-center py-6 space-y-1.5">
          <Icon name="lucide:search-x" class="size-8 text-muted-foreground/40 mx-auto" />
          <p class="text-xs text-muted-foreground">No hay cursos que coincidan con los filtros.</p>
        </div>
      </template>
      <TransitionGroup v-else name="cat-list">
        <CourseCatalogItem
          v-for="entry in items"
          :key="entry.detalle.detalle_id"
          :detalle="entry.detalle"
          :added="entry.added"
          :pending="entry.pending"
          @add="emit('add', entry.detalle)"
          @remove="emit('remove', entry.detalle)"
        />
      </TransitionGroup>
    </div>
  </aside>
</template>

<style scoped>
.cat-list-enter-active,
.cat-list-leave-active {
  transition: all 0.18s ease;
}
.cat-list-enter-from {
  opacity: 0;
  transform: scale(0.96);
}
.cat-list-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
