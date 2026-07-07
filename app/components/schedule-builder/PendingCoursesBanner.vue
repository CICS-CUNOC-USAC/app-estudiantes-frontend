<script setup lang="ts">
defineProps<{
  pendientesConOferta: string[]
  pendientesSinOferta: string[]
  nombrePorCurso: Map<string, string>
}>()

const emit = defineEmits<{
  agregar: [codigo: string]
}>()
</script>

<template>
  <div class="border border-black rounded-xl  bg-amber-50 dark:bg-amber-950/30 p-4 print:hidden">
    <p class="text-xs font-black mb-2 flex items-center gap-1.5">
      <Icon name="lucide:list-todo" class="size-4 text-cics-primary" />
      Te faltan por agregar (obligatorios de tu semestre)
    </p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="codigo in pendientesConOferta"
        :key="codigo"
        class="inline-flex items-center gap-1.5 border-2 border-black rounded-full bg-card pl-2.5 pr-1 py-0.5 text-xs font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
      >
        <span class="max-w-48 truncate" :title="nombrePorCurso.get(codigo) ?? codigo">
          {{ codigo }}<template v-if="nombrePorCurso.get(codigo)"> — {{ nombrePorCurso.get(codigo) }}</template>
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-0.5 shrink-0 rounded-full border border-black bg-cics-primary text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 hover:brightness-110 active:translate-y-px"
          @click="emit('agregar', codigo)"
        >
          <Icon name="lucide:plus" class="size-3" />
          Agregar
        </button>
      </span>
      <span
        v-for="codigo in pendientesSinOferta"
        :key="codigo"
        class="inline-flex items-center gap-1.5 border-2 border-dashed border-black/40 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground max-w-64 truncate"
        :title="`${nombrePorCurso.get(codigo) ?? codigo}: sin secciones en el horario propuesto de este ciclo`"
      >
        {{ codigo }}<template v-if="nombrePorCurso.get(codigo)"> — {{ nombrePorCurso.get(codigo) }}</template>
        <span class="text-[9px] font-extrabold uppercase shrink-0">Sin oferta</span>
      </span>
    </div>
    <p
      v-if="pendientesSinOferta.length > 0"
      class="text-[10px] text-muted-foreground mt-2"
    >
      Los cursos marcados "Sin oferta" están en tu pensum pero no tienen secciones en el horario
      propuesto de este ciclo; no es posible agregarlos.
    </p>
  </div>
</template>
