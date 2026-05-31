<template>
  <div class="space-y-4">

    <div class="flex justify-end">
      <Dialog v-model:open="isModalOpen">
        <DialogTrigger as-child>
          <Button icon="lucide:upload" label="Importar CSV" />
        </DialogTrigger>
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Salones</DialogTitle>
            <DialogDescription>Sube un CSV con datos de salones</DialogDescription>
          </DialogHeader>
          <ImportCard
            title="Importar Salones"
            description="Sube un CSV con datos de salones"
            import-type="classrooms"
            @imported="isModalOpen = false"
          />
        </DialogContent>
      </Dialog>
    </div>

    <div class="border border-border rounded-lg p-8 bg-muted/30">
      <p class="text-center text-sm text-muted-foreground">Tabla de Salones</p>
    </div>

    <div v-if="store.results['classrooms']" class="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
      <div class="font-medium text-green-900 dark:text-green-100">
        {{ store.results['classrooms']!.mensaje }}
      </div>
      <button @click="store.clearResult('classrooms')" class="text-sm underline hover:no-underline mt-2">
        Descartar resultado
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSchedulesGeneratorStore } from '~/stores/schedules-generator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import ImportCard from '../../components/ImportCard.vue'

const store = useSchedulesGeneratorStore()
const isModalOpen = ref(false)
</script>
