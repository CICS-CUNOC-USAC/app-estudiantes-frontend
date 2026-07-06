<script setup lang="ts">
import { ref, nextTick } from 'vue'

/**
 * Envuelve una grilla de horario para imprimirla fiel al diseño de la página:
 * agrega un encabezado que solo aparece al imprimir (título, chips y fecha) y
 * define el CSS global de impresión (A4 horizontal, una hoja, colores exactos).
 * La impresión se dispara con el método expuesto `imprimir()`, que fuerza tema
 * claro durante el diálogo de impresión y lo restaura al cerrar.
 */
const props = defineProps<{
  titulo: string
  subtitulo?: string
  chips?: string[]
}>()

const fechaImpresion = ref('')

async function imprimir() {
  fechaImpresion.value = new Date().toLocaleString('es-GT', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
  // El horario impreso siempre va en tema claro: con dark activo saldrían
  // fondos oscuros que desperdician tinta y se ven mal en papel.
  const html = document.documentElement
  const eraDark = html.classList.contains('dark')
  if (eraDark) html.classList.remove('dark')
  await nextTick()
  try {
    window.print()
  }
  finally {
    if (eraDark) html.classList.add('dark')
  }
}

defineExpose({ imprimir })
</script>

<template>
  <div id="horario-print">
    <!-- Encabezado visible solo al imprimir -->
    <div class="hidden print:block border-b-4 border-black pb-2 mb-3">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
            CICS · CUNOC — USAC
          </p>
          <h1 class="text-xl font-black leading-tight">{{ props.titulo }}</h1>
          <p v-if="props.subtitulo" class="text-xs font-semibold text-neutral-600">
            {{ props.subtitulo }}
          </p>
        </div>
        <div class="text-right shrink-0">
          <div class="flex flex-wrap justify-end gap-1.5 mb-1">
            <span
              v-for="chip in props.chips ?? []"
              :key="chip"
              class="inline-flex items-center text-[9px] font-extrabold uppercase tracking-[0.04em] py-0.5 px-2 border-2 border-black rounded-full"
            >
              {{ chip }}
            </span>
          </div>
          <p class="text-[9px] text-neutral-500">Impreso el {{ fechaImpresion }}</p>
        </div>
      </div>
    </div>

    <slot />
  </div>
</template>

<!-- CSS de impresión global (no scoped): solo se imprime #horario-print -->
<style>
@media print {
  @page {
    size: A4 landscape;
    margin: 8mm;
  }

  body * {
    visibility: hidden !important;
  }

  #horario-print,
  #horario-print * {
    visibility: visible !important;
    /* Mantiene los colores del diseño (headers azules, labs cyan, barras por semestre) */
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  #horario-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: white !important;
    /* Encoge la grilla completa para que quepa en una sola hoja A4 horizontal */
    zoom: 0.68;
  }

  /* La grilla no debe recortarse por el scroll horizontal de pantalla */
  #horario-print .overflow-x-auto {
    overflow: visible !important;
  }

  /* El header de días pegajoso no aplica en papel */
  #horario-print .sticky {
    position: static !important;
  }

  /* Sin animaciones de conflicto parpadeando a media impresión */
  #horario-print * {
    animation: none !important;
    transition: none !important;
  }
}
</style>
