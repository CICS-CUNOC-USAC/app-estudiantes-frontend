<template>
  <Card class="gap-4 px-4 py-8">
    <CardHeader>
      <CardTitle class="text-lg">Iniciar sesión</CardTitle>
    </CardHeader>
    <CardContent>
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
        <Button
          class="w-full"
          :loading="loading"
          :disabled="!email || !password"
          :severity="admin ? 'danger' : 'default'"
          type="submit"
          label="Iniciar sesión"
        />
      </form>
    </CardContent>
    <CardFooter class="flex flex-col items-start gap-y-4">
      <span class="flex gap-2">
        ¿No tienes una cuenta?
        <Button to="/sign-up" variant="link" label="Regístrate" />
      </span>
      <Button
        class="self-start"
        to="/recover-password"
        variant="link"
        label="¿Olvidaste tu contraseña?"
      />

      <Button
        to="/"
        variant="text"
        icon="icon-park-outline:arrow-left"
        label="Regresar al portal"
      />
    </CardFooter>
  </Card>
</template>
<script lang="ts" setup>
import CInputText from '~/components/primitives/form/CInputText.vue'
import Button from '~/components/ui/button/Button.vue'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'

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
<style scoped></style>
