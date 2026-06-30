<template>
  <main class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:data"
          class="mr-1.5 mb-1 inline-block"
        />
        Gestión de Datos
      </h1>
      <p class="text-muted-color-emphasis">
        Administra e importa datos para el generador de horarios
      </p>
    </header>
    <Tabs :model-value="activeView" @update:model-value="onViewChange">
      <TabsList>
        <TabsTrigger v-for="view in views" :key="view.key" :value="view.key">
          <Icon :name="view.icon" class="mr-2" size="16" />
          {{ view.label }}
        </TabsTrigger>
      </TabsList>
    </Tabs>

    <section v-if="activeView === 'imports'" class="space-y-4">
      <Tabs :model-value="activeTab" @update:model-value="onTabChange">
        <TabsList>
          <TabsTrigger
            v-for="tab in importTabs"
            :key="tab.type"
            :value="tab.type"
          >
            <Icon :name="tab.icon" class="mr-2" size="16" />
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import type { ImportType } from '~/lib/api/schedules-generator/types'

import TabTeachers from './-components/TabTeachers.vue'
import TabCourses from './-components/TabCourses.vue'
import TabCarreras from './-components/TabCarreras.vue'
import TabTeacherCourse from './-components/TabTeacherCourse.vue'
import TabSalones from './-components/TabSalones.vue'
import TabLabs from './-components/TabLabs.vue'
import TabSections from './-components/TabSections.vue'
import TabSectionLab from './-components/TabSectionLab.vue'
import TabCleanups from './-components/TabCleanups.vue'
import TabPeriods from './-components/TabPeriods.vue'

const route = useRoute()
const router = useRouter()

const views = [
  { key: 'imports', label: 'Importaciones', icon: 'lucide:database' },
  { key: 'cleanups', label: 'Limpiezas', icon: 'lucide:trash-2' },
  { key: 'periods', label: 'Períodos', icon: 'lucide:clock' }
] as const

const importTabs = [
  {
    type: 'teachers' as ImportType,
    label: 'Docentes',
    icon: 'lucide:users',
    component: TabTeachers
  },
  {
    type: 'courses' as ImportType,
    label: 'Cursos',
    icon: 'lucide:book-open',
    component: TabCourses
  },
  {
    type: 'carreras' as const,
    label: 'Carreras',
    icon: 'lucide:graduation-cap',
    component: TabCarreras
  },
  {
    type: 'teacher-course' as ImportType,
    label: 'Docente-Curso',
    icon: 'lucide:link',
    component: TabTeacherCourse
  },
  {
    type: 'classrooms' as ImportType,
    label: 'Salones',
    icon: 'lucide:home',
    component: TabSalones
  },
  {
    type: 'labs' as ImportType,
    label: 'Laboratorios',
    icon: 'lucide:beaker',
    component: TabLabs
  },
  {
    type: 'sections' as ImportType,
    label: 'Secciones',
    icon: 'lucide:layers',
    component: TabSections
  },
  {
    type: 'section-lab' as ImportType,
    label: 'Sección-Lab',
    icon: 'lucide:link-2',
    component: TabSectionLab
  }
]

type TabType = (typeof importTabs)[number]['type']

const activeView = computed<'imports' | 'cleanups' | 'periods'>(() => {
  const view = route.query.view
  if (view === 'cleanups' || view === 'periods')
    return view as 'cleanups' | 'periods'
  return 'imports'
})

const activeTab = computed<TabType>(() => {
  return (route.query.tab as TabType) || 'teachers'
})

const currentComponent = computed(() => {
  return (
    importTabs.find((tab) => tab.type === activeTab.value)?.component ??
    TabTeachers
  )
})

const onViewChange = (view: string | number) => {
  if (view === 'cleanups' || view === 'periods') {
    router.push({ query: { view } })
  } else {
    router.push({ query: { view: 'imports', tab: activeTab.value } })
  }
}

const onTabChange = (tab: string | number) => {
  router.push({ query: { view: 'imports', tab } })
}

definePageMeta({
  layout: 'admin',
  subject: ['all'],
  action: ['manage'],
})
</script>
