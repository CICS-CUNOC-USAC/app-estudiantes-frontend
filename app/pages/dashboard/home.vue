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

        <CCardAlt class="h-max rounded-xl border duration-300 ease-in-out">
          <template #content>
            <div
              v-if="status === 'success' && data"
              class="grid grid-cols-2 gap-4"
            >
              <div
                v-for="stat in [
                  {
                    label: 'Créditos acumulados:',
                    current: data.current_credits.total_credits,
                    total: null,
                    valueClass: 'text-muted-color-emphasis'
                  },
                  {
                    label: 'Créditos obligatorios:',
                    current: data.current_credits.mandatory_credits,
                    total: data.mandatory_credits,
                    valueClass: 'text-primary-500'
                  },
                  {
                    label: 'Créditos optativos:',
                    current: data.current_credits.not_mandatory_credits,
                    total: data.not_mandatory_credits,
                    valueClass: 'text-primary-500'
                  },
                  {
                    label: 'Créditos disponibles:',
                    current: data.current_credits.total_credits,
                    total: data.available_credits,
                    valueClass: 'text-primary-500'
                  }
                ]"
                :key="stat.label"
                class="space-y-1"
              >
                <h6 class="text-muted-color">{{ stat.label }}</h6>
                <div class="flex items-baseline gap-2">
                  <strong class="text-2xl" :class="stat.valueClass">
                    {{ stat.current }}
                  </strong>
                  <span
                    v-if="stat.total !== null"
                    class="text-muted-color-emphasis text-2xl"
                  >
                    / {{ stat.total }}
                  </span>
                </div>
              </div>
            </div>
            <template v-else>
              <div class="flex h-full items-center justify-center">
                <Icon name="lucide:loader" size="32" class="animate-spin" />
              </div>
            </template>
          </template>
        </CCardAlt>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import type { ProgressCredits } from '~/lib/api/dashboard/career-progress'

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
