<template>
  <div
    class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-auto max-h-[80vh] w-svw -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 shadow-lg shadow-black/15 focus:outline-none lg:max-w-xl dark:border-neutral-700 dark:bg-neutral-900"
  >
    <div class="mb-4 flex items-center justify-between">
      <span class="text-xl font-semibold"> Editar libro físico </span>
      <Button
        class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        @click="dialogRef.close()"
      >
        <Icon name="lucide:x" />
        <span class="sr-only">Close</span>
      </Button>
    </div>
    <PForm
      :initial-values="initialValues"
      :resolver="resolver"
      v-slot="$form"
      @submit="saveBook"
      class="space-y-4"
    >
      <CInputText
        label="Nombre"
        name="name"
        id="name"
        no-borders
        prepend-icon="icon-park-twotone:book"
        :error="$form.name?.error?.message"
      />
      <CTextarea
        label="Descripción"
        name="description"
        id="description"
        no-borders
        :rows="3"
        prepend-icon="icon-park-twotone:text"
        :error="$form.description?.error?.message"
      />
      <CInputText
        label="ISBN"
        name="isbn"
        id="isbn"
        no-borders
        prepend-icon="icon-park-twotone:hashtag-key"
        :error="$form.isbn?.error?.message"
      />
      <CInputText
        label="Autor"
        name="author"
        id="author"
        no-borders
        prepend-icon="icon-park-twotone:people"
        :error="$form.author?.error?.message"
      />
      <CSelect
        label="Categoría"
        name="category_id"
        id="category_id"
        :items="categories?.results || []"
        option-label="name"
        option-value="id"
        no-borders
        prepend-icon="icon-park-twotone:tree-list"
        :error="$form.category_id?.error?.message"
      />
      <div class="flex gap-4 pt-2">
        <CButton
          label="Cancelar"
          icon="icon-park-outline:arrow-left"
          severity="secondary"
          class="flex-1"
          @click="dialogRef.close()"
        />
        <CButton
          label="Guardar"
          icon="icon-park-outline:check"
          type="submit"
          class="flex-1"
          :loading="saving"
        />
      </div>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { updateBook, getAllCategories } from '~/lib/api/admin/books'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import CTextarea from '~/components/primitives/form/CTextarea.vue'

const dialogRef: any = inject('dialogRef')
const { bookItem } = dialogRef.value.data

const saving = ref(false)

const { data: categories } = await useAsyncData('categories', () =>
  getAllCategories()
)

const initialValues = reactive({
  name: bookItem.name || '',
  description: bookItem.description || '',
  isbn: bookItem.isbn || '',
  author: bookItem.author || '',
  category_id: bookItem.category_id || null
})

const resolver = zodResolver(
  z.object({
    name: z.string().nonempty('El nombre del libro es requerido'),
    description: z.string().nonempty('La descripción del libro es requerida'),
    isbn: z.string(),
    author: z.string().nonempty('El autor del libro es requerido'),
    category_id: z
      .number({ message: 'La categoría es requerida' })
      .int('La categoría es requerida')
  })
)

const saveBook = async (e: any) => {
  if (e.valid) {
    saving.value = true
    await updateBook(bookItem.id, e.values)
    saving.value = false
    dialogRef.value.close({ success: true })
  }
}
</script>
