<template>
  <main>
    <nav class="space-x-4">
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="mb-5 text-muted-color-emphasis lg:mb-2"
        to="/"
      />
    </nav>
    <h1 class="text-xl font-semibold">
      <Icon name="icon-park-twotone:book-open" class="mb-1 mr-1.5 inline-block" />
      Programas de Cursos
    </h1>
    <p class="font-weight-light my-4">
      Escribe el nombre del curso para buscar los programas asociados.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
      <CInputText
        ref="searchRef"
        v-model="searchDeb"
        prepend-icon="icon-park-twotone:search"
        clearable
        no-borders
        label="Buscar programa de curso"
        type="text"
        placeholder="Nombre del curso"
        variant="outlined"
      >
      </CInputText>
      <CInputText
        v-model="teacherSearch"
        clearable
        no-borders
        prepend-icon="icon-park-twotone:user-business"
        label="Buscar nombre de docente"
        placeholder="Nombre del docente"
        variant="outlined"
        :disabled="pending || !search || data?.length === 0"
      >
      </CInputText>
    </div>

    <ProgramsView
      :teacher-search="teacherSearch"
      :data="filteredData"
      :search-empty="!search"
      :loading="pending"
    />

    <!-- <HelpDialog
      title="Programas de Cursos"
      :content="content_help"
    ></HelpDialog> -->
  </main>
</template>
<script setup lang="ts">
// import HelpDialog from '@/components/dialogs/help/HelpDialog.vue'
import { toast } from 'vue-sonner'
import ProgramsView from '~/components/portal/ProgramsView.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import type { ScrapedProgram } from '~/utils/server/types/programs'

onMounted(() => {
  searchRef.value.$input.$el.focus()
})

const router = useRouter()
const route = useRoute()

const searchRef = ref()
const search = ref(route.query.curso || '')
const searchDeb = ref(route.query.curso || '')
const teacherSearch = ref('')
const { data, pending } = await useFetch<ScrapedProgram[]>('/api/scrap', {
  onResponseError: ()=>{
    toast.error('Hubo un error al cargar los programas de cursos', {
      description: 'Puede que este servicio no esté disponible en este momento. Por favor, intenta más tarde.'
    })
  },
  query: { search }
})
watchDebounced(
  searchDeb,
  () => {
    search.value = searchDeb.value
    router.push({ query: { curso: searchDeb.value || undefined } })
  },
  { debounce: 500 }
)

const filteredData = computed(() => {
  if (!data.value) return []
  return data.value.filter((item) =>
    item.teacher.toLowerCase().includes(teacherSearch.value.toLowerCase())
  )
})
// watch(
//   teacherSearch,
//   () => {
//     data.value = data.value?.filter((item) =>
//       item.teacher.toLowerCase().includes(teacherSearch.value.toLowerCase())
//     )
//   },
//   { immediate: true }
// )
</script>
<style lang="scss" scoped>
HelpDialog {
  margin-bottom: 50%;
}
</style>
