<template>
  <main>
    <nav class="space-x-4">
      <CButton
        icon="lucide:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="mb-5 text-muted-color-emphasis lg:mb-2"
        to="/"
      />
    </nav>
    <h1 class="text-xl font-semibold">
      <Icon name="lucide:book-open" class="mb-1 mr-1.5 inline-block" />
      Programas de Cursos
    </h1>
    <p class="font-weight-light my-4">
      Escribe el nombre del curso para buscar los programas asociados.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
      <CInputText
        ref="searchRef"
        v-model="searchDeb"
        prepend-icon="lucide:search"
        append-icon="lucide:x"
        @click:append="searchDeb = ''"
        no-borders
        label="Buscar programa de curso"
        type="text"
        clearable
        placeholder="Nombre del curso"
        variant="outlined"
      >
      </CInputText>
      <CInputText
        v-model="teacherSearch"
        clearable
        no-borders
        prepend-icon="lucide:user"
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
import ProgramsView from '~/components/portal/ProgramsView.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import type { ScrapedProgram } from '~/utils/server/types/programs'

onMounted(() => {
  searchRef.value.$input.$el.focus()
})

const router = useRouter()
const route = useRoute()

const content_help = `Los Programas de Curso es la seccion de la Aplicacion para Estdiantes que permite la visualizacion de los programas de cada curso todos los semestres.
  ## Funcionamiento:
  ### Busqueda por Curso:
  Para poder buscar algun programa de curso se debe introducir el nombre del curso que se busca en la barra de busqueda.
  ![TestImage](https://as2.ftcdn.net/v2/jpg/04/74/32/65/1000_F_474326573_R0pN6QJCuDOsDDj4sxVgpzGLk5cQHe6s.jpg)
  ### Busqueda por Docente:
  Para poder buscar algun programa de curso es necesario primero haber introducido el nombre del curso que se busca en la barra de busqueda.
  Una vez hecho esto se habilitara la opcion de poder buscar entre esos programas de curso por docente.
  ![TestImage](https://as2.ftcdn.net/v2/jpg/04/74/32/65/1000_F_474326573_R0pN6QJCuDOsDDj4sxVgpzGLk5cQHe6s.jpg)
  ### Listado de Programas:
  Cuando se haya realizado una busqueda se mostrara el listado de todos los programas que entren dentro del criterio de la busqueda en la tabla.
  Aqui se podran ver los detalles de cada uno de los programas y tambien se podra abrir el PDF del mismo utilizando el boton de la columna Ver.
  ![TestImage](https://upload.wikimedia.org/wikipedia/commons/6/6a/External_link_font_awesome.svg)`
const searchRef = ref()
const search = ref(route.query.curso || '')
const searchDeb = ref(route.query.curso || '')
const teacherSearch = ref('')
const { data, pending } = await useFetch<ScrapedProgram[]>('/api/scrap', {
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
