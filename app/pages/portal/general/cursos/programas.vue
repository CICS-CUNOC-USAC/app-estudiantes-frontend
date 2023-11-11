<template>
  <main>
    <h1 class="mb-4">Programas de curso</h1>
    <p class="font-weight-light my-6">
      Escribe el nombre del curso para buscar los programas asociados.
    </p>
    <v-row>
      <v-col cols="12" sm="5">
        <v-text-field
          ref="searchRef"
          v-model="searchDeb"
          prepend-inner-icon="mdi-magnify"
          label="Buscar programa de curso"
          type="text"
          clearable
          placeholder="Nombre del curso"
          variant="outlined"
        >
          <template #append-inner>
            <v-fade-transition leave-absolute>
              <v-progress-circular
                v-if="pending"
                color="orange"
                indeterminate
                size="26"
              ></v-progress-circular>
            </v-fade-transition>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="5">
        <v-text-field
          v-model="teacherSearch"
          clearable
          prepend-inner-icon="mdi-account-tie-outline"
          label="Buscar nombre de docente"
          placeholder="Nombre del docente"
          variant="outlined"
          :disabled="pending || !search || data?.length === 0"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <ProgramsView :teacher-search="teacherSearch" :data="data" />
      </v-col>
    </v-row>
  </main>
</template>
<script setup lang="ts">
import ProgramsView from '~/components/portal/ProgramsView.vue'
import type { ScrapedProgram } from '~/utils/server/types/programs'
onMounted(() => {
  searchRef.value.focus()
})

const searchRef = ref()
const search = ref('')
const teacherSearch = ref('')
const searchDeb = ref('')
const { data, pending } = await useFetch<ScrapedProgram[]>('/api/scrap', {
  query: { search }
})
watchDebounced(
  searchDeb,
  () => {
    search.value = searchDeb.value
  },
  { debounce: 500 }
)
</script>
<style lang="scss" scoped></style>
