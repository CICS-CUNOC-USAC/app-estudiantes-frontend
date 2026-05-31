<template>
  <div class="space-y-4">

    <div class="flex justify-end">
      <Dialog v-model:open="isModalOpen">
        <DialogTrigger as-child>
          <Button icon="lucide:upload" label="Importar CSV" />
        </DialogTrigger>
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Cursos</DialogTitle>
            <DialogDescription>Sube un CSV con datos de cursos</DialogDescription>
          </DialogHeader>
          <ImportCard
            title="Importar Cursos"
            description="Sube un CSV con datos de cursos"
            import-type="courses"
            @imported="isModalOpen = false"
          />
        </DialogContent>
      </Dialog>
    </div>

    <div class="border border-border rounded-lg p-8 bg-muted/30">
      <p class="text-center text-sm text-muted-foreground">Tabla de Cursos</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import ImportCard from '../../components/ImportCard.vue'

const isModalOpen = ref(false)
</script>
