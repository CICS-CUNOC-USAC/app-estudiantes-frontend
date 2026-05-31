<template>
  <div class="p-6 border border-border rounded-lg space-y-4">
    <div>
      <h3 class="font-semibold text-lg">{{ title }}</h3>
      <p class="text-sm text-muted-foreground">{{ description }}</p>
    </div>

    <div
      @drop.prevent="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      class="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".csv"
        hidden
        @change="handleFileSelect"
      />
      <button
        @click="fileInput?.click()"
        class="inline-block"
      >
        <div class="text-sm font-medium">Arrastra y suelta archivo CSV aquí</div>
        <div class="text-xs text-muted-foreground mt-1">o haz clic para examinar</div>
      </button>
    </div>

    <div v-if="selectedFile" class="text-sm">
      <div class="font-medium">{{ selectedFile.name }}</div>
      <div class="text-muted-foreground">{{ formatFileSize(selectedFile.size) }}</div>
    </div>

    <button
      @click="handleImport"
      :disabled="!selectedFile || store.loading[importType]"
      class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <span v-if="!store.loading[importType]">Importar</span>
      <span v-else>Importando...</span>
    </button>

    <div v-if="store.error[importType]" class="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
      {{ store.error[importType] }}
    </div>

    <div v-if="store.results[importType] && store.results[importType] !== null" class="p-3 bg-green-50 text-green-900 text-sm rounded-lg space-y-1">
      <div class="font-medium">{{ store.results[importType]!.mensaje }}</div>
      <div>Filas totales: {{ store.results[importType]!.total_filas }}</div>
      <div>Insertados: {{ store.results[importType]!.insertados }}</div>
      <div>Actualizados: {{ store.results[importType]!.actualizados }}</div>
      <div>Omitidos: {{ store.results[importType]!.omitidos }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ImportType } from '~/lib/api/schedules-generator/types'
import { useSchedulesGeneratorStore } from '~/stores/schedules-generator'

interface Props {
  title: string
  description: string
  importType: ImportType
}

const { importType } = defineProps<Props>()

const store = useSchedulesGeneratorStore()
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    selectedFile.value = input.files[0]
  }
}

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files?.[0]) {
    selectedFile.value = files[0]
  }
}

const handleImport = async () => {
  if (!selectedFile.value) return
  await store.importFile(importType, selectedFile.value)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>
