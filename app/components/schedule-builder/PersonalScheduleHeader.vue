<script setup lang="ts">
defineProps<{
  propuestoNombre: string | null
  semestre: number | null
  showSemestreBadge: boolean
  horarioCompleto: boolean
  cursosFaltantes: number
  conflictosCount: number
  guardando: boolean
  reiniciarDisabled: boolean
}>()

const emit = defineEmits<{
  'ver-propuesto': []
  'duplicar-propuesto': []
  'armar': []
  'imprimir': []
  'reiniciar': []
  'guardar': []
  'ver-conflictos': []
}>()
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
    <div class="space-y-1">
      <h1 class="text-xl font-black tracking-tight">Mi Horario</h1>
      <!-- Info bar -->
      <div class="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span v-if="propuestoNombre">
          Basado en: <strong class="text-foreground">{{ propuestoNombre }}</strong>
        </span>
        <template v-if="showSemestreBadge">
          <span class="w-px h-3 bg-border inline-block" />
          <span
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-md bg-card"
          >
            Sem. {{ semestre ?? '?' }}
          </span>
        </template>
        <!-- Estado de completitud -->
        <span
          v-if="horarioCompleto"
          class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
        >
          <Icon name="lucide:check" class="size-3" />
          Horario completo
        </span>
        <span
          v-else-if="cursosFaltantes > 0"
          class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-md  bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
        >
          Te falta agregar {{ cursosFaltantes }} curso{{ cursosFaltantes !== 1 ? 's' : '' }}
        </span>
        <template v-if="conflictosCount > 0">
          <button
            type="button"
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-md  bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 cursor-pointer hover:brightness-95 active:translate-y-px transition"
            @click="emit('ver-conflictos')"
          >
            <Icon name="lucide:triangle-alert" class="size-3" />
            {{ conflictosCount }} conflicto{{ conflictosCount !== 1 ? 's' : '' }}
          </button>
        </template>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-wrap items-center gap-2 shrink-0">
      <Button variant="tonal" size="sm" icon="lucide:eye" @click="emit('ver-propuesto')">
        Ver propuesto
      </Button>
      <Button variant="tonal" size="sm" icon="lucide:copy" @click="emit('duplicar-propuesto')">
        Duplicar propuesto
      </Button>
      <Button size="sm" icon="lucide:wand-sparkles" @click="emit('armar')">
        Armar automáticamente
      </Button>
      <Button variant="tonal" size="sm" icon="lucide:printer" @click="emit('imprimir')">
        Imprimir / PDF
      </Button>
      <Button
        variant="text"
        severity="danger"
        size="sm"
        icon="lucide:rotate-ccw"
        :disabled="reiniciarDisabled"
        @click="emit('reiniciar')"
      >
        Reiniciar horario
      </Button>
      <Button
        size="sm"
        icon="lucide:save"
        :loading="guardando"
        @click="emit('guardar')"
      >
        Guardar
      </Button>
    </div>
  </div>
</template>
