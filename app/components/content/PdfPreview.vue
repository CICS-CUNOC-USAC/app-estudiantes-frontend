<template>
  <div class="d-flex flex-column align-center">
    <div class="mb-2 d-flex">
      <div>
        <v-btn
          icon="mdi-arrow-left-thick"
          density="comfortable"
          @click="page = page > 1 ? page - 1 : page"
        />
        <span class="mx-2"
          >{{ pages === 0 ? '...' : page }} /
          <strong>{{ pages === 0 ? '...' : pages }}</strong></span
        >
        <v-btn
          density="comfortable"
          icon="mdi-arrow-right-thick"
          @click="page = page < pages ? page + 1 : page"
        />
      </div>
      <v-divider vertical class="mx-4" color="transparent" />
      <div>
        <v-btn
          density="comfortable"
          icon="mdi-magnify-minus-outline"
          @click="scale = scale > 0.25 ? scale - 0.25 : scale"
        />
        <span class="mx-2">{{ scale * 100 }}%</span>
        <v-btn
          density="comfortable"
          icon="mdi-magnify-plus-outline"
          @click="scale = scale < 2 ? scale + 0.25 : scale"
        />
      </div>
    </div>
    <p v-if="loading" class="text-center text-overline">Cargando...</p>
    <VuePDF
      v-else
      :pdf="pdf"
      :page="page"
      :scale="scale"
      class="rounded-lg"
      style="outline: 2px solid #9e9e9e"
    />
  </div>
</template>
<script setup lang="ts">
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
const props = defineProps<{
  pdfUrl: string
}>()
const loading = computed(() => !pdf.value)
const page = ref(1)
const scale = ref(0.5)
const { pdf, pages } = usePDF(props.pdfUrl)
</script>
<style lang="scss" scoped></style>
