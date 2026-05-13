<template>
  <div class="space-y-4">

    <!-- Acciones -->
    <div class="flex justify-end">
      <button
        @click="isModalOpen = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Icon name="lucide:upload" size="18" />
        Importar CSV
      </button>
    </div>

    <div class="border border-border rounded-lg p-8 bg-muted/30">
      <p class="text-center text-sm text-muted-foreground">Tabla de Salones</p>
    </div>

    <!-- Resultado de importación -->
    <div v-if="store.results['classrooms']" class="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
      <div class="font-medium text-green-900 dark:text-green-100">
        {{ store.results['classrooms']!.mensaje }}
      </div>
      <button @click="store.clearResult('classrooms')" class="text-sm underline hover:no-underline mt-2">
        Descartar resultado
      </button>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          @click.self="isModalOpen = false"
        >
          <div class="bg-background rounded-lg shadow-lg max-w-md w-full">
            <div class="p-6 border-b border-border flex items-center justify-between">
              <h2 class="text-lg font-semibold">Importar Salones</h2>
              <button @click="isModalOpen = false" class="text-muted-foreground hover:text-foreground">
                <Icon name="lucide:x" size="20" />
              </button>
            </div>
            <div class="p-6">
              <ImportCard
                title="Importar Salones"
                description="Sube un CSV con datos de salones"
                import-type="classrooms"
                @imported="isModalOpen = false"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSchedulesGeneratorStore } from '~/stores/schedules-generator'
import ImportCard from '../../components/ImportCard.vue'  // ajusta la ruta según donde esté

const store = useSchedulesGeneratorStore()
const isModalOpen = ref(false)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>