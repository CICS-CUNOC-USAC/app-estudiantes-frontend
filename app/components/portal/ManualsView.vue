<template>
  <section>
    <v-data-iterator :items="manuals" :items-per-page="10">
      <template #default="{ items }">
        <v-row v-if="loading">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-if="manuals && manuals.length > 0">
          <v-col
            v-for="item in items"
            :key="item.raw.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card>
              <v-card-title>{{ item.raw.name }}</v-card-title>
              <v-card-text>{{ item.raw.description }}</v-card-text>
              <v-card-actions>
                <v-btn
                  variant="text"
                  :to="`/portal/recursos/manuales/${item.raw.id}`"
                  append-icon="mdi-arrow-right"
                  >Ver
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template #header>
        <v-row justify="space-between">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchDeb"
              label="Buscar por nombre"
              variant="outlined"
              placeholder="Nombre del manual"
              prepend-inner-icon="mdi-magnify"
              type="search"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-pagination
              v-model="currentPage"
              :disabled="loading"
              :length="responseMeta?.total_pages"
              :total-visible="5"
            ></v-pagination>
          </v-col>
        </v-row>
      </template>
      <template #no-data>
        <v-row>
          <v-col cols="12" class="text-center">
            <p class="text-overline">No se encontraron resultados</p>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </section>
</template>
<script setup lang="ts">
const { fetchAllManuals } = usePublicManualsStore()
const { loading, manuals, responseMeta } = storeToRefs(usePublicManualsStore())
const route = useRoute()
const router = useRouter()
const currentPage = ref(route.query.page ? Number(route.query.page) : 1)
const searchDeb = ref(route.query.name ? String(route.query.name) : '')
const search = ref('')
await useLazyAsyncData('public-manuals', () =>
  fetchAllManuals({
    page: route.query.page ? Number(route.query.page) : 1,
    name: route.query.name ? String(route.query.name) : ''
  })
)

watch(
  [currentPage, search],
  async ([newPage, newSearch], [_oldPage, oldSearch]) => {
    if (newSearch !== oldSearch) {
      currentPage.value = 1
    }
    router.push({
      query: {
        page: newPage,
        name: newSearch || null
      }
    })
    await fetchAllManuals({ page: currentPage.value, name: search.value })
  }
)

watchDebounced(
  searchDeb,
  (value) => {
    search.value = value
  },
  { debounce: 500 }
)
</script>
<style lang="scss" scoped></style>
