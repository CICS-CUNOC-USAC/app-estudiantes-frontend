<template>
  <div class="pb-8">
    <h1 class="mb-8 text-2xl">
      {{ getSaludo() }},
      <span class="font-medium">{{ user?.profile.first_name ?? '...' }}</span>
    </h1>

    <div class="grid gap-6 md:grid-cols-2">
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

      <section>
        <h2 class="text-muted-color-emphasis mb-4 font-bold">
          Estadísticas generales:
        </h2>

        <section
          class="border-surface-950/75 bg-surface-50 text-color dark:bg-surface-900 h-48  overflow-hidden rounded-xl border p-5 duration-300 ease-in-out"
        >
          <div v-if="status === 'success' && data" class="grid grid-cols-2 gap-4">
            <div>
              <h6 class="text-muted-color">Créditos acumulados:</h6>
              <strong class="text-muted-color-emphasis text-3xl">{{
                data.current_credits.total_credits
              }}</strong>
            </div>
            <div>
              <h6 class="text-muted-color">Créditos obligatorios:</h6>
              <strong class="text-primary-500 text-3xl">{{
                data.current_credits.mandatory_credits
              }}</strong>
              /
              <span class="text-muted-color-emphasis text-3xl">
                {{ data.mandatory_credits }}</span
              >
            </div>
            <div>
              <h6 class="text-muted-color">Créditos optativos:</h6>
              <strong class="text-primary-500 text-3xl">{{
                data.current_credits.not_mandatory_credits
              }}</strong>
              /
              <span class="text-muted-color-emphasis text-3xl">
                {{ data.not_mandatory_credits }}</span
              >
            </div>
            <div>
              <h6 class="text-muted-color">Créditos disponibles:</h6>
              <strong class="text-primary-500 text-3xl">{{
                data.current_credits.total_credits
              }}</strong>
              /
              <span class="text-muted-color-emphasis text-3xl">
                {{ data.available_credits }}
              </span>
            </div>
          </div>
          <template v-else>
            <div class="flex items-center justify-center h-full">
              <Icon name="lucide:loader" size="32" class="animate-spin" />
            </div>
          </template>
        </section>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'

const { user } = useRegularAuthStore()

const items = [
  {
    icon: 'icon-park-twotone:user',
    title: 'Perfil',
    description: 'Ver informacion de tu perfil',
    to: '/dashboard/profile'
  },
  {
    icon: 'icon-park-twotone:chart-line-area',
    title: 'Progreso Academico',
    description: 'Ver informacion de tu progreso en la carrera',
    to: '/dashboard/pensum/progress'
  },
  {
    icon: 'icon-park-twotone:book',
    title: 'Biblioteca Fisica',
    description: 'Libros disponibles en la biblioteca de Ingenieria',
    to: '/dashboard/books/physical'
  },
  {
    icon: 'icon-park-twotone:book-one',
    title: 'Biblioteca Digital',
    description: 'Libros disponibles en la biblioteca digital',
    to: '/dashboard/books/digital'
  }
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

const { data, status } = await useAsyncData<{
  current_credits: ProgressCredits
  mandatory_credits: number
  not_mandatory_credits: number
  available_credits: number
}>(() => $api('/user-courses-progress/stats'), {
  lazy: true
})

definePageMeta({
  layout: 'dashboard'
})
</script>
<style lang=""></style>
