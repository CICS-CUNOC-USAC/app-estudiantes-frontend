<template>
  <div class="flex flex-col">
    <div class="mb-2 flex gap-2">
      <div class="flex items-center">
        <CButton
          icon="icon-park-outline:arrow-left"
          outlined
          size="small"
          @click="page = page > 1 ? page - 1 : page"
        />
        <span class="mx-2"
          >{{ pages === 0 ? '...' : page }} /
          <strong>{{ pages === 0 ? '...' : pages }}</strong></span
        >
        <CButton
          outlined
          size="small"
          icon="icon-park-outline:arrow-right"
          @click="page = page < pages ? page + 1 : page"
        />
      </div>
      
      <div v-if="props.showZoom" class="flex items-center">
        <CButton
          outlined
          size="small"
          icon="lucide:zoom-out"
          @click="scale = scale > 0.5 ? scale - 0.25 : scale"
        />
        <span class="mx-2 font-semibold">{{ scale * 100 }}%</span>
        <CButton
          outlined
          size="small"
          icon="lucide:zoom-in"
          @click="scale = scale < 2 ? scale + 0.25 : scale"
        />
      </div>
    </div>
    <p v-if="loading" class="text-center text-overline">Cargando...</p>
    <div v-else class="flex flex-col gap-2 p-2 max-w-full max-h-full lg:h-[70vh] lg:max-w-[50vw] mx-auto overflow-scroll border border-slate-300 rounded-lg">
      <VuePDF
        class=""
        :pdf
        :page
        :scale
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import CButton from '../primitives/button/CButton.vue';
const props = withDefaults(
  defineProps<{
    pdfUrl: string
    showZoom?: boolean
    fitToPage?: boolean
  }>(),
  {
    showZoom: true,
    fitToPage: false
  }
)
const loading = computed(() => !pdf.value)
const page = ref(1)
const scale = ref(1)
const { pdf, pages } = usePDF(props.pdfUrl)
</script>
