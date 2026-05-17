<template>
  <main class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold mb-2">Gestión de Datos</h1>
      <p class="text-muted-foreground">Administra e importa datos para el generador de horarios</p>
    </div>

    <div class="border-b border-border">
      <div class="flex gap-2 overflow-x-auto">
        <NuxtLink
          v-for="view in views"
          :key="view.key"
          :to="{ query: viewQuery(view.key) }"
          class="px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap"
          :class="activeView === view.key
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'"
        >
          <Icon :name="view.icon" class="inline mr-2" size="16" />
          {{ view.label }}
        </NuxtLink>
      </div>
    </div>

    <section v-if="activeView === 'imports'" class="space-y-4">
      <div class="border-b border-border">
        <div class="flex gap-2 overflow-x-auto">
          <NuxtLink
            v-for="tab in importTabs"
            :key="tab.type"
            :to="{ query: importQuery(tab.type) }"
            class="px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap"
            :class="activeTab === tab.type
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'"
          >
            <Icon :name="tab.icon" class="inline mr-2" size="16" />
            {{ tab.label }}
          </NuxtLink>
        </div>
      </div>

      <component :is="currentComponent" />
    </section>

    <section v-else-if="activeView === 'cleanups'" class="space-y-4">
      <TabCleanups />
    </section>

    <section v-else class="space-y-4">
      <TabPeriods />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { ImportType } from '~/lib/api/schedules-generator/types'
import TabTeachers from './components/TabTeachers.vue'
import TabCourses from './components/TabCourses.vue'
import TabTeacherCourse from './components/TabTeacherCourse.vue'
import TabClassrooms from './components/TabClassrooms.vue'
import TabLabs from './components/TabLabs.vue'
import TabSections from './components/TabSections.vue'
import TabSectionLab from './components/TabSectionLab.vue'
import TabCleanups from './components/TabCleanups.vue'
import TabPeriods from './components/TabPeriods.vue'

const route = useRoute()

const views = [
  { key: 'imports', label: 'Importaciones', icon: 'lucide:database' },
  { key: 'cleanups', label: 'Limpiezas', icon: 'lucide:trash-2' },
  { key: 'periods', label: 'Períodos', icon: 'lucide:clock' },
] as const

const importTabs = [
  { type: 'teachers' as ImportType, label: 'Docentes', icon: 'lucide:users', component: TabTeachers },
  { type: 'courses' as ImportType, label: 'Cursos', icon: 'lucide:book-open', component: TabCourses },
  { type: 'teacher-course' as ImportType, label: 'Docente-Curso', icon: 'lucide:link', component: TabTeacherCourse },
  { type: 'classrooms' as ImportType, label: 'Salones', icon: 'lucide:home', component: TabClassrooms },
  { type: 'labs' as ImportType, label: 'Laboratorios', icon: 'lucide:beaker', component: TabLabs },
  { type: 'sections' as ImportType, label: 'Secciones', icon: 'lucide:layers', component: TabSections },
  { type: 'section-lab' as ImportType, label: 'Sección-Lab', icon: 'lucide:link-2', component: TabSectionLab },
]

const activeView = computed<'imports' | 'cleanups' | 'periods'>(() => {
  const view = route.query.view
  if (view === 'cleanups' || view === 'periods') return view as 'cleanups' | 'periods'
  return 'imports'
})

const activeTab = computed<ImportType>(() => {
  return (route.query.tab as ImportType) || 'teachers'
})

const currentComponent = computed(() => {
  return importTabs.find(tab => tab.type === activeTab.value)?.component ?? TabTeachers
})

const viewQuery = (view: 'imports' | 'cleanups' | 'periods') => {
  if (view === 'cleanups' || view === 'periods') {
    return { view }
  }

  return {
    view: 'imports',
    tab: activeTab.value,
  }
}

const importQuery = (tab: ImportType) => ({
  view: 'imports',
  tab,
})

definePageMeta({
  layout: 'admin',
})
</script>