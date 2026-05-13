<template>
  <div class="space-y-4">

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
      <p class="text-center text-sm text-muted-foreground">Tabla de Cursos del Docente</p>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          @click.self="isModalOpen = false"
        >
          <div class="bg-background rounded-lg shadow-lg max-w-md w-full">
            <div class="p-6 border-b border-border flex items-center justify-between">
              <h2 class="text-lg font-semibold">Importar Cursos del Docente</h2>
              <button @click="isModalOpen = false" class="text-muted-foreground hover:text-foreground">
                <Icon name="lucide:x" size="20" />
              </button>
            </div>
            <div class="p-6">
              <ImportCard
                title="Importar Cursos del Docente"
                description="Sube un CSV con datos de cursos del docente"
                import-type="teacher-course"
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
import ImportCard from '../../components/ImportCard.vue'  // ajusta la ruta según donde esté


const isModalOpen = ref(false)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>