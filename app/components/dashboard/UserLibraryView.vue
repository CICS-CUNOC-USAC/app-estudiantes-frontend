<template>
  <section>
    <v-row align="center" justify="space-between">
      <v-col cols="12" md="6">
        <v-row>
          <v-col>
            <v-text-field
              v-model="name"
              append-icon="mdi-text-search"
              label="Buscar"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="author"
              append-icon="mdi-text-search"
              label="Autor"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-sheet color="transparent" rounded="lg" border elevation="0">
          <v-data-table-server
            :headers="headers"
            :items="books"
            :search="search"
            :items-per-page="10"
            :items-length="responseMeta?.total!"
            :loading="loading"
            @update:options="updateOptions"
          >
            <template #item.actions="{ item }">
              <div class="d-flex align-center">
                <v-btn
                  :to="`/dashboard/books/${item.id}`"
                  icon="mdi-eye-outline"
                  variant="text"
                  density="comfortable"
                />
              </div>
            </template>
          </v-data-table-server>
        </v-sheet>
      </v-col>
    </v-row>
  </section>
</template>
<script setup lang="ts">
const { books, loading, responseMeta } = storeToRefs(useUserLibraryStore())
const { fetchAllBooks } = useUserLibraryStore()
await useLazyAsyncData('admin-books', () => fetchAllBooks())
const name = ref('')
const author = ref('')
const search = ref('')

const updateOptions = async ({
  page,
  itemsPerPage,
  sortBy
}: {
  page: number
  itemsPerPage: number
  sortBy: { key: string; order: string }[]
}) => {
  const limit = itemsPerPage === -1 ? 'all' : itemsPerPage
  await fetchAllBooks({
    page,
    limit,
    name: name.value ? name.value : undefined,
    author: author.value ? author.value : undefined,
    orderBy: formatOrderBy(sortBy)
  })
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Autor', key: 'author' },
  { title: 'Descripcion', key: 'description' },
  { title: 'Ver', key: 'actions', sortable: false, width: '80px' }
]
watch([name, author], () => {
  search.value = String(Date.now())
})
</script>
<style lang="scss" scoped></style>
