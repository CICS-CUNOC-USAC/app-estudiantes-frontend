<template>
  <CCardAlt class="px-8 py-12">
    <template #title>
      <h2 class="pb-4 text-center text-2xl font-semibold">Recuperar contraseña</h2>
    </template>
    <template #content>
      <p class="text-center">
        Ingresa tu correo electrónico y te enviaremos un enlace para
        restablecer tu contraseña.
      </p>
      <form class="flex flex-col gap-y-4 py-4" @submit.prevent="handleRecovery">
        <CInputText
          v-model="email"
          label="Correo electrónico"
          placeholder="nombre@ejemplo.com"
          type="text"
          prepend-icon="icon-park-twotone:mail"
          no-borders
          clear-button
        />
        <CButton
          class="w-full"
          :loading="loading"
          :disabled="!email"
          :severity="admin ? 'danger' : ''"
          type="submit"
          icon="icon-park-outline:arrow-right"
          rounded
          label="Continuar"
        />
      </form>
    </template>
    <template #footer>
      <div class="flex flex-col gap-y-4">
        <div class="align-center flex">
          <CButton
            to="/login"
            variant="text"
            icon="icon-park-outline:arrow-left"
            label="Regresar a inicio de sesión"
          />
        </div>
      </div>
    </template>
  </CCardAlt>
</template>
<script lang="ts" setup>
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'

const { loading } = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['recover'])

const email = ref('')
const handleRecovery = () => {
  emit('recover', { email })
}
</script>
