<template>
  <main>
    <h1 class="mb-8 text-2xl">
      {{ getSaludo() }},
      <span class="font-medium">{{ user?.first_name ?? '...' }}</span>
    </h1>

    <section>
      <h2 class="text-muted-color-emphasis mb-4 font-bold">
        Accesos Directos:
      </h2>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-2">
        <CCardAlt
          interactive
          unstyled
          class="pb-14"
          v-for="item in items"
          :key="item.title"
          :to="item.to"
        >
          <template #content>
            <div class="flex flex-col gap-4 lg:flex-row">
              <Icon
                :name="item.icon"
                class="text-primary-600 dark:text-primary-200 shrink-0"
                size="26"
              ></Icon>

              <div class="">
                <h2 class="font-bold">{{ item.title }}</h2>
                <h3>{{ item.description }}</h3>
              </div>
            </div>
          </template>
        </CCardAlt>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'

const { user } = useStaffAuthStore()

const items = [
  {
    icon: 'icon-park-twotone:user',
    title: 'Perfil',
    description: 'Ver informacion de tu perfil',
    to: '/admin/me'
  },
  {
    icon: 'icon-park-twotone:book',
    title: 'Biblioteca Fisica',
    description: 'Administrar libros disponibles en la biblioteca de Ingenieria',
    to: '/admin/books/physical'
  },
  {
    icon: 'icon-park-twotone:book-one',
    title: 'Biblioteca Digital',
    description: 'Administrar libros disponibles en la biblioteca digital',
    to: '/admin/books/digital'
  },
  {
    icon: 'lucide:hand-helping',
    title: 'Prestamos Externos',
    description: 'Administrar prestamos externos pendientes de la biblioteca de Ingenieria',
    to: '/admin/loans/outstanding'
  },
]


function getSaludo() {
  const horaActual = new Date().getHours()
  if (horaActual >= 6 && horaActual < 12) {
    return 'Buenos días'
  } else if (horaActual >= 12 && horaActual < 19) {
    return 'Buenas tardes'
  } else {
    return 'Buenas noches'
  }
}

definePageMeta({
  layout: 'admin'
})
</script>
<style scoped></style>
