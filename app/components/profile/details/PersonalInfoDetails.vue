<template>
  <div>
    <h3 class="my-2 text-lg font-semibold">Información personal</h3>
    <section class="mb-6 mt-2 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
      <CInputText
        id="first_name"
        v-model="profile.first_name"
        label="Nombre(s)"
        readonly
        no-borders
        prepend-icon="icon-park-twotone:people"
      />
      <CInputText
        id="last_name"
        v-model="profile.last_name"
        label="Apellido(s)"
        readonly
        no-borders
        prepend-icon="icon-park-twotone:people"
      />

      <CInputText
        id="email"
        v-model="user.email"
        label="Correo electrónico"
        readonly
        no-borders
        prepend-icon="icon-park-twotone:mail"
      />
      <CInputText
        id="ra"
        v-model="user.ra"
        label="Registro académico"
        readonly
        no-borders
        prepend-icon="icon-park-twotone:id-card-h"
      />
    </section>

    <h3 class="my-2 text-lg font-semibold">Académico</h3>
    <section class="mb-6 mt-2 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <CInputText
        v-model="user.career.name"
        label="Carrera"
        readonly
        no-borders
        prepend-icon="icon-park-twotone:bachelor-cap-one"
      />

      <CInputText
        v-model="user.career.code"
        label="Código de carrera"
        readonly
        no-borders
        prepend-icon="icon-park-outline:pound-sign"
      />
    </section>
  </div>
</template>
<script lang="ts">
import CInputText from '~/components/primitives/form/CInputText.vue'
import { type User } from '~/stores/regular-auth'

export default {
  components: {
    CInputText
  },
  props: {
    src: {
      type: Object as PropType<User | null>,
      required: true
    }
  },
  emits: ['save'],
  data() {
    return {
      profile: {
        first_name: '',
        last_name: ''
      },
      user: {
        email: '',
        ra: '',
        career: {
          code: '',
          name: ''
        }
      }
    }
  },
  watch: {
    src: {
      immediate: true,
      handler(val) {
        this.profile = { ...val.profile }
        this.user = { ...val }
      }
    }
  }
}
</script>
