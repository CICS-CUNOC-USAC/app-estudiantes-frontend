<script setup lang="ts">
const emit = defineEmits<{
  'duplicar-propuesto': []
  'armar': []
}>()
</script>

<template>
  <div class="border border-black rounded-xl  bg-card p-6 text-center space-y-3 print:hidden">
    <Icon name="lucide:calendar-plus" class="size-10 text-cics-primary mx-auto" />
    <p class="text-sm font-black">Aún no has armado tu horario</p>
    <p class="text-xs text-muted-foreground max-w-md mx-auto">
      Duplica el horario propuesto de tu semestre y edítalo, deja que el asistente lo arme por ti,
      o arrastra cursos desde el catálogo a la grilla.
    </p>
    <div class="flex flex-wrap justify-center gap-2">
      <Button variant="tonal" size="sm" icon="lucide:copy" @click="emit('duplicar-propuesto')">
        Duplicar propuesto
      </Button>
      <Button size="sm" icon="lucide:wand-sparkles" @click="emit('armar')">
        Armar automáticamente
      </Button>
    </div>
  </div>
</template>
