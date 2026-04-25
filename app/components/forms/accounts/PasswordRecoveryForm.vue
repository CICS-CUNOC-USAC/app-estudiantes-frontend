<template>
  <Card class="gap-4 px-4 py-8">
    <CardHeader>
      <CardTitle class="text-lg">Recuperar contraseña</CardTitle>
      <CardDescription class="">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer
        tu contraseña.
      </CardDescription>
    </CardHeader>
    <CardContent>
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
        <Button
          class="w-full"
          :loading="loading"
          :disabled="!email"
          type="submit"
          icon="icon-park-outline:arrow-right"
          rounded
          label="Continuar"
        />
      </form>
    </CardContent>
    <CardFooter>
      <div class="flex flex-col gap-y-4">
        <div class="align-center flex">
          <Button
            to="/login"
            variant="text"
            icon="icon-park-outline:arrow-left"
            label="Regresar a inicio de sesión"
          />
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
<script lang="ts" setup>
import CInputText from '~/components/primitives/form/CInputText.vue';
import Button from '~/components/ui/button/Button.vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';

const { loading } = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['recover'])

const email = ref('')
const handleRecovery = () => {
  emit('recover', email.value)
}
</script>
