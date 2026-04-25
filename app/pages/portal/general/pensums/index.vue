<template>
  <main class="relative">
    <nav class="space-x-4">
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        to="/"
      />
    </nav>
    <h1 class="py-3 text-xl font-semibold">
      <Icon name="lucide:presentation" class="mb-1 mr-1.5 inline-block" />
      Pensas de estudios
    </h1>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card
      v-for="(career, index) in careers"
      :key="index"
      class="pb-0 hover:bg-primary-100/75 dark:hover:bg-primary-900/30 group overflow-hidden transition"
      :to="career.route"
      >
      <CardHeader class="gap-0">
        <CardTitle class="font-heading text-lg font-semibold">
          {{ career.name }}
        </CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <img :src="career.img" class="h-28 w-full select-none object-cover" />
      </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { careers } from './(files)/consts'

useCustomPageTitle('Pensums de estudios')
definePageMeta({
  title: 'Pensums de estudios',
})
</script>


