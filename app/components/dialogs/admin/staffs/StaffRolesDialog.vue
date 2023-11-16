<template>
  <div>
    <slot :open="() => (dialog = true)">
      <v-btn color="primary" @click="dialog = true"> Editar </v-btn>
    </slot>
    <v-dialog v-model="dialog" max-width="40rem">
      <v-card class="pa-3">
        <v-card-title>
          <v-icon class="mr-2"> mdi-shield-edit-outline </v-icon>
          <span class="font-weight-bold">Editar roles de usuario</span>
        </v-card-title>
        <v-card-text v-if="pending" class="d-flex justify-center">
          <v-progress-circular indeterminate size="48" />
        </v-card-text>

        <v-card-text v-if="!pending">
          <span class="d-inline-block">
            <v-icon class="mr-2 mb-2 mt-1" size="22">
              mdi-account-outline
            </v-icon>
            {{ userItem.first_name }} {{ userItem.last_name }}
          </span>
          <h4>Roles asignados</h4>
          <v-list class="my-2">
            <v-list-item
              v-for="role in staffCurrentRoles"
              :key="role.id"
              @click="handleRoleRemove(role as Role)"
            >
              <template #prepend>
                <v-list-item-action start>
                  <v-icon> mdi-minus-box-outline </v-icon>
                </v-list-item-action>
              </template>
              <v-list-item-title>
                {{ role.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ role.description }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-divider class="my-3" :thickness="2" />
          <h4>Roles disponibles</h4>
          <v-list class="my-2">
            <v-list-item
              v-for="role in availableRoles"
              :key="role.id"
              @click="handleRoleAdd(role as Role)"
            >
              <template #prepend>
                <v-list-item-action start>
                  <v-icon> mdi-plus-box-outline </v-icon>
                </v-list-item-action>
              </template>
              <v-list-item-title>
                {{ role.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ role.description }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn prepend-icon="mdi-cancel" @click="close"> Cancelar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  userItem: Staff
}>()
const allRoles = ref<Role[]>()
const pending = ref(false)
const staffCurrentRoles = ref<Role[]>()
const { fetchAllRoles, fetchAllStaffRoles, updateStaffRoles } =
  useAdminStaffsStore()
const availableRoles = computed(() => {
  const rolesToCompare = allRoles.value?.map((role) => ({
    id: role.id,
    name: role.name,
    alias: role.alias,
    description: role.description
  }))
  return rolesToCompare?.filter(
    (role) => !staffCurrentRoles.value?.some((r) => r.id === role.id)
  )
})

const dialog = ref(false)
const fetchAllData = async () => {
  allRoles.value = await fetchAllRoles()
  staffCurrentRoles.value = await fetchAllStaffRoles(props.userItem.id)
}
watch(dialog, async (value) => {
  if (value) {
    pending.value = true
    await fetchAllData()
    pending.value = false
  }
})

const handleRoleRemove = async (role: Role) => {
  pending.value = true
  const rolesIds = staffCurrentRoles.value
    ?.map((role) => role.id)
    .filter((id) => id !== role.id)
  if (rolesIds) await updateStaffRoles(props.userItem.id, rolesIds)
  await fetchAllData()
  pending.value = false
}
const handleRoleAdd = async (role: Role) => {
  pending.value = true
  const rolesIds = staffCurrentRoles.value?.map((role) => role.id)
  rolesIds?.push(role.id)
  if (rolesIds) await updateStaffRoles(props.userItem.id, rolesIds)
  await fetchAllData()
  pending.value = false
}

const close = () => {
  dialog.value = false
}
</script>
<style lang="scss" scoped></style>
