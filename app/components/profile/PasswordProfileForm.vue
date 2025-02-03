<template>
  <div>
    <h3 class="my-2 text-lg font-semibold">Contraseña</h3>
    <form class="mb-6 mt-2" @submit.prevent="savePassword">
      <fieldset class="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
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
        <CInputText
          v-model="confirmPassword"
            id="confirmPassword"
            prepend-icon="icon-park-twotone:lock"
            :class="{
              'font-mono': showPassword
            }"
            label="Confirmar contraseña"
            placeholder="********"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            :append-icon="
              showPassword
                ? 'icon-park-outline:preview-close'
                : 'icon-park-twotone:preview-open'
            "
            no-borders
          />
      </fieldset>
      <CButton
        type="submit"
        label="Cambiar"
        :disabled="loading"
        class="mt-4"
        icon="lucide:check"
      />
    </form>
  </div>
</template>
<script setup lang="ts">
import CButton from '../primitives/button/CButton.vue'
import CInputText from '../primitives/form/CInputText.vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['savePassword'])

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const savePassword = async () => {
  // const form = await passForm.value?.validate()
  // if (!form.valid) return
  emit('savePassword', { user: { password: password.value } })
}
</script>

