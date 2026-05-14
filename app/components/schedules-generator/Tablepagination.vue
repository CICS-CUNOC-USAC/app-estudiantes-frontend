<template>
  <div class="flex items-center justify-between text-sm text-muted-foreground">
    <span>
      Página <strong>{{ currentPage }}</strong> de <strong>{{ totalPages }}</strong>
      · Total de registros: <strong>{{ total }}</strong>
    </span>
    <div class="flex items-center gap-1">
      <button
        v-for="(btn, i) in buttons"
        :key="i"
        :disabled="btn.disabled"
        :title="btn.title"
        class="px-2 py-1 border border-border rounded hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
        @click="btn.action"
      >{{ btn.label }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:currentPage': [page: number] }>()

const buttons = computed(() => [
  { label: '«', title: 'Primera página',   disabled: props.currentPage === 1,             action: () => emit('update:currentPage', 1) },
  { label: '‹', title: 'Página anterior',  disabled: props.currentPage === 1,             action: () => emit('update:currentPage', props.currentPage - 1) },
  { label: '›', title: 'Página siguiente', disabled: props.currentPage === props.totalPages, action: () => emit('update:currentPage', props.currentPage + 1) },
  { label: '»', title: 'Última página',    disabled: props.currentPage === props.totalPages, action: () => emit('update:currentPage', props.totalPages) },
])
</script>