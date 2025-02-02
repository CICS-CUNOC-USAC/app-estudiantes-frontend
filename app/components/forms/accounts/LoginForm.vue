<template>
  <CCardAlt class="px-8 py-12">
    <template #title>
      <h2 class="pb-4 text-center text-2xl font-semibold">Iniciar sesión</h2>
    </template>
    <template #content>
      <form class="flex flex-col gap-y-4 py-4" @submit.prevent="login">
        <CInputText
          v-model="email"
          label="Correo electrónico"
          placeholder="nombre@ejemplo.com"
          type="text"
          :prepend-icon="emailIcon"
          no-borders
          clear-button
        />
        <CInputText
          v-model="password"
          :class="{
            'font-mono': showPassword
          }"
          label="Contraseña"
          placeholder="********"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          prepend-icon="icon-park-twotone:lock"
          :append-icon="
            showPassword
              ? 'icon-park-outline:preview-close'
              : 'icon-park-twotone:preview-open'
          "
          no-borders
        />
        <CButton
          class="w-full"
          :loading="loading"
          :disabled="!email || !password"
          :severity="admin ? 'danger' : ''"
          type="submit"
          rounded
          label="Iniciar sesión"
        />
      </form>
    </template>
    <template #footer>
      <div class="flex flex-col gap-y-4">
        <span class="align-center flex gap-2">
          ¿No tienes una cuenta?
          <CButton to="/sign-up" variant="link" label="Regístrate" />
        </span>
        <div class="align-center flex">
          <CButton
            to="/"
            variant="text"
            icon="icon-park-outline:arrow-left"
            label="Regresar al portal"
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

const { admin } = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  showSignup: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['login'])

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const emailIcon = computed(() => {
  return admin ? 'icon-park-twotone:people-safe' : 'icon-park-twotone:mail'
})

const login = () => {
  const newCredentials = {
    email: email.value.toLowerCase().replace(/\s/g, '').trim(),
    password: password.value
  }
  emit('login', newCredentials)
}
</script>
<style scoped>

</style>
