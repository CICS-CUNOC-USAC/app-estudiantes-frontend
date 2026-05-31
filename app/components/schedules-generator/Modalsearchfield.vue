<template>
  <div>
    <label class="text-sm font-medium mb-1 block">{{ label }}</label>
    <CInputText
      :model-value="query"
      :placeholder="placeholder"
      prepend-icon="lucide:search"
      class="w-full mb-1"
      @input="$emit('update:query', ($event.target as HTMLInputElement).value)"
    />

    <!-- Lista de resultados -->
    <div
      v-if="!selected && results.length > 0"
      class="border border-border rounded-lg max-h-40 overflow-y-auto bg-background"
    >
      <slot name="result" v-for="item in results" :key="(item as any).id" :item="item" />
    </div>
    <div
      v-else-if="!selected && query.length > 0 && results.length === 0"
      class="text-xs text-muted-foreground mt-1 px-1"
    >
      Sin resultados
    </div>

    <!-- Chip de seleccionado -->
    <div
      v-if="selected"
      class="mt-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-sm flex items-center justify-between"
    >
      <div><slot name="selected" :item="selected" /></div>
      <button type="button" @click="$emit('clear')" class="text-muted-foreground hover:text-foreground ml-2">
        <Icon name="lucide:x" size="14" />
      </button>
    </div>

    <p v-if="error" class="text-xs text-destructive mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts" generic="T">
import CInputText from '~/components/primitives/form/CInputText.vue'

defineProps<{
  label: string
  placeholder: string
  query: string
  results: T[]
  selected: T | null
  error?: string
}>()

defineEmits<{
  'update:query': [value: string]
  'clear': []
}>()
</script>