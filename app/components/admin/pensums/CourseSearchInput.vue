<template>
  <div class="relative">
    <CInputText
      :model-value="searchQuery"
      @update:model-value="onSearchInput"
      :placeholder="selectedLabel || 'Buscar curso...'"
      no-borders
      prepend-icon="icon-park-twotone:book-open"
      clearable
      @focus="showDropdown = true"
    />

    <div
      v-if="showDropdown && filtered.length"
      class="border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-800 absolute top-full right-0 left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border shadow-lg"
    >
      <button
        v-for="course in filtered"
        :key="course.code"
        type="button"
        class="hover:bg-primary-100 dark:hover:bg-primary-900/30 flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition"
        :class="course.code === modelValue ? 'bg-primary-50 dark:bg-primary-900/20 font-medium' : ''"
        @click="selectCourse(course)"
      >
        <span class="text-muted-foreground w-12 shrink-0 font-mono text-xs">{{ course.code }}</span>
        <span class="truncate">{{ course.name }}</span>
      </button>
    </div>

    <div
      v-if="showDropdown && searchQuery && !filtered.length"
      class="border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-800 text-muted-foreground absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border px-3 py-3 text-center text-sm shadow-lg"
    >
      No se encontraron cursos
    </div>
  </div>
</template>
<script setup lang="ts">
import CInputText from '~/components/primitives/form/CInputText.vue'
import type { PensumCourseOption } from '~/utils/types/pensum-courses'

const props = defineProps<{
  courses: PensumCourseOption[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const searchQuery = ref('')
const showDropdown = ref(false)

const selectedLabel = computed(() => {
  if (!props.modelValue) return ''
  const found = props.courses.find(c => c.code === props.modelValue)
  return found ? `${found.code} — ${found.name}` : props.modelValue
})

const filtered = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return props.courses.slice(0, 20)
  return props.courses.filter(c =>
    c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
  ).slice(0, 20)
})

function onSearchInput(val: string) {
  searchQuery.value = val
  showDropdown.value = true
  if (!val) {
    emit('update:modelValue', '')
  }
}

function selectCourse(course: PensumCourseOption) {
  emit('update:modelValue', course.code)
  searchQuery.value = ''
  showDropdown.value = false
}

function onClickOutside() {
  showDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})

function handleGlobalClick(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.relative')
  if (!el) showDropdown.value = false
}
</script>
