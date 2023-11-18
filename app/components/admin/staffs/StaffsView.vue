<template>
  <div>
    <v-row align="center" justify="start">
      <v-col cols="12" md="4">
        <StaffDialog v-slot="{ open }" @save-staff="saveStaff($event)">
          <v-btn block :disabled="loading" @click="open">
            <v-icon>mdi-plus</v-icon>
            Nuevo usuario administrativo
          </v-btn>
        </StaffDialog>
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
            :search="search"
            :items="staffs"
            :items-per-page="10"
            :items-length="responseMeta?.total!"
            :loading="loading"
            @update:options="updateOptions"
          >
            <template #item.actions="{ item }">
              <div class="d-flex align-center">
                <StaffDialog
                  v-slot="{ open }"
                  :user-item="item"
                  update
                  @save-staff="updateStaff(item.id, $event)"
                >
                  <v-btn
                    icon="mdi-pencil-outline"
                    variant="text"
                    density="comfortable"
                    @click="open"
                  />
                </StaffDialog>
                <StaffRolesDialog v-slot="{ open }" :user-item="item">
                  <v-btn
                    icon="mdi-security"
                    color="blue"
                    variant="text"
                    density="comfortable"
                    @click="open"
                  />
                </StaffRolesDialog>
              </div>
            </template>
          </v-data-table-server>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import StaffDialog from '~/components/dialogs/admin/staffs/StaffDialog.vue'
import StaffRolesDialog from '~/components/dialogs/admin/staffs/StaffRolesDialog.vue'
import { useAdminStaffsStore } from '~/stores/admin-staffs'
const { createStaff, updateStaffById, fetchAllStaffs } = useAdminStaffsStore()
const { loading, staffs, responseMeta } = storeToRefs(useAdminStaffsStore())
const { refresh } = await useLazyAsyncData('admin-staffs', () =>
  fetchAllStaffs()
)
const name = ref('')
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
  await fetchAllStaffs({
    page,
    limit,
    full_name: name.value,
    orderBy: formatOrderBy(sortBy)
  })
}
const saveStaff = async (staffPayload: StaffPayload) => {
  await createStaff(staffPayload)
  await refresh()
}

const updateStaff = async (staffId: number, staffPayload: StaffPayload) => {
  await updateStaffById(staffId, staffPayload)
  await refresh()
}
const headers = ref([
  { title: 'Id', key: 'id' },
  { title: 'First Name', key: 'first_name' },
  { title: 'Last Name', key: 'last_name' },
  { title: 'Email', key: 'email' },
  { title: 'Acciones', key: 'actions', sortable: false }
])
watch([name], () => {
  search.value = String(Date.now())
})
</script>
<style lang="scss" scoped></style>
