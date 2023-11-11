<template>
  <main>
    <h1 class="mb-4">Manuales</h1>
    <p class="font-weight-light my-4">
      En esta sección se podrán administrar todos los manuales disponibles en el
      portal público.
    </p>
    <v-row align="center" justify="start">
      <v-col cols="12" md="3">
        <NewManualDialog
          #="{ open }"
          @new-item="createNewManual($event as ManualPayload)"
        >
          <v-btn block :disabled="loading" @click="open">
            <v-icon>mdi-plus</v-icon>
            Nuevo manual
          </v-btn>
        </NewManualDialog>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="name"
          append-icon="mdi-text-search"
          label="Buscar"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-sheet color="transparent" rounded="lg" border elevation="0">
          <v-data-table-server
            :headers="headers"
            :items="manuals"
            :search="search"
            :items-per-page="10"
            :items-length="responseMeta?.total!"
            :loading="loading"
            @update:options="updateOptions"
          >
            <template #item.created_at="{ item }">
              <span>
                {{ formatedDate(item.created_at) }}
              </span>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex align-center">
                <v-btn
                  :to="`/admin/manuals/edit/${item.id}`"
                  icon="mdi-pencil-outline"
                  variant="text"
                  density="comfortable"
                />
                <DeleteItemDialog
                  v-slot="{ open }"
                  @confirm="deleteManualById(item.id)"
                >
                  <v-btn
                    color="red"
                    icon="mdi-delete-outline"
                    variant="text"
                    density="comfortable"
                    @click="open"
                  />
                </DeleteItemDialog>
              </div>
            </template>
          </v-data-table-server>
        </v-sheet>
      </v-col>
    </v-row>
  </main>
</template>
<script setup lang="ts">
import { useDate } from 'vuetify/labs/date'
import { VDataTableServer } from 'vuetify/lib/labs/VDataTable/index.mjs'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import NewManualDialog from '~/components/dialogs/admin/manuals/NewManualDialog.vue'
definePageMeta({
  layout: 'admin'
})

const { fetchAllManuals, deleteManual, createManual } = useAdminManualsStore()
const { loading, manuals, responseMeta } = storeToRefs(useAdminManualsStore())
await fetchAllManuals()
const name = ref('')
const search = ref('')
const vDate = useDate()
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Fecha de creación', key: 'created_at' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

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
  await fetchAllManuals({
    page,
    limit,
    name: name.value,
    orderBy: formatOrderBy(sortBy)
  })
}
const deleteManualById = async (id: number) => {
  await deleteManual(id)
  await fetchAllManuals()
}
const createNewManual = async (item: ManualPayload) => {
  await createManual(item)
  await fetchAllManuals()
}

const formatedDate = (date: string) =>
  vDate.format(date.split('T', 1), 'fullDateWithWeekday')

watch([name], () => {
  search.value = String(Date.now())
})
</script>
<style lang="scss" scoped></style>
